require("dotenv").config({ override: true });
// console.log("DEBUG MONGO_URL =", process.env.MONGO_URL);
const cors = require("cors");
const { getExploreProjects } = require("./controllers/project/getProjects");

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const authRouter = require('./routes/auth');

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas connected"));

// console.log(process.env.MONGO_URI);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

// router.get("/explore", getExploreProjects);

app.use(checkForAuthenticationCookie("token"));

app.use('/user', userRouter);
app.use('/project', projectRouter);
const taskRouter = require('./routes/task');
app.use('/task', taskRouter);

// Socket.IO handling
const Message = require('./models/message');
const { verifyToken } = require('./services/authentication'); // assuming this function exists

io.use((socket, next) => {
  const authToken = socket.handshake.auth.token;
  const cookieHeader = socket.handshake.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [name, ...rest] = c.split('=');
        return [name, rest.join('=')];
      })
  );

  const token = authToken || cookies.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const user = verifyToken(token);
    if (!user) {
      return next(new Error('Authentication error'));
    }
    socket.user = user;
    next();
  } catch (err) {
    console.error('Socket auth error', err);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const senderId = socket.user._id || socket.user.id || null;
  const senderName = socket.user.fullName || socket.user.name || "Unknown";
  console.log('User connected:', senderId);

  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`User ${senderId} joined project ${projectId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { projectId, text } = data;
    const message = new Message({
      sender: senderId,
      project: projectId,
      text,
    });
    await message.save();
    io.to(projectId).emit('newMessage', {
      id: message._id,
      sender: senderId,
      senderName,
      text,
      timestamp: message.timestamp,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });
});

server.listen(PORT, () => console.log(`server started at port: ${PORT}`));
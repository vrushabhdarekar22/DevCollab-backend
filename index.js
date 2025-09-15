

require("dotenv").config({ override: true });
// const {Socket}=require("socket.io");
// import { Socket } from "socket.io";
// console.log("DEBUG MONGO_URL =", process.env.MONGO_URL);

const {Server} = require("socket.io");
const http=require("http");
const Message =require("./models/projectMessage") ;


const express=require("express");
const mongoose=require("mongoose");

const cookieParser=require('cookie-parser');

const userRouter=require('./routes/user');
const projectRouter=require('./routes/project');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*"   // means allow any frontend to connect
    //after we have to add frontend`s real URL
  }
});

io.on("connection", (Socket) => {
  console.log("User connected",socket.id);

  Socket.on("joinRoom",(projectId)=>{
    Socket.join(projectId);
  });

  Socket.on("sendMessage",async ({projectId,senderId,text})=>{
    const msg = await Message.create({projectId,senderId,text});
    io.to(projectId).emit("newMessage",msg);
  })
  
});

const PORT=process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas connected"));

app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use('/user',userRouter);
app.use('/projects',projectRouter);

  

server.listen(PORT,()=>console.log(`server started at port: ${PORT}`));
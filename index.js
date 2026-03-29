require("dotenv").config({ override: true });
// console.log("DEBUG MONGO_URL =", process.env.MONGO_URL);
const cors = require("cors");
const {getExploreProjects} = require("./controllers/project/getProjects")


const express=require("express");
const mongoose=require("mongoose");
const router = express.Router();
const cookieParser=require('cookie-parser');

const userRouter=require('./routes/user');
const projectRouter=require('./routes/project');
const authRouter = require('./routes/auth');

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();

const PORT=process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas connected"));

  // console.log(process.env.MONGO_URI);


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth',authRouter);

// router.get("/explore", getExploreProjects);

app.use(checkForAuthenticationCookie("token"));

app.use('/user',userRouter);
app.use('/project',projectRouter);
const taskRouter = require('./routes/task');
app.use('/task', taskRouter);

app.listen(PORT,()=>console.log(`server started at port: ${PORT}`));
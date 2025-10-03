
require("dotenv").config({ override: true });
// console.log("DEBUG MONGO_URL =", process.env.MONGO_URL);

const express=require("express");
const mongoose=require("mongoose");

const cookieParser=require('cookie-parser');

const userRouter=require('./routes/user');
const projectRouter=require('./routes/project');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();

const PORT=process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas connected"));

app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use('/user',userRouter);
app.use('/projects',projectRouter);

  

app.listen(PORT,()=>console.log(`server started at port: ${PORT}`));
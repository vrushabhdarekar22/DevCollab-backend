const express=require("express");
const mongoose=require("mongoose");

const userRouter=require('./routes/user');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();

const PORT=8000;

app.use(express.json());

app.use(checkForAuthenticationCookie("token"));

app.use('/user',userRouter);


mongoose.connect('mongodb://127.0.0.1:27017/devCollab').then(()=>console.log("MONGODB connected successfully"));

app.listen(PORT,()=>console.log(`server started at port: ${PORT}`));
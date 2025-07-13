const Route=require('express');
const router=Route();
const User=require('../models/user')

router.get("/signin",(req,res)=>{
    res.json({message:'signin page here'})    
    // return res.render("signin")
});

router.get("/signup",(req,res)=>{
    
    res.json({message:'signup page here'}) 
    // return res.render("signup")
});

router.post("/signup",async (req,res)=>{
    console.log("body:",req.body);
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    })
});


module.exports=router;
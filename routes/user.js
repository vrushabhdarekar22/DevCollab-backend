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
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    })

    res.status(201).json({message:'account created successfully'})
});

router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const token=await User.matchPasswordandGenerateToken(email,password);
        return res.cookie("token",token).status(201).json({message:"login successfull"});
    }catch(error){
        res.json({error:"incorrect email or password"});
    }
   
})

module.exports=router;
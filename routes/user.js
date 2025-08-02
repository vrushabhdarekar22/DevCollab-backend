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
        res.status(401).json({error:"incorrect email or password"});
    }
   
})


//update profile
router.put("/profile",async (req,res)=>{
    const userId=req.user._id;
    const {fullName,bio,skills,githubURL,linkedinURL,profileImage}=req.body;

    try{
        const updatedUser=await User.findByIdAndUpdate(userId,
            {fullName
                ,bio
                ,skills
                ,githubURL,
                linkedinURL
                ,profileImage},
                {new:true,runValidators:true})
        
                
        res.status(201).json({message:"profile updated successfuly"});
    }catch(error){
        console.error("profile update failed");
        res.status(500).json({error:'internal server error'});
    }
})

router.get("/profile",async (req,res)=>{  
    try{
        const userId=req.user._id;
        const user=await User.findById(userId).select('-password -salt -createdAt -updatedAt');

        if(!user) return res.status(404).json({error:'user not found'});
        res.json(user);
    }catch(error){
        console.error("error faitching own profile");
        res.status(500).json({error:'internal server error'});
    }
})


router.get("/profile/:id",async (req,res)=>{
    try{
        const {id:userId}=req.params;
        const user=await User.findById(userId).select('fullName email bio skills githubURL linkedinURL profileImage projects');

        if(!user) return res.status(404).json({error:'user not found'});
        res.json(user);
    }catch(error){
        console.error("error faitching other`s profile");
        res.status(500).json({error:'internal server error'});
    }
    

})
module.exports=router;
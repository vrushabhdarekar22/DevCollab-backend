
async function toLogin(req,res) {
    const {email,password}=req.body;
    try{
        const token=await User.matchPasswordandGenerateToken(email,password);
        return res.cookie("token",token).status(201).json({message:"login successfull"});
    }catch(error){
        return res.status(401).json({error:"incorrect email or password"});
    }
}

module.exports = {
    toLogin,
}
const User = require("../../models/user");
async function toLogin(req,res) {
    const {email,password}=req.body;
    try{
        const token=await User.matchPasswordandGenerateToken(email,password);
        console.log(token);
        
        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(201).json({message:"login successfull"});
    }catch(error){
        return res.status(401).json({error:"incorrect email or password"});
    }
}

module.exports = {
    toLogin,
}
const { verifyToken } = require("../services/authentication");
const User=require('../models/user');

 function checkForAuthenticationCookie(cookieName){
    return async (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];

        if(!tokenCookieValue){
            return next();
        } 
        
        try{
            const decoded = verifyToken(tokenCookieValue);
            if (!decoded) {
                return next();
            }
            const user = await User.findById(decoded._id);
            req.user = user;
        }catch(err) {
            console.error('Authentication error:', err);
        }

        return next();
    }
}

module.exports={
    checkForAuthenticationCookie,
}
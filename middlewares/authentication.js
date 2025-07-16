const { verifyToken } = require("../services/authentication");


function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];

        if(!tokenCookieValue){
            return next();
        } 
        
        try{
            const payLoad = verifyToken(tokenCookieValue);
            req.user = payLoad;
        }catch(err) {}

        return next();
    }
}

module.exports={
    checkForAuthenticationCookie,
}
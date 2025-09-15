
const User = require("../../models/user");

async function toUpdateProfile(req,res){
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
        
                
        return res.status(201).json({message:"profile updated successfuly"});
    }catch(error){
        console.error("profile update failed");
        return res.status(500).json({error:'internal server error'});
    }
}

module.exports = {
    toUpdateProfile,
}
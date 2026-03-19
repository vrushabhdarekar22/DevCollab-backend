const Project = require("../../models/project");

async function toSendRequest(req,res){

    try{

        const userId=req.user._id;
        const {message}=req.body;
    
        const project=await Project.findById(req.body.projectId);
    
        if(!project){
            return res.status(404).json({message:'project not found'});
        }
    
        // Owner can't send join request to own project
        if (project.createdBy.toString() === userId.toString()) {
            return res.status(403).json({ message: 'Project owner cannot request to join the same project' });
        }

        const alreadyRequested = project.joinRequests.some(r => r.user.toString() === userId.toString());
        const alreadyMember = project.members.some(m => m.user.toString() === userId.toString());
    
        if(alreadyRequested || alreadyMember){
            return res.json({message:'already member or requested'});
        }
    
        project.joinRequests.push({user:userId,message:message});
        await project.save();//this will save changes
    
        return res.status(200).json({message:'join request sent successfully'});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    toSendRequest,
}
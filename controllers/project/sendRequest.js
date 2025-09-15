async function toSendRequest(req,res){

    try{

        const userId=req.user._id;
        const {message}=req.body;
    
        const project=await Project.findById(req.params.id);
    
        if(!project){
            return res.status(404).json({message:'project not found'});
        }
    
        const alreadyRequested=project.joinRequests.some(r => r.user.toString()===userId.toString());
        const alreadyMember=project.members.includes(userId);
    
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
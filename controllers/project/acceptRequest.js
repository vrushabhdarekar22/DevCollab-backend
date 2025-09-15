const Project = require("../../models/project");
const User = require("../../models/user");

async function toAcceptRequest(req,res){
    //have to add user in members
    // joinRequests status=accept
    const {id:projectId,userId}=req.params;
    try{
        const project=await Project.findById(projectId);
        const user=req.user;
        if(!project){
            return res.status(404).json({error:'Project not found'});
        }
        // console.log("project",project);
        
        // console.log("user: ",user);
        // console.log("join request: ",project.joinRequests);
        
        const request=project.joinRequests.find(req=>req.user.toString()===userId);
    
        if(!request){
            return res.status(404).json({error:'request not found'});
        }
        if(request.status==="accepted"){
            return res.json({message:"request already accepted"})
        }
                                         
        request.status='accepted';
        project.members.push({
            user:userId,
            role:request.role,
        });
        await project.save();

        await User.findByIdAndUpdate(userId,{
          $push:{joinedProjects:project._id}
        });

        return res.status(201).json({message:'request accepted'});
    }
    catch(error){
        console.error('Error accepting request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    toAcceptRequest,
}
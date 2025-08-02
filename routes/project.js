const Route=require('express');
const router=Route();
const Project=require('../models/project');
const User=require('../models/user');
const {checkForAuthorization}=require('../middlewares/authorization')
router.post('/',async (req,res)=>{
    // console.log(req.user);
    const {title,description}=req.body;
    const project=await Project.create({
        title,
        description,
        createdBy:req.user._id,
    })
    console.log('project:',project);
    
    //we have to push project id in owned project
    await User.findByIdAndUpdate(req.user._id,{
        $push:{ownedProjects:project._id}
    });
    
    res.status(201).json('project created');
});

//projects/id
router.get('/:id',async (req,res)=>{
    try{
        const userId=req.user._id;
        const project=await Project.findById(req.params.id)
                      .populate('createdBy','fullName email')
                      .populate('members','fullName email');
        
        if(!project){
            return res.status(400).json({message:'project not found'})
        }
    
        const isOwner=project.createdBy._id.toString() === userId.toString();
        const isMember=project.members.some(m => m._id.toString() === userId.toString());
        
        const response = {
            _id: project._id,
            title: project.title,
            description: project.description,
            createdBy: project.createdBy,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        if(isOwner || isMember){
            response.members=project.members;
        }else{
            response.members="Restricted-join project to see members"
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({message:'server error'});
    }
});



router.post('/:id/requests',async (req,res) =>{
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

    res.status(200).json({message:'join request sent successfully'});
});


//project request only owner can see
router.get('/:id/requests',checkForAuthorization, async (req,res)=>{
    try{
        const ProjectId=req.params.id;

        const project=await Project.findById(ProjectId)
                      .populate('joinRequests.user','fullName email');

        if(!project){
            return res.status(404).json({error:'Project not found'})
        }

        const pendingRequests=project.joinRequests.filter(req=>req.status==='pending');

        return res.status(201).json(pendingRequests);
    }catch(error){
        console.error('Failed to fetch join requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/:id/requests/:userId/accept',checkForAuthorization,async (req,res)=>{
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
})

router.post('/:id/requests/:userId/reject',checkForAuthorization, async (req,res)=>{
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
        if(request.status==="rejected"){
            return res.json({message:"request already rejected"})
        }
                                         
        // request.status='rejected';

        await Project.findByIdAndUpdate(projectId, {
            $pull: { joinRequests: {user:userId }}
        });


        return res.status(201).json({message:'request rejected'});
    }
    catch(error){
        console.error('Error rejecting request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})
module.exports=router;
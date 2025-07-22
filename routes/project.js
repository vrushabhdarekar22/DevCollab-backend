const Route=require('express');
const router=Route();
const Project=require('../models/project');

router.post('/',async (req,res)=>{
    // console.log(req.user);
    const {title,description}=req.body;
    const project=await Project.create({
        title,
        description,
        createdBy:req.user._id,
    })
    console.log('project:',project);
    
    res.status(201).json('project created');
});

//project/id
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
})
module.exports=router;
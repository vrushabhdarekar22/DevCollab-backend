
const Project = require("../../models/project");

async function toViewProject(req,res){
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

        return res.status(200).json(response);
    }catch(error){
        return res.status(500).json({message:'server error'});
    }
}


module.exports = {
    toViewProject,
}
const {Schema,model} = require("mongoose");

const projectMessageSchema = new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:"project",
        required:true,
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"project",
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    edited: {
      type: Boolean,
      default: false,
    },
},{timestamps:true});

const ProjectMessage = model("projectMessage",projectMessageSchema);

module.exports=ProjectMessage;
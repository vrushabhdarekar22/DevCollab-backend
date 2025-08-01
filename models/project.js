const {Schema,model}=require("mongoose");

const projectSchema=new Schema({
    title:{
        type:String,
        // required:true,
    },
    description:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    members:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:"user"
        },
        role:{
            type:String
        },
    }],
    status:{
        type:String,
        enum:['open','closed','completed'],
        default:'open',
    },
    joinRequests:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:"user",
        },
        message:{
            type:String,
        },
        role:{
            type:String
        },
        status:{
            type:String,
            enum:['pending','accepted','rejected'],
            default:'pending',
        }
    }]

},{timestamps:true});

const Project=model("project",projectSchema);

module.exports=Project;
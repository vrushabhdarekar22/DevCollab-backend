const {Schema,model}=require("mongoose");

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    //this can be edited after signup
    bio:{
        type:String,
        default:"",
    },
    skills:{
        type:String,
        default:"",
    },
    githubURL:{
        type:String,
        default:"",
    },
    linkedinURL:{
        type:String,
        default:"",
    },
    profileImage:{
        type:String,
        default:"",
    }
   
},{timestamps:true});

const User=model("user",userSchema);

module.exports=User;

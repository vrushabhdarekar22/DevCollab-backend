const Route=require('express');
const router=Route();

const {toSignUp} = require("../controllers/user/createAccount");
const {toLogin} = require("../controllers/user/toLogin");
const {getProfile} = require("../controllers/user/profile");
const {toUpdateProfile} = require("../controllers/user/updateProfile");
const {toViewOthersProfile} = require("../controllers/user/viewOthersProfile");


//user
router.post("/signup",toSignUp);
router.post("/signin",toLogin);


router.get("/view-profile",getProfile);
//update profile
router.put("/update-profile",toUpdateProfile);
router.get("/view-others-profile/:id",toViewOthersProfile);


module.exports=router;
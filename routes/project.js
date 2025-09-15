const Route=require('express');
const router=Route();

const {checkForAuthorization}=require('../middlewares/authorization');

const {toCreateProject} = require("../controllers/project/createProject");
const {toViewProject} = require("../controllers/project/viewProject");
const {toSendRequest} = require("../controllers/project/sendRequest");
const {toViewRequest} = require("../controllers/project/viewRequest");
const {toAcceptRequest} = require("../controllers/project/acceptRequest");
const {toRejectRequest} = require("../controllers/project/rejectRequest");


router.post('/create-project',toCreateProject);
router.get('/view-project',toViewProject);//projects/id


router.post('/send-request',toSendRequest);
router.get('/view-request',checkForAuthorization, toViewRequest);//project request only owner can see
router.post('/accept-request',checkForAuthorization,toAcceptRequest);
router.post('/reject-request',checkForAuthorization, toRejectRequest);


module.exports=router;
const express = require("express")
const Router = express.Router();
const {toSignUp} = require("../controllers/user/createAccount")
const {toLogin} = require("../controllers/user/toLogin")



Router.post('/signup',toSignUp)
Router.post('/signin',toLogin)

module.exports=Router;
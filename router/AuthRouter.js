const express=require('express');
const AuthRouter=express.Router();
const AuthController=require('../controllers/Auth-Controller.js')

AuthRouter.get('/',AuthController.getIndex);
AuthRouter.get('/login',AuthController.getLogin);
AuthRouter.post("/postLogin",AuthController.postLogin)
AuthRouter.post("/logout",AuthController.postLogout)
AuthRouter.get('/signup',AuthController.getSignUp)
AuthRouter.post('/signup',AuthController.postSignUp)

module.exports=AuthRouter;
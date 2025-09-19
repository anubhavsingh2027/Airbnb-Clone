const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt= require("bcryptjs");
const home =require('../models/home');

exports.getIndex=(req,res,next)=>{
  home.find().then(registredHomename=>{
    res.render('Auth/index',{registredHomename :registredHomename,pagetitle:'Airnb Home',currentpage:'index'  ,isLoggedIn:req.session.isLoggedIn,user:req.session.user});
  }).catch(err=>{
    console.log("error occured",err)
  })
};
exports.getSignUp=(req,res,next)=>{
  res.render('Auth/signup',{pagetitle:'Signup',currentpage:'signup' ,isLoggedIn:false,errors: [],
    oldInput: {firstName: "", lastName: "", email: "", userType: ""},
    user: {}})
}

exports.postSignUp=[
  check("firstName")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

 check('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail({
    gmail_remove_dots: false,
    all_lowercase: false
  }),
  check("password")
  .isLength({min: 8})
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .withMessage("Password should contain atleast one special character")
  .trim(),

  check("confirmPassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host'])
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),
(req,res,next)=>{
const {firstName,lastName,email,password,userType}=req.body;
const errors=validationResult(req);
if(!errors.isEmpty()){
  return res.status(422).render('Auth/signup',{
    pagetitle:'SignUp',
    isLoggedIn:false,
    errors:errors.array().map(error=>error.msg),
    oldInput:{
      firstName,
      lastName,
      email,
      password,
      userType
    }
  });
}

bcrypt.hash(password,12).then(hashedPassword=>{
  const user=new User({firstName,lastName,email:email.toLowerCase(),password:hashedPassword,userType});
  return user.save();
}).then(()=>{
  res.redirect('/login');
}).catch(err=>{
    console.log('eRROR while saving User :',err);
  return res.status(422).render('Auth/signup',{
    pagetitle:'SignUp',
    isLoggedIn:false,
    errors:err,
    oldInput:{
      firstName,
      lastName,
      email,
      password,
      userType
    }
  });
})
}]

exports.getLogin=(req,res,next)=>{
  res.render('Auth/login',{pagetitle:'Login' ,isLoggedIn:false ,errors:{},oldInput:{}});
}

exports.postLogin=async(req,res,next)=>{
   try {
        let { email, password } = req.body;
        email = email.toLowerCase();

        const user = await User.findOne({ email });

      if(!user){
  return res.status(422)
  .render('Auth/login',{
    pagetitle:'Login',
    isLoggedIn:false,
    errors:["User does not exist"],
        });
                }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
     return res.status(422)
  .render('Auth/login',{
    pagetitle:'Login',
    isLoggedIn:false,
    errors:["Password Incorrect"]
        });
    }
  req.session.isLoggedIn=true;
  req.session.user=user;
  await req.session.save();

  if(user.userType==='guest'){
  res.redirect('/user/home-list');
  }
  else{
  res.redirect('/host/host-home-list');

  }}
 catch (error) {
        next(error);
        }

}

exports.postLogout= (req,res,next)=>{
 req.session.destroy(()=>{
   res.redirect('/');

 });
};

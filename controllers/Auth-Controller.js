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


exports. postSignUp = [
  // ✅ Validations
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail({
      gmail_remove_dots: false,
      all_lowercase: false,
    }),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  // =============================
  // MAIN SIGNUP HANDLER
  // =============================
  async (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("Auth/signup", {
        pagetitle: "Sign Up",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        userType,
      });

      await user.save();

      // =============================
      // EMAIL TEMPLATES
      // =============================
      const createWelcomeEmailTemplate = (name, websiteUrl) => `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #ff385c; padding: 20px; text-align: center;">
              <img src="https://airbnb-clone.anubhav.sbs/favicon.ico" alt="Logo" style="width: 48px; vertical-align: middle;">
              <h1 style="color: #fff; margin: 10px 0 0;">Welcome to Airbnb Clone!</h1>
            </div>
            <div style="padding: 30px; color: #333;">
              <h2 style="margin-top: 0;">Hi ${name},</h2>
              <p>We’re thrilled to have you join our community of travelers and hosts! 🏡</p>
              <p>Here’s what you can do next:</p>
              <ul style="line-height: 1.8;">
                <li>🏠 Explore unique stays around the world.</li>
                <li>💬 Connect with hosts and plan your perfect trip.</li>
                <li>⭐ Save your favorite listings for later.</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${websiteUrl}" style="background-color: #ff385c; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Visit Airbnb Clone</a>
              </div>
              <p>If you ever need help, our support team is just one click away.</p>
              <p>Welcome aboard, <strong>${name}</strong> — your adventure begins now! 🌍</p>
              <p style="margin-top: 40px; font-size: 14px; color: #888;">Warm wishes,<br>The Airbnb Clone Team</p>
            </div>
            <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Airbnb Clone · <a href="${websiteUrl}" style="color:#ff385c; text-decoration:none;">Visit Website</a>
            </div>
          </div>
        </div>
      `;

      const newCustomer = (name, email) => `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #ff385c; padding: 20px; text-align: center;">
              <img src="https://airbnb-clone.anubhav.sbs/favicon.ico" alt="Logo" style="width: 40px;">
              <h1 style="color: white; margin: 10px 0 0;">New User Registration</h1>
            </div>
            <div style="padding: 30px; color: #333;">
              <h2>Hey Admin 👋,</h2>
              <p>A new user has just signed up on <strong>Airbnb Clone</strong>.</p>
              <div style="background-color: #fff5f7; padding: 15px; border-left: 4px solid #ff385c; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
              </div>
              <p>Check your admin dashboard for user details or verification.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://airbnb-clone.anubhav.sbs/" style="background-color: #ff385c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
              </div>
              <p style="margin-top: 40px; font-size: 14px; color: #888;">Best,<br>Airbnb Clone System</p>
            </div>
            <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Airbnb Clone · <a href="https://airbnb-clone.anubhav.sbs/" style="color:#ff385c; text-decoration:none;">Visit Website</a>
            </div>
          </div>
        </div>
      `;

      // =============================
      // SEND EMAILS
      // =============================
      const payloadUser = {
        to: email,
        subject: "Welcome To Airbnb Clone",
        websiteName: "Airbnb Clone",
        message: createWelcomeEmailTemplate(firstName, "https://airbnb-clone.anubhav.sbs/"),
      };

      const payloadAdmin = {
        to: "anubhavsinghcustomer@gmail.com",
        subject: "New Customer From Airbnb Clone",
        websiteName: "Airbnb Clone",
        message: newCustomer(firstName, email),
      };

      // ✅ Send both emails asynchronously
      Promise.all([
        fetch("https://mail.anubhav.sbs/sendMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadUser),
        }),
        fetch("https://mail.anubhav.sbs/sendMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadAdmin),
        }),
      ]).catch((err) => console.error("Email send failed:", err));

      // Redirect after success
      res.redirect("/login");
    } catch (err) {
      console.error(err);
      return res.status(500).render("Auth/signup", {
        pagetitle: "Sign Up",
        isLoggedIn: false,
        errors: ["Something went wrong. Please try again."],
        oldInput: { firstName, lastName, email, password, userType },
      });
    }
  },
];





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

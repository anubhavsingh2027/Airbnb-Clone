
const home=require("../models/home")
const User=require("../models/user")





exports.getHomes=(req,res,next)=>{

 home.find().then(registredHomename=>{
    res.render('store/home-list',{registredHomename :registredHomename,pagetitle:'Home List',currentpage:'homes' ,isLoggedIn:req.session.isLoggedIn,user:req.session.user });
  });
};



exports.gethomesDetails=(req,res,next)=>{
  const homeId= req.params.homeId;
  home.findById(homeId).then(homes=>{

    if(!home){
      console.log('homes not found');
      res.redirect("/user/home-list");
    }

    else{

    res.render('store/home-details',{home:homes,pagetitle:`${homes.housename}`,currentpage:'homeDetail' ,isLoggedIn:req.session.isLoggedIn,user:req.session.user});
    }
  });

};




exports.getfavouriteList=async (req,res,next)=>{
  const userId = req.session.user._id;
  const userfav = await User.findById(userId).populate('favourites');
 res.render('store/favourite-list',{favouriteList:userfav.favourites,pagetitle:'My Favourite',currentpage:'favourite'  ,isLoggedIn:req.session.isLoggedIn,user:req.session.user});

};

exports.postfavouriteList= async (req,res,next)=>{
const  homeId=req.params.homeId;
const  userId=req.session.user._id;
const user= await User.findById(userId);
if(!user.favourites.includes(homeId)){
  user.favourites.push(homeId);
    await user.save();
}

res.redirect("/user/favourite");


};






exports.deleteFavourite=async (req,res,next)=>{

const homeId=req.params.homeId;
const  userId=req.session.user._id;
const user= await User.findById(userId);
 if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
res.redirect('/user/favourite');



};

exports.getbooking=(req,res,next)=>{
 const homeId= req.params.homeId;
  home.findById(homeId).then(homes=>{

    if(!homes){
      console.log('homes not found');
      res.redirect("/user/home-list");
    }

    else{

    res.render('store/booking',{home:homes,pagetitle:'Booking',currentpage:'booking' ,isLoggedIn:req.session.isLoggedIn,user:req.session.user });
    }
  });
};

exports.postbooking = (req, res, next) => {
  const homeId = req.params.homeId;

  home.findById(homeId).then(async (homes) => {
    if (!homes) {
      console.log("homes not found");
      return res.redirect("/user/home-list");
    }

    const order = req.body;
    if (order.specialRequests === "") {
      order.specialRequests = "Nothing";
    }

    function createWelcomeEmailTemplate(name, websiteUrl) {
      return `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #ff385c; padding: 20px; text-align: center;">
            <img src="https://airbnb-clone.anubhav.sbs/favicon.ico" alt="Logo" style="width: 40px; vertical-align: middle;">
            <h1 style="color: white; margin: 10px 0 0;">Booking Confirmed!</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <h2 style="margin-top: 0;">Hi ${name},</h2>
            <p>We’re excited to let you know that your booking has been confirmed! 🎉</p>
            <p>Your stay is now officially reserved. You can manage your booking, check details, or explore more stays anytime on our website.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${websiteUrl}" style="background-color: #ff385c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">View My Booking</a>
            </div>
            <p>If you have any questions or special requests, feel free to reach out — we’re here to help make your stay amazing.</p>
            <p>Thank you for choosing <strong>Airbnb Clone</strong>!</p>
            <p style="margin-top: 40px; font-size: 14px; color: #888;">Warm regards,<br>The Airbnb Clone Team</p>
          </div>
          <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} Airbnb Clone · <a href="${websiteUrl}" style="color:#ff385c; text-decoration:none;">Visit Website</a>
          </div>
        </div>
      </div>`;
    }

    function newCustomer(name, email) {
      return `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #ff385c; padding: 20px; text-align: center;">
            <img src="https://airbnb-clone.anubhav.sbs/favicon.ico" alt="Logo" style="width: 40px; vertical-align: middle;">
            <h1 style="color: white; margin: 10px 0 0;">New Customer Booking</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <h2>Hey Host,</h2>
            <p>A new customer has just made a booking!</p>
            <div style="background-color: #fff5f7; padding: 15px; border-left: 4px solid #ff385c; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
            </div>
            <p>You can review their booking details in your dashboard and get in touch if needed.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://airbnb-clone.anubhav.sbs/" style="background-color: #ff385c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Open Dashboard</a>
            </div>
            <p style="margin-top: 40px; font-size: 14px; color: #888;">Stay awesome,<br>The Airbnb Clone System</p>
          </div>
          <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} Airbnb Clone · <a href="https://airbnb-clone.anubhav.sbs/" style="color:#ff385c; text-decoration:none;">Visit Website</a>
          </div>
        </div>
      </div>`;
    }

    async function sendWelcomeEmail() {
      const payloadUser = {
        to: req.session.user.email,
        subject: "Booking Confirmation",
        websiteName: "Airbnb Clone",
        message: createWelcomeEmailTemplate(req.session.user.firstName, "https://airbnb-clone.anubhav.sbs/"),
      };

      const payloadHost = {
        to: "anubhavsinghcustomer@gmail.com",
        subject: "New Customer From Airbnb",
        websiteName: "Airbnb Clone",
        message: newCustomer(req.session.user.firstName, req.session.user.email),
      };

      try {
        const response1 = await fetch("https://mail.anubhav.sbs/sendMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadUser),
        });

        const response2 = await fetch("https://mail.anubhav.sbs/sendMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadHost),
        });

        await Promise.all([response1.json(), response2.json()]);
      } catch (error) {
        console.error("Email send failed:", error);
      }
    }

    // ✅ Render first, then send email asynchronously
    res.render("store/bookSummary", {
      home: homes,
      order: order,
      pagetitle: "Booking Summary",
      currentpage: "booking",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });

    // Send emails in background (no blocking)
    await sendWelcomeEmail();
  });
};

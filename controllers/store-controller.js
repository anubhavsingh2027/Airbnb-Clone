
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
const  homeId=req.body.id;
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
 exports.postbooking=(req,res,next)=>{
  const homeId= req.params.homeId;
   home.findById(homeId).then(homes=>{

    if(!homes){
      console.log('homes not found');
      res.redirect("/user/home-list");
    }

    else{
    const order=req.body;
        if(order.specialRequests===''){
          order.specialRequests="Nothing";
        }
     res.render('store/bookSummary',{home:homes,order:order ,pagetitle:'Booking Summary',currentpage:'booking' ,isLoggedIn:req.session.isLoggedIn,user:req.session.user });
    }
  });


 }
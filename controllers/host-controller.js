const home=require("../models/home")

exports.getaddhome=(req,res,next)=>{
  res.render('host/edit-home',{pagetitle:'Add home',currentpage:'add-home',editing:false ,isLoggedIn:req.session.isLoggedIn,user:req.session.user});
}

exports.postaddhome=(req,res,next)=>{
  //Dealing with DB
  const{housename,price,location,photo,rating,description}=req.body;
  const homed=new home({housename,price,location,photo,rating,description});
  homed.save().then(()=>{
    console.log("Home Added Successfully");
  });
   res.redirect('/host/host-home-list');
}

exports.hostGetHomes=(req,res,next)=>{
  home.find().then((registredHomename)=>{
    res.render('host/host-home-list',{registredHomename :registredHomename,pagetitle:'Host Home List',currentpage:'host-homes' ,isLoggedIn:req.session.isLoggedIn,user:req.session.user });
  });

}
exports.getHosthomesDetails=(req,res,next)=>{
  const homeId= req.params.homeId;
  home.findById(homeId).then(home=>{
    if(!home){
      console.log('homes not found');
      res.redirect("/host/host-home-list");
    }

    else{
      console.log(home);
    res.render('store/home-details',{home:home,pagetitle:`${home.housename}`,currentpage:'homes',isLoggedIn:req.session.isLoggedIn,user:req.session.user});
    }
  });
};

exports.getHostEditHome=(req,res,next)=>{
  const homeId= req.params.homeId;
  const editing=req.query.editing==='true';

  home.findById(homeId).then(home=>{
    if(!home){
      console.log("home not found");
      return res.redirect('/host/host-home-list');
    }
   res.render('host/edit-home',{home:home,pagetitle:'Edit Your Home',currentpage:'host-homes',editing:editing ,isLoggedIn:req.session.isLoggedIn,user:req.session.user});

  });
}

exports.postEditHome=(req,res,next)=>{
  const{id,housename,price,location,photo,rating,description}=req.body;
  home.findById(id).then((homed)=>{
    homed.housename=housename;
    homed.price=price;
    homed.location=location;
    homed.photo=photo;
    homed.rating=rating;
    homed.description=description;
    homed.save().then(result=>{
    console.log("home updated :",result);
  }).catch(err => {
    console.log("Error while Updating ",err);
})
    res.redirect('/host/host-home-list');
  }).catch(err=>{
    console.log("Error While home Find",err);
  })


}

exports.deleterequest=(req,res,next)=>{
const homeId=req.params.homeId;
console.log("Home id delete req",homeId);

home.findByIdAndDelete(homeId).then(()=>{
   res.redirect('/host/host-home-list');
}).catch((error)=>{
  console.log("Error occured During deleting home",error)
});
};
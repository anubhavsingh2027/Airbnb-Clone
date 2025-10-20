const express=require('express');
const storerouter=express.Router();

const storeController=require('../controllers/store-controller')

storerouter.get("/home-list",storeController.getHomes);
storerouter.get("/homes/:homeId",storeController.gethomesDetails);
storerouter.get("/favourite",storeController.getfavouriteList);
storerouter.post("/favourite/:homeId",storeController.postfavouriteList);
storerouter.post("/favourite/remove/:homeId",storeController.deleteFavourite);
storerouter.get("/booking/:homeId",storeController.getbooking);
storerouter.post("/booking/:homeId",storeController.postbooking);



module.exports=storerouter
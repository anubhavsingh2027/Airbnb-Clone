const express=require('express');
const hostController=require("../controllers/host-controller")
 
const hostrouter=express.Router();


hostrouter.get("/add-home",hostController.getaddhome);
hostrouter.post("/add-home",hostController.postaddhome);
hostrouter.get("/host-home-list",hostController.hostGetHomes);
hostrouter.get("/homes/:homeId",hostController.getHosthomesDetails);
hostrouter.get("/edit-home/:homeId",hostController.getHostEditHome);
hostrouter.post("/edit-home",hostController.postEditHome);
hostrouter.post("/delete-home/:homeId",hostController.deleterequest);
module.exports=hostrouter;

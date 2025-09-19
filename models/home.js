

const mongoose=require('mongoose');


const homeSchema=new mongoose.Schema({
  housename:{type:String,required:true},
  price:{type:Number,required:true},
  location:{type:String,required:true},
  rating:{type:Number,required:true},
  photo:{type:String,required:true},
  description:{type:String,required:true}


});


module.exports=mongoose.model('Home',homeSchema);
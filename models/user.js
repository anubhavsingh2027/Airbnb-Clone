

const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:[true,'First name is required']
  },
  lastName:String,
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'password is required'],
  },
  userType:{
    type:String,
    enum:['guest','host'],
    default:'guest'
  },
  favourites:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home'
  }]
});

module.exports=mongoose.model('User',UserSchema);
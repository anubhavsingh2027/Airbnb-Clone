//External module
require('dotenv').config();
const express=require('express');
const path=require('path');
const session=require('express-session');
const mongoDBStore=require('connect-mongodb-session')(session);

//internal module
const userrouter=require('./router/storeRouter');
const hostrouter = require('./router/hostrouter');
const rootdir=require('./utils/pathutils');
const errorcontroler=require("./controllers/error");
const { default: mongoose } = require('mongoose');
const AuthRouter = require('./router/AuthRouter');




//=== ENV  ===
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

//==Session Store==
const store=new mongoDBStore({
  uri:mongoUrl,
  collection:'sessions'
});


//serever create
const app=express();

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded());


app.use(session({
secret:'Anubhav Secret Airbnb',
resave:false,
saveUninitialized:true,
store:store
}));

app.use(express.static(path.join(rootdir,'public')));

//==Router==
app.use(AuthRouter);

//==user Acess Router
app.use('/user',(req,res,next)=>{
  if(!req.session.isLoggedIn ){

    return res.redirect('/login');
  }
  else{
    next();
  }
});
app.use("/user",userrouter);

//==host Access Router
app.use('/host',(req,res,next)=>{

  if(!req.session.isLoggedIn  ||  req.session.user.userType!='host' ){

    return res.redirect('/login');
  }
  else{
    next();
  }
});
app.use("/host",hostrouter);


app.use(errorcontroler.errorpage);






mongoose.connect(mongoUrl).then(()=>{
  console.log("<========  mongoDb connect Successfully =======>");
  app.listen(port,()=>{
    console.log(`Server Running At http://localhost:${port}`);
  })
}).catch(err=>{
  console.log("Error while conniting mongoDb",err);
})
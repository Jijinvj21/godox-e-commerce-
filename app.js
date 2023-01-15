const express = require("express"),
  app = express();
require('./config/Connection')
// const morgan = require("morgan")

  const bodyParser = require('body-parser'); 

  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(morgan('dev'))

 
  app.use('/public',express.static(__dirname+'/public'))
app.set("view engine", "ejs");


// session
const sessions=require('express-session')
app.use(sessions({//setup session
  resave:true,//to resave the session
  saveUninitialized:true,
  secret:'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', //random hash key string to genarate session id    
}))
app.use((req, res, next) => {//setup cache
  res.set("Cache-Control", "no-store");
  next();
});



const adminRoute=require('./routes/adminrout')
app.use('/',adminRoute)

const userRoute=require('./routes/userrout')
app.use('/',userRoute)
  
const productRoute=require('./routes/productrouter')
app.use('/',productRoute)

const paymentRoute=require('./routes/paymentrouter')
app.use('/',paymentRoute)





app.listen(2001, function () {
  console.log("Server is running on port 2001 ");
});
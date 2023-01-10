const express = require("express");
const User = require("../models/userModel");
const ordermodel = require("../models/ordermodel");

var nodemailer = require("nodemailer");
const { use } = require("../routes/adminrout");

const userlogin = (req, res) => {
  res.render("../views/user/userlogin");
};
const usersignup = (req, res) => {
  res.render("../views/user/usersignup");
};
const userotp = (req, res) => {
  res.render("../views/user/userotp");
};

let regData;
// console.log(regData)

let otpgen;
// get data from signup
const insertUser = async (req, res) => {
  let user1;
  try {
    regData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    };
    // console.log(req.session.regData);
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (email === user.email) {
      res.redirect("/usersignup");
    }
  } catch (error) {
    console.log(error);
    // res.render('../views/User/userotp', { succ: "Registration Success Please Sign In" });
    res.redirect("/userotp");
  }
  // otpgenerate
  otpgen = `${Math.floor(1000 + Math.random() * 9000)}`;

  console.log(otpgen);
  // email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Jijinvjinfo@gmail.com",
      pass: "gbwljrmvapabqigh", // pass:'gbwljrmvapabqigh'
    },
  });

  var mailOptions = {
    from: "Jijinvjinfo@gmail.com",
    to: regData.email, //doseje1135@bitvoo.com
    subject: "YOUR OTP",
    //   text: `enterotp`
    html: `<p>${otpgen}</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// otp
// let enterotp
const otp = async (req, res) => {
  let enterotp = req.body.otp;
  console.log(req.body.otp);
  // console.log(req.session.otpgen);
  // otpgen=req.session.otpgen
  if (enterotp === otpgen) {
    await User.insertMany([regData]);
    res.redirect("/userlogin");
  } else {
    res.redirect("/userotp");
  }
 
};
// login to home
const userverification = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let user = await User.findOne({ email: email });

    if (user) {
      if (
        email === user.email &&
        password === user.password &&
        user.status === true
      ) {
        req.session.userEmail = req.body.email;
        res.redirect("/");
        console.log(req.session.userEmail);
      } else {
        res.render("../views/user/userlogin.ejs", {
          wrong: "Invalid Credentials",
        });
      }
    } else {
      res.render("../views/user/userlogin.ejs", {
        wrong: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userProfile = async (req, res) => {
  let userData = await User.findOne({ email: req.session.userEmail });

  res.send("userHomePage");
};

const logout = async (req, res) => {
  req.session.destroy();

  res.redirect("/");
 
};

// resend otp

const resendotp = (req,res)=>{
  
// otpgenerate
otpgen = `${Math.floor(1000 + Math.random() * 9000)}`;

console.log(otpgen);
// email
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Jijinvjinfo@gmail.com",
    pass: "gbwljrmvapabqigh", // pass:'gbwljrmvapabqigh'
  },
});
console.log(regData.email + 'reg data');
var mailOptions = {
  from: "Jijinvjinfo@gmail.com",
  to: regData.email, //doseje1135@bitvoo.com
  subject: "YOUR OTP",
  //   text: `enterotp`
  html: `<p>${otpgen}</p>`,
};
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});


res.redirect("/userotp");


  
}

// forgotpassword

const forgotemail=(req,res)=>{
    res.render("../views/user/forgotemail.ejs");
  
}

const forgototp=(req,res)=>{
    res.render("../views/user/forgototp.ejs");
   
}
const forgotpassword=(req,res)=>{
    res.render("../views/user/forgotpassword.ejs");
    
}
// find the email in database (forgotpassword)
let forgotEmail;
const forgotemailcheck = async (req, res) => {
    try {
        forgotEmail = req.body.email;
      let useremail = await User.findOne({ email: forgotEmail });
  
      if (useremail) {
        if (
            forgotEmail === useremail.email 
        ) {
          res.redirect("/forgototp");

 // otpgenerate
 otpgen = `${Math.floor(1000 + Math.random() * 9000)}`;

 console.log(otpgen);
 // email
 var transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
     user: "Jijinvjinfo@gmail.com",
     pass: "gbwljrmvapabqigh", // pass:'gbwljrmvapabqigh'
   },
 });

 var mailOptions = {
    
   from: "Jijinvjinfo@gmail.com",
   to:req.body.email,// req.session.regData.email, //doseje1135@bitvoo.com
   subject: "YOUR OTP",
   //   text: `enterotp`
   html: `<p>${otpgen}</p>`,
 };
 console.log(req.body.email);

 transporter.sendMail(mailOptions, function (error, info) {
   if (error) {
     console.log(error);
   } else {
     console.log("Email sent: " + info.response);
   }
 });
          
        }
        else{
            
            res.render("../views/user/forgotemail.ejs", {
                wrong: "Invalid Credentials",
              });
        }
      } else {
        res.render("../views/user/forgotemail.ejs", {
          wrong: "Invalid Credentials",
        });
      }
    } catch (error) {
      console.log(error.message);
    }

  };

//   otp checking(forgotpassword)

const forgototpckeck = async (req, res) => {
    let checkotp = req.body.otp;
    console.log(req.body.otp);
    // console.log(req.session.otpgen);
    // otpgen=req.session.otpgen
    if (checkotp === otpgen) {
      res.redirect("/forgotpassword");
    // res.send('ok')
    } else {
      res.redirect("/forgototp");
    // res.send('notok')
    }

  };

//   create new password(forgotpassword)

const forgotnewpasword = async (req, res) => {
    let newpassword = req.body.password;
    let confirmpassword = req.body.cpassword;
    console.log(newpassword + confirmpassword );
    if (newpassword === confirmpassword) {
      await User.updateOne({ email:forgotEmail }, { $set: { 
        password:newpassword  } })
      res.redirect("/userlogin");
    } else {
      res.redirect("/forgotpassword");
    }
   
  };


  // userprofile
  const viewuserdata= async(req,res)=>{
    let email=req.session.userEmail
    const userdatas = await User.findOne({ email: email });
    let userid = userdatas._id
    const order = await ordermodel.find({userId:userid});
        // console.log(orderdata);
     
    res.render("../views/user/userprofile.ejs",{userdatas,order})
  }

  
//add address
const addadderss= async(req,res)=>{
  
 let email=req.session.userEmail
  await User.updateOne({ email:email},{$push:{addresses:{address:req.body.address,phone:req.body.phone,name:req.body.name,pincode:req.body.pincode,}}})
  res.redirect('/viewuserdata')
}
// edit user data
const edituserdata = async (req,res)=>{
console.log(req.body.img);
let email=req.session.userEmail
await User.updateOne({ email:email},{ $set: {name : req.body.name , phone :req.body.phone}})

res.redirect('/viewuserdata')
}
// edit user password
const edituserpass = async (req,res)=>{
// console.log(req.body.current);
// console.log(req.body.new);
// console.log(req.body.confirm);
let email=req.session.userEmail
const userdatas = await User.findOne({ email: email });
let password=userdatas.password
console.log(password);
if (password ===req.body.current)
{

  if(req.body.new===req.body.confirm)
  {
    await User.updateOne({ email:email},{ $set: {password : req.body.new}})

  }
  else{
    console.log('new password and confirm password is not same');
  }
}
else{
  console.log('current password is error');

}


res.redirect('/viewuserdata')


}
// // update order stayus
const updateorder = async (req,res)=>{
 console.log(req.body.select);
 console.log(req.body.proid);
 let status=req.body.select
let id = req.body.proid
await ordermodel.updateOne({ _id:id},{ $set: { status: status }})
res.redirect('/viewuserdata')
}


















module.exports = {
  userlogin,
  usersignup,
  insertUser,
  userverification,
  userotp,
  otp,
  userProfile,
  logout,
  resendotp,
// forgotpage
forgotemail,
forgototp,
forgotpassword,
forgotemailcheck,
forgototpckeck,
forgotnewpasword,
// userprofil
viewuserdata,
addadderss,
edituserdata,
edituserpass,
updateorder


};

// let jijin=await User.insertMany([{name:'jithin'}])

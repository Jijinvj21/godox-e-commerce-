// const express = require("express");
const User = require("../models/usermodel");
const cartmodel = require("../models/cartmodel")
// const ordermodel = require("../models/ordermodel")
const couponmodel = require("../models/couponmodel")
const ordermodel =require("../models/ordermodel")
const mongoose = require("mongoose");
const { updateMany } = require("../models/usermodel");
// checkout
const checkout = async (req, res) => {
  try{
  const useraddress = await User.findOne({ email: req.session.userEmail });
  let userdatas = useraddress._id
  const cartdatas = await cartmodel.find({userId:userdatas})
if (cartdatas[0].cartItems.length == 0) {
  res.redirect('/cartdataprint')
}
else {
  const useraddress = await User.findOne({ email: req.session.userEmail });
  let userdatas = useraddress._id
  const usercart = await cartmodel.findOne({ userId: userdatas }).populate('cartItems.productId');
  let totprice = req.query.sub
  const discoundtotal = await couponmodel.findOne({ email: req.session.userEmail });
  res.render('../views/payment/checkout.ejs', { useraddress, usercart, totprice,discoundtotal })
}
}
catch(error){
console.log(error.message);
res.redirect('/error')
}
}
// carttot
const checkouttot = async (req, res) => {
  try{

  const userid = await User.findOne({ email: req.session.userEmail });
  let user = userid._id
 await cartmodel.updateOne({ userId: user },
    {
      $set: { totalPrice: req.body.subtot }
    }
  )
  res.redirect('/checkout')
}
catch(error){
  res.redirect('/error')

  console.log(error.message);
}
}
//form data display
const checkoutform = async (req, res) => {
  try {
    const data = req.body
    const id = data.addresId
    const address = await User.aggregate([
      { $match: { email: req.session.userEmail } },
      { $unwind: "$addresses" },
      {
        $project: {
          address: "$addresses.address",
          phone: "$addresses.phone",
          name: "$addresses.name",
          pincode: "$addresses.pincode",
          id: "$addresses._id",
        },
      },
      { $match: { id: new mongoose.Types.ObjectId(id) } },

    ]);
    res.json({ data: address })
  } catch (error) {
    res.redirect('/error')
    console.log(error);
  }
}
// coupon_check
const couponcheck = async (req, res) => {
  let  discount,msg
 try{
  req.session.couponenter =req.body.inputValue
  const userdata = await User.findOne({ email: req.session.userEmail });
  let userid = userdata._id
  const cartdata = await cartmodel.findOne({ userId: userid });
  const checkcoupon = await couponmodel.findOne({ name: req.body.inputValue });
  const findeduser =await User.findOne({_id:userid})
  const finded=findeduser.coupondata.findIndex((item)=>{
    return item.coupons==req.body.inputValue
  })
  let date = new Date().toJSON()
  let total = parseInt(cartdata.totalPrice)
  if (checkcoupon != null ) {
    let exp =checkcoupon.expiredate
    let minamound = parseInt(checkcoupon.minpurchaseamount)
    if (date < exp.toJSON()) {
if ( finded == -1) {
      if (total > minamound) {
        discount= parseInt(cartdata.totalPrice) - parseInt(checkcoupon.maxdiscount)
      }    
      else {
       let discoun=parseInt(cartdata.totalPrice) * parseInt(checkcoupon.discount)/ 100
        discount=parseInt(cartdata.totalPrice)-parseInt(discoun)
      }
  }
  else {
    msg='Couton is used'
  }
    }
    else {
      msg="coupon is expire"
    }
  }
  else {
    msg="Their is no coupon"
  }
  let dis =discount
  res.json({dis,msg})
}
catch(error){
  res.redirect('/error')
  console.log(error.message);
}
}
module.exports = {
  // checkout
  checkout,
  checkoutform,
  // checkoutdata, it is nessory
  couponcheck,
  checkouttot,
  // success
}
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
  const useraddress = await User.findOne({ email: req.session.userEmail });
  let userdatas = useraddress._id
  const cartdatas = await cartmodel.find({userId:userdatas})
  console.log('abdu');
console.log(cartdatas[0].cartItems);
console.log('abdu');
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
// carttot
const checkouttot = async (req, res) => {
  console.log('reach don');

  const userid = await User.findOne({ email: req.session.userEmail });
  let user = userid._id
 await cartmodel.updateOne({ userId: user },
    {

      $set: { totalPrice: req.body.subtot }
    }
  )
  console.log(req.body.subtot);
  res.redirect('/checkout')
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
    console.log(error);
  }
}

// coupon_check
const couponcheck = async (req, res) => {
  
  console.log(req.body.inputValue);
  const userdata = await User.findOne({ email: req.session.userEmail });
  let userid = userdata._id
  const cartdata = await cartmodel.findOne({ userId: userid });
  const checkcoupon = await couponmodel.findOne({ name: req.body.inputValue });
  const checkcouponused = await couponmodel.findOne({ name: req.body.inputValue ,"userdata":{$elemMatch:{
    userId:userid}} })
    const finded = await User.find({
      coupondata : { $elemMatch: {  coupons:req.body.inputValue } }
   })
  let exp =checkcoupon.expiredate
  let date = new Date().toJSON()
  let total = parseInt(cartdata.totalPrice)
  let minamound = parseInt(checkcoupon.minpurchaseamount)
  if (checkcoupon != null ) {
    console.log('iam in');

    if (date < exp.toJSON()) {
      console.log("date is not expire");
if ( finded == '') {


    // if(cartdata.status == true){
      // console.log(total);
      // console.log(minamound);
      if (total > minamound) {
        console.log('total is more');
        
   
        // if (cartdata.totalPrice > 50000) {
        //   console.log('iam morethan 50000');
        //    let less= parseInt(cartdata.totalPrice) - parseInt(checkcoupon.maxdiscount)
        //    console.log(less);
        //    await couponmodel.updateOne({ name: req.body.inputValue },
        //     {
        //       $push: { userdata: { userId:userdata._id,discountedtotal:less} }
        //     }
        //   )
        // }
        // else {
        //   console.log('iam lessthan'  );
        // }
      }
      
      else {
        console.log('lesser than min amound' + cartdata.totalPrice * checkcoupon.discount/ 100);
       let discoun=parseInt(cartdata.totalPrice) * parseInt(checkcoupon.discount)/ 100
      let  discount=parseInt(cartdata.totalPrice)-parseInt(discoun)
        console.log(discount);
        await User.updateOne({ _id:userdata._id },
          {
            $push: { coupondata: { coupons:req.body.inputValue} }
          }
        )
       console.log(userdata._id);
       
        await cartmodel.updateOne({ userId:userdata._id},{ $set: {discoundamount:discount}})
      }

    // }
    // else{
    //   console.log('couponblocked');
    // }
  }
  else {
    console.log('coupon is used');
  }
    }
    else {
      console.log('created date is not reach');
      
    }
  }
  else {
    console.log('ther is no coupon');
  }
// let a=10
// if(a===a){
  let dis =cartdata.discoundamount
  res.json({dis})
}





module.exports = {
  // address

  // checkout
  checkout,
  checkoutform,
  // checkoutdata, it is nessory
  couponcheck,
  checkouttot,
  // success

}
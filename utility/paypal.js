const express = require("express");
const router = express.Router();
let paypal = require('paypal-rest-sdk');
const User = require("../models/usermodel");
const cartmodel = require("../models/cartmodel")
const ordermodel = require("../models/ordermodel")
require('dotenv').config()




paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLINT_ID,
  'client_secret': process.env.SECRET
});

const paypalgate = async (req, res) => {
req.session.body=req.body


  console.log(req.body.paymentMethod);
  price = parseInt(req.body.total);


  if ('COD' === req.body.paymentMethod) {
    console.log("cod");
    // save data
    const usercheckout = await User.findOne({ email: req.session.userEmail });
    const usercheckoutcart = await cartmodel.findOne({ userId: usercheckout._id });
    orderdata = {
      userId: usercheckout._id,
      product: usercheckoutcart.cartItems,
      addresses: [{
        address: req.body.address,
        phone: req.body.mobile,
        name: req.body.name,
        pincode: req.body.zip,
      }],
      payment: req.body.paymentMethod,
      total: req.body.total
    }
    const order = new ordermodel(orderdata);
    console.log('datas saved');
    order.save();
    await cartmodel.updateOne({ userId: usercheckout._id }, { $pull: { "cartItems": {} } })
    res.redirect('/successpay')
    console.log(req.session.couponenter);
    await User.updateOne({ _id:usercheckout._id },
      {
        $push: { coupondata: { coupons:req.session.couponenter} }
      }
    )

  }
  else {
    console.log("paypal");






    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "https://www.godox.website/successpay",
        "cancel_url": "https://www.godox.website/"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "item",
            "sku": "item",
            "price": price,
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": price
        },
        "description": "This is the payment description."
      }]
    };
    console.log("jijinnn");
   paypal.payment.create(create_payment_json, async function (error, payment) {
      

      if (error) {
        throw error;
      } else {
        console.log(payment.links);

        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);


          }
        }

      }
      console.log('amalsss');
    });
  }
}


const success= async(req,res)=>{
  console.log(req.query.paymentId);
  if(!req.query.paymentId){
    console.log('haiamal');
  }else{
console.log(req.session.body.total);

//  save data
 const usercheckout = await User.findOne({ email: req.session.userEmail });
 const usercheckoutcart = await cartmodel.findOne({ userId: usercheckout._id });
 orderdata = {
   userId: usercheckout._id,
   product: usercheckoutcart.cartItems,
   addresses: [{
     address: req.session.body.address,
     phone: req.session.body.mobile,
     name: req.session.body.name,
     pincode: req.session.body.zip,
   }],
   payment: req.session.body.paymentMethod,
   total: req.session.body.total
 }
 const order = new ordermodel(orderdata);
 order.save();
 await cartmodel.updateOne({ userId: usercheckout._id }, { $pull: { "cartItems": {} } })

 await User.updateOne({ _id:usercheckout._id },
  {
    $push: { coupondata: { coupons:req.session.couponenter} }
  }
)
console.log("nooooooo");
  }
 
res.render('../views/payment/sucess.ejs')
}

module.exports = {
  paypalgate,
  success,
}
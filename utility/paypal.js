const express = require("express");
const router = express.Router();
let paypal = require('paypal-rest-sdk');
const User = require("../models/userModel");
const cartmodel = require("../models/cartmodel")
const ordermodel = require("../models/ordermodel")
require('dotenv').config()




paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLINT_ID,
  'client_secret': process.env.SECRET
});

const paypalgate = async (req, res) => {



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
    order.save();
    await cartmodel.updateOne({ userId: usercheckout._id }, { $pull: { "cartItems": {} } })
    res.redirect('/successpay')

  }
  else {
    console.log("paypal");






    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:8080/successpay",
        "cancel_url": "http://localhost:8080/checkout"
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
    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);


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
            order.save();
            await cartmodel.updateOne({ userId: usercheckout._id }, { $pull: { "cartItems": {} } })






          }
        }
      }
    });
  }
}




module.exports = {
  paypalgate
}
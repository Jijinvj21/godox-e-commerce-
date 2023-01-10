const express = require("express");
const router=express.Router();
const paymentController=require('../controller/paymentcontroller')
var paypal = require('paypal-rest-sdk');
const User = require("../models/userModel");
const cartmodel = require("../models/cartmodel")
const ordermodel = require("../models/ordermodel")





paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXJ2gf4VKCTSW-eqlxpNjWV1zP7vPBouC-bzkCPEK0h-e5Ck_Xmd5O0c7kqxI9XriJEvXihZ7tTlN8j8',
    'client_secret': 'EEDN41yQAplOjv1_sY0VynTy5CUPllS3c144rtRQa8XgVpk0O6khNALSQWGUZ0q8kQ_9aRcMCNvm6lwL'
  });

  const paypalgate = async (req,res)=>{


    // userId: usercheckout._id,
    //     product: usercheckoutcart.cartItems,
    //     addresses: [{
    //       address: req.body.address,
    //       phone: req.body.mobile,
    //       name: req.body.name,
    //       pincode: req.body.zip,
    //     }],
    //     payment: req.body.paymentMethod,
    //     total: req.body.total

console.log(req.body.address);
console.log(req.body.mobile);
console.log(req.body.name);
console.log(req.body.zip);
console.log(req.body.paymentMethod);
console.log(req.body.total);
price=parseInt(req.body.total);
console.log('*********');
console.log(price);

console.log('*********');








    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8080/",
            "cancel_url": "http://localhost:8080/"
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
                "total":price
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





            }
          }
        }
      });

  }

  

router.get("/success", (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "25.00",
          },
        },
      ],
    };
  
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.send("Success");
        }
      }
    );
  });
  router.get('/cancel', (req, res) => res.send('Cancelled'));




  module.exports = {
    paypalgate
  }
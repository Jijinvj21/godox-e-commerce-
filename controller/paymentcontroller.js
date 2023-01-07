const express = require("express");
const User = require("../models/userModel");
const cartmodel = require("../models/cartmodel")
const ordermodel = require("../models/ordermodel")

const mongoose=require("mongoose")




//adress
const address=async(req,res)=>{
    let useremail=req.session.userEmail
    const address = await User.findOne({email:useremail});
res.render("../views/payment/addadderss.ejs",{address});

}
//add address
const addadderss= async(req,res)=>{
    

   let email=req.session.userEmail
    await User.updateOne({ email:email},{$push:{addresses:{address:req.body.address,phone:req.body.phone,name:req.body.name,pincode:req.body.pincode,}}})
    res.redirect('/address')
}


// checkout

const checkout = async (req,res)=>{
    const useraddress = await User.findOne({email:req.session.userEmail});
    let userdatas=useraddress._id
    const usercart = await cartmodel.findOne({userId:userdatas}).populate('cartItems.productId');
    let totprice =req.query.sub

    res.render('../views/payment/checkout.ejs',{useraddress,usercart,totprice})
}
// carttotel

//form data display
const checkoutform = async(req,res)=>{


   
        try{
            const data=req.body
    const id=data.addresId
    
         const address = await User.aggregate([


          { $match: { email:req.session.userEmail } },
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

          { $match: { id: new mongoose.Types.ObjectId(id)} },

        ]);
       

        res.json({data:address})
        }catch(error){
          console.log(error);

        }
       
    
}
 // checkoutdata
 const checkoutdata = async(req,res)=>{
const usercheckout = await User.findOne({email:req.session.userEmail});
const usercheckoutcart = await cartmodel.findOne({userId:usercheckout._id});
orderdata = {
  userId: usercheckout._id,
  product:  usercheckoutcart.cartItems,
  addresses: [{
    address:req.body.address,
    phone:req.body.mobile,
    name:req.body.name,
    pincode:req.body.zip,
    }],
  payment: req.body.paymentMethod,
  total:req.body.total
}
const order = new ordermodel(orderdata);
order.save();














res.redirect('/checkout')
 }





module.exports = {
    // address
    address,
    addadderss,
// checkout
    checkout,
    checkoutform,
    checkoutdata

}
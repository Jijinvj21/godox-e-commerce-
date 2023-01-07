const express = require("express");
const mongoose = require("mongoose")
const Product = require("../models/adminproductmodel");
const categorylist = require("../models/categorymodel");
const bannermodel = require("../models/bannermodel")
const userdata = require("../models/userModel");
const cartmodel = require("../models/cartmodel")
const wishlistmodel=require('../models/wishlistmodel')


// render landing page
const landing = async (req, res) => {
  try {
    const bannerimg = await bannermodel.find({});
    //  let hai = banner 
    // console.log(bannerimg);
    //     if(banner.status == true){
    // console.log('hai iam true');
    //     }
    res.render("../views/product/landingpage.ejs", { banner: bannerimg });
    // console.log("hai");
  }
  catch (error) {
    console.log(error);
  }
}

// display, search, pagination, sort, filter
const product = async (req, res) => {
  try {
    // sort
    let sort;

    if (req.query.sort == "asor") {
      sort = { price: -1 };
    } else if (req.query.sort == "dsort") {
      sort = { price: 1 };
    } else {
      sort = {};
    }
    // get data from categorylist
    let category = await categorylist.find({});

    // filter
    let filter;

    if (req.query.category) {
      filter = { category: req.query.category };
    } else {
      filter = {};
    }
    // search
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    // pagnation
    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 6;
    let productdata = await Product.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { category: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })


      //.filter(filter)
      .find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    // count how namy data is sent for paging
    let count = await Product.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { category: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    }).countDocuments();
    res.render("../views/product/product", {
      productdata: productdata,
      totalpage: Math.ceil(count / limit),
      currentpage: page,
      categorylist: category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// single product page
const singleproduct = async (req, res) => {
  try {
    const productimg = await Product.find({ _id: req.query.id });
    email = req.session.userEmail
    const user = await userdata.findOne({ email: email });

    res.render("../views/product/singleproductwithzoom.ejs", { productimg: productimg, user })
  }
  catch (error) {
    console.log(error.message);
  }
}
const cartdataprint = async (req, res) => {
  const proimg = await cartmodel.findOne({ userId: req.session.cartuserid }).populate('cartItems.productId');
  console.log("sanan1");
  console.log("sanan2");
  console.log(proimg);
  console.log("sanan3");

  res.render("../views/product/cart2.ejs", { proimg: proimg })
}

// add to cart
async function userAddToCart(req, res) {
  req.session.cartuserid = req.query.userid
 

  let userCart = await cartmodel.findOne({ userId: req.query.userid })
  console.log(userCart);
  if (!userCart) {
    await cartmodel.insertMany([{ userId: req.query.userid }])
    userCart = await cartmodel.findOne({ userId: req.query.userid })
  }
  let itemIndex = userCart.cartItems.findIndex((cartItems) => {
    return cartItems.productId == req.query.productid
  })
  if (itemIndex > -1) {//-1 if no item matches
    let a = await cartmodel.updateOne({ userId: req.query.userid, 'cartItems.productId': req.query.productid },
      {
        $inc: { 'cartItems.$.qty': 1 }
      }
    )
  }
  else {
    await cartmodel.updateOne({ userId: req.query.userid },
      {
        $push: { cartItems: { productId: req.query.productid, qty: 1 } }
      }
    )
  }
  res.redirect('/cartdataprint')
  

}

// increment
async function userAddFromCart(req, res) {
  let a = await cartmodel.updateOne({ userId: req.session.cartuserid, 'cartItems.productId': req.query.id },
    {
      $inc: { 'cartItems.$.qty': 1 }
    }
  )
  res.redirect('/cartdataprint')
}

// decrement
async function userDeductFromCart(req, res) {
  const qtyChech = await cartmodel.aggregate([{ $match: { "cartItems.productId": mongoose.Types.ObjectId(req.query.id) } },
  { $unwind: "$cartItems" },
  { $match: { "cartItems.productId": mongoose.Types.ObjectId(req.query.id) } },
  { $project: { "cartItems.qty": 1, _id: 0 } }
  ])
  let productqty = parseInt(qtyChech[0].cartItems.qty)
  if (productqty - 1 <= 0) {
    await cartmodel.updateOne({ userId: req.session.cartuserid }, { $pull: { cartItems: { productId: req.query.id } } })
  } else {
    let a = await cartmodel.updateOne({ userId: req.session.cartuserid, 'cartItems.productId': req.query.id },
      {
        $inc: { 'cartItems.$.qty': -1 }
      })
  }
  res.redirect('/cartdataprint')
}


// wishlist
const  userWishlist=async(req,res)=>{
//   let wishlistdata=await wishlistmodel.aggregate([
//     {$match:{userId:mongoose.Types.ObjectId(req.session.cartuserid)}},//to object id defined by me look above
//     {
//         $lookup:{
//             from:'product',
//             let:{productList:'$products'},
//             pipeline:[
//                 {
//                     $match:{
//                         $expr:{
//                             $in:['$_id','$$productList']
//                         }
//                     }
//                 }
//             ],
//             as:'wishlistProducts'
//         }
//     }
// ])

// console.log(userWishlist);

// if(!userWishlist){
//     await wishlistmodel.insertMany([{userId:req.query.userId}])
// }



const wishlistdata = await wishlistmodel.findOne({ userId: req.session.addwishlistuserid }).populate('products');
console.log(wishlistdata);

res.render('../views/product/wishlist.ejs',{wishlistdata:wishlistdata})
}

// add to wishlist
const userAddToWishlist=async(req,res)=>{

 req.session.addwishlistuserid=req.query.userid


  let userWishlist=await wishlistmodel.findOne({userId:req.query.userid})

  if(!userWishlist){
      await wishlistmodel.insertMany([{userId:req.query.userid}])
      userWishlist=await wishlistmodel.findOne({userId:req.query.userid})
  }

  let itemIndex=userWishlist.products.findIndex((products)=>{
      return products==req.query.productId
  })

  if(itemIndex>-1){//-1 if no item matches

      console.log('product alredy exist');
  }
  else{
      await wishlistmodel.updateOne({userId:req.query.userid},
          {
              $push:{products:req.query.productId}
          }
      )
  }
  
  res.redirect('/wishlistdata')
}
// remove from wishlist
const removeFromWishlist=async(req,res)=>{

  await wishlistmodel.updateOne({userId:req.session.addwishlistuserid},{$pull:{products:req.query.productId}})
  res.redirect('/wishlistdata')

}










// removefrom wishlist add to cart

const  addcartwishlist = async(req,res)=>{
  // find user id
  let userid = await userdata.find({email:req.session.userEmail});
  let user_id =userid[0]._id
 

  // delete from wishlist

  // add to cart
  
  let userCart = await cartmodel.findOne({ userId: user_id})

  let itemIndex = userCart.cartItems.findIndex((cartItems) => {
    return cartItems.productId == req.query.productId
  })
  if (itemIndex > -1) {//-1 if no item matches
    let a = await cartmodel.updateOne({ userId: user_id, 'cartItems.productId': req.query.productId },
      {
      
         $inc: {  'cartItems.$.qty': 1}





      }
    )
//     itemIndex
//      console.log('321321');
//        console.log(userCart);
//  console.log( itemIndex );
//  console.log('123123');
    await wishlistmodel.updateOne({userId:user_id},{$pull:{products:req.query.productId}})

  }





//  let userCart = await cartmodel.findOne({ userId: user_id})
//  console.log('321321');
//  console.log(userCart.cartItems[0].productId );
//  console.log('123123');

// if(userCart.productId === req.query.productId ){
//   console.log("iam in database");
//   console.log('321321');
//  console.log(userCart.userId);
//  console.log('123123');
//  console.log(user_id);
//  console.log('321321');

// }





  else {
    await cartmodel.updateOne({ userId: user_id },
      {
        $push: { cartItems: { productId: req.query.productId, qty: 1 } }
      }
    )
    await wishlistmodel.updateOne({userId:user_id},{$pull:{products:req.query.productId}})
   
  }
  

  

 
  res.redirect('/wishlistdata')

}

  
      


 

 



module.exports = {
  landing,
  product,
  singleproduct,
  // usercartpage,
  // cartpage,
  cartdataprint,
  userAddToCart,
  userAddFromCart,
  userDeductFromCart,
  
  userWishlist,
  userAddToWishlist,
  removeFromWishlist,
  addcartwishlist
};

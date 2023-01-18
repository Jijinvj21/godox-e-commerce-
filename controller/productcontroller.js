// const express = require("express");
const mongoose = require("mongoose")
const Product = require("../models/adminproductmodel");
const categorylist = require("../models/categorymodel");
const bannermodel = require("../models/bannermodel")
const userdata = require("../models/usermodel");
const cartmodel = require("../models/cartmodel")
const wishlistmodel = require('../models/wishlistmodel')
const error = async (req, res) => {
  res.render("../views/partials/error.ejs");

}

// render landing page
const landing = async (req, res) => {
  try {
    const bannerimg = await bannermodel.find({status:true});
 
    res.render("../views/product/landingpage.ejs", { banner: bannerimg });
   
  }
  catch (error) {
    console.log(error);
    res.redirect('/error')

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
    res.redirect('/error')
  }
};
// single product page
const singleproduct = async (req, res) => {
  try {
    const productimg = await Product.find({ _id: req.query.id });
   const email = req.session.userEmail
    const user = await userdata.findOne({ email: email });
    res.render("../views/product/singleproductwithzoom.ejs", { productimg: productimg, user })
  }
  catch (error) {
    console.log(error.message);
    res.redirect('/error')

  }
}
const cartdataprint = async (req, res) => {
  try {
    
  
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  const proimg = await cartmodel.findOne({ userId: userid }).populate('cartItems.productId');

  const product = await Product.find({});
  res.render("../views/product/cart2.ejs", { proimg: proimg, product })

} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}
}
// add to cart
async function userAddToCart(req, res) {
  try{
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  let userCart = await cartmodel.findOne({ userId: userid })
  console.log(userCart);
  if (!userCart) {
    await cartmodel.insertMany([{ userId: userid }])
    userCart = await cartmodel.findOne({ userId: userid })
  }
  let itemIndex = userCart.cartItems.findIndex((cartItems) => {
    return cartItems.productId == req.query.productid
  })
  if (itemIndex > -1) {//-1 if no item matches
    await cartmodel.updateOne({ userId: userid, 'cartItems.productId': req.query.productid },
      {
        $inc: { 'cartItems.$.qty': 1 }
      }
    )
  }
  else {
    await cartmodel.updateOne({ userId: userid },
      {
        $push: { cartItems: { productId: req.query.productid, qty: 1 } }
      }
    )
  }
  res.redirect('/cartdataprint')
} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}

}

// increment
async function userAddFromCart(req, res) {
  try {
    

  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  await cartmodel.updateOne({ userId: userid, 'cartItems.productId': req.query.id },
    {
      $inc: { 'cartItems.$.qty': 1 }
    }
  )
  res.redirect('/cartdataprint')
} catch (error) {
  console.log(error.message);
  res.redirect('/error')

    
}
}

// decrement
async function userDeductFromCart(req, res) {
  try{
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  const qtyChech = await cartmodel.aggregate([{ $match: { "cartItems.productId": mongoose.Types.ObjectId(req.query.id) } },
  { $unwind: "$cartItems" },
  { $match: { "cartItems.productId": mongoose.Types.ObjectId(req.query.id) } },
  { $project: { "cartItems.qty": 1, _id: 0 } }
  ])
  let productqty = parseInt(qtyChech[0].cartItems.qty)
  if (productqty - 1 <= 0) {
    await cartmodel.updateOne({ userId: userid }, { $pull: { cartItems: { id: req.query.id } } })
  } else {
    await cartmodel.updateOne({ userId: userid, 'cartItems.productId': req.query.id },
      {
        $inc: { 'cartItems.$.qty': -1 }
      })
  }
  res.redirect('/cartdataprint')
} catch (error) {
  res.redirect('/error')

  console.log(error.message);
}
}
// remove from cart
const removeFromCart = async (req, res) => {
  try{
  console.log(req.query.id);
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  // let productid=req.query.productId
  // await cartmodel.updateOne({ userId: userid,$elemMatch: {'cartItems.productId': req.query.id} }, { $pull: { cartItems : {productId:productid}} } )
  await cartmodel.updateOne({userId:userid},{$pull:{cartItems:{productId:req.query.id}}})
  // await cartmodel.findByIdAndUpdate(userId: userid, {
  //     $pull: {
  //       cartItems: {
  //         productId: req.body.productid,
  //       },
  //     },})
  res.redirect('/cartdataprint')
} catch (error) {
  res.redirect('/error')

  console.log(error.message);
}
}


















// wishlist
const userWishlist = async (req, res) => {

try{

    const email = req.session.userEmail
    let userid = await userdata.findOne({ email: email })
    const wishlistdata = await wishlistmodel.findOne({ userId: userid }).populate('products');
    console.log(wishlistdata);
    res.render('../views/product/wishlist.ejs', { wishlistdata: wishlistdata })
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')

}
}
// add to wishlist
const userAddToWishlist = async (req, res) => {
  try{
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  let userWishlist = await wishlistmodel.findOne({ userId: userid })
  if (!userWishlist) {
    await wishlistmodel.insertMany([{ userId: userid }])
    userWishlist = await wishlistmodel.findOne({ userId: userid })
  }
  let itemIndex = userWishlist.products.findIndex((products) => {
    return products == req.query.productId
  })
  if (itemIndex > -1) {//-1 if no item matches
    console.log('product alredy exist');
  }
  else {
    await wishlistmodel.updateOne({ userId: userid },
      {
        $push: { products: req.query.productId }
      }
    )
  }
  res.redirect('/wishlistdata')
} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}
}
// remove from wishlist
const removeFromWishlist = async (req, res) => {
  try{
  const email = req.session.userEmail
  let userid = await userdata.findOne({ email: email })
  await wishlistmodel.updateOne({ userId: userid }, { $pull: { products: req.query.productId } })
  res.redirect('/wishlistdata')
} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}
}
// removefrom wishlist add to cart
const addcartwishlist = async (req, res) => {
  try{
  let userid = await userdata.find({ email: req.session.userEmail });
  let user_id = userid[0]._id
  // delete from wishlist
  // add to cart
  let userCart = await cartmodel.findOne({ userId: user_id })
  let itemIndex = userCart.cartItems.findIndex((cartItems) => {
    return cartItems.productId == req.query.productId
  })
  if (itemIndex > -1) {//-1 if no item matches
    await cartmodel.updateOne({ userId: user_id, 'cartItems.productId': req.query.productId },
      {

        $inc: { 'cartItems.$.qty': 1 }
      }
    )
    await wishlistmodel.updateOne({ userId: user_id }, { $pull: { products: req.query.productId } })

  }
  else {
    await cartmodel.updateOne({ userId: user_id },
      {
        $push: { cartItems: { productId: req.query.productId, qty: 1 } }
      }
    )
    await wishlistmodel.updateOne({ userId: user_id }, { $pull: { products: req.query.productId } })
  }
  res.redirect('/wishlistdata')
} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}
}












module.exports = {
  error,
  landing,

  product,

  singleproduct,

  cartdataprint,
  userAddToCart,
  userAddFromCart,
  userDeductFromCart,
  removeFromCart,

  userWishlist,
  userAddToWishlist,
  removeFromWishlist,
  addcartwishlist
};

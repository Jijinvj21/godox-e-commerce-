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
    const bannerimg = await bannermodel.find({ status: true });
    res.render("../views/product/landingpage.ejs", { banner: bannerimg });
  }
  catch (error) {
    console.log(error);
    res.redirect('/error')
  }
}
// display, search, pagination, sort, filter
let products;
let allproducts;
let current;
let pages;
const product = async (req, res) => {
  try {

    if (!allproducts) {
      allproducts = await Product.find({ status: true })
      let dummy = allproducts
      let category = await categorylist.find({});
      products = dummy.slice(0, 6);
      pages = 2;
      current = 1;
      res.render("../views/product/product", {
        productdata: products, categorylist: category, totalpage: 1,pages,current
      })
    } else {
      let category = await categorylist.find({});

      res.render("../views/product/product", {
        productdata: products, categorylist: category, totalpage: 1,pages,current
      })
    }

  } catch (error) {
    console.log(error.message);
    res.redirect('/error')
  }
};
//sort
const shop = async (req, res) => {
  if (categories) {
    let temp = categories
    if (req.body.sort == "asort") {
      let dummy = temp.sort((a, b) => b.price - a.price);

      products = dummy.slice(0, 6);
      pages = 1;
      current = 1;
      res.json({
        success: true,
      });
    } else if (req.body.sort == "dsort") {
      let dummy = temp.sort((a, b) => a.price - b.price);

      products = dummy.slice(0, 6);
      pages = 1;
      current = 1;
      res.json({
        succes: true,
      });
    }
  } else if (searchData) {
    let temp = searchData
    if (req.body.sort == "asort") {
      products = temp.sort((a, b) => b.price - a.price);
      let dummy = temp
      products = dummy.slice(0, 6);
      pages = 1;
      current = 1;

      res.json({
        success: true,
      });
    } else if (req.body.sort == "dsort") {
      products = temp.sort((a, b) => a.price - b.price);
      let dummy = temp
      products = dummy.slice(0, 6);
      pages = 1;
      current = 1;
      res.json({
        succes: true,
      });
    }
  } else {
    let temp = allproducts
    if (req.body.sort == "asort") {
      products = temp.sort((a, b) => b.price - a.price);
      let dummy = temp
      products = dummy.slice(0, 6);
      pages = 2;
      current = 1;

      res.json({
        success: true,
      });
    } else if (req.body.sort == "dsort") {
      products = temp.sort((a, b) => a.price - b.price);
      let dummy = temp
      products = dummy.slice(0, 6);
      pages = 2;
      current = 1;
      res.json({
        succes: true,
      });
    }
  }


}


let categories;
const catfilter = async (req, res) => {
  if (searchData) {
    let temp = searchData

    categories = []
    temp.forEach(item => {
      if (item.category === req.body.category) {
        categories.push(item)
      }
    });
    let dummy = categories
    products = dummy.slice(0, 6);
    pages = 1;
    current = 1;
    res.json({
      succes: true,
    });

  } else {
    let temp = allproducts

    categories = []
    temp.forEach(item => {
      if (item.category === req.body.category) {
        categories.push(item)
      }
    });
    let dummy = categories
    products = dummy.slice(0, 6);
    pages = 1;
    current = 1;
    res.json({
      succes: true,
    });
  }

}

let searchData;
const searchProduct = async (req, res) => {
  const regex = new RegExp(req.body.search, "i");
  if (categories) {
    let temp = categories
    searchData = []


    temp.forEach(item => {
      if (regex.exec(item.name)) {
        searchData.push(item)
      }
    });
    let dummy = searchData
    products = dummy.slice(0, 6);
    pages = 1;
    current = 1;
    res.json({
      succes: true,
    });
  } else {
    let temp = allproducts
    searchData = []


    temp.forEach(item => {
      if (regex.exec(item.name)) {
        searchData.push(item)
      }
    });
    let dummy = searchData

    products = dummy.slice(0, 6);
    pages = 1;
    current = 1;
    res.json({
      succes: true,
    });
  }

}
const clearFilter = async (req, res) => {
  categories = null
  searchData = null
  let dummy = allproducts
  products = dummy.slice(0, 6);

  pages = 2;
  current = 1;
  res.json({ succes: true })

}

const pagination = async (req, res) => {
  var perPage = 6;
  var page = req.body.cat || 1;
  if (categories) {
    let count = categories.length;
    let dummy = [];
    dummy = categories;
    products = dummy.slice(perPage * page - perPage, perPage * page);

    current = page;
    pages = Math.ceil(count / perPage);
    res.json({
      success: true,
    });

  } else if (searchData) {
    let count = searchData.length;
    let dummy = [];
    dummy = searchData;
    products = dummy.slice(perPage * page - perPage, perPage * page);

    current = page;
    pages = Math.ceil(count / perPage);
    res.json({
      success: true,
    });
  } else {
    let count = allproducts.length;
    let dummy = [];
    dummy = allproducts;
    products = dummy.slice(perPage * page - perPage, perPage * page);

    current = page;
    pages = Math.ceil(count / perPage);
    res.json({
      success: true,
    });
  }

}







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
  try {
    const email = req.session.userEmail
    let userid = await userdata.findOne({ email: email })
    let userCart = await cartmodel.findOne({ userId: userid })
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
  try {
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
  try {
    const email = req.session.userEmail
    let userid = await userdata.findOne({ email: email })
    await cartmodel.updateOne({ userId: userid }, { $pull: { cartItems: { productId: req.query.id } } })
    res.redirect('/cartdataprint')
  } catch (error) {
    res.redirect('/error')
    console.log(error.message);
  }
}
// wishlist
const userWishlist = async (req, res) => {
  try {
    const email = req.session.userEmail
    let userid = await userdata.findOne({ email: email })
    const wishlistdata = await wishlistmodel.findOne({ userId: userid }).populate('products');
    res.render('../views/product/wishlist.ejs', { wishlistdata: wishlistdata })
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')
  }
}
// add to wishlist
const userAddToWishlist = async (req, res) => {
  try {
    const email = req.session.userEmail
    let userid = await userdata.findOne({ email: email })
    let userWishlist = await wishlistmodel.findOne({ userId: userid })
    let productAlreadyExist
    if (!userWishlist) {
      await wishlistmodel.insertMany([{ userId: userid }])
      userWishlist = await wishlistmodel.findOne({ userId: userid })
    }
    let itemIndex = userWishlist.products.findIndex((products) => {
      return products == req.query.productId
    })
    if (itemIndex > -1) {//-1 if no item matches
      productAlreadyExist = true
    }
    else {
      await wishlistmodel.updateOne({ userId: userid },
        {
          $push: { products: req.query.productId }
        }
      )
    }
    res.json({ email, productAlreadyExist })
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')
  }
}
// remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
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
  try {
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
  shop,
  catfilter,
  singleproduct,
  cartdataprint,
  userAddToCart,
  userAddFromCart,
  userDeductFromCart,
  removeFromCart,
  userWishlist,
  userAddToWishlist,
  removeFromWishlist,
  addcartwishlist,
  searchProduct,
  clearFilter,
  pagination
};

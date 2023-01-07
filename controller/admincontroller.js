const express = require("express");
const sharp =require("sharp")
const admindatamodel = require("../models/adminmodel");
const Product = require("../models/adminproductmodel");
const Userdatamodel = require("../models/userModel");
const categorymodel = require("../models/categorymodel");
const bannermodel = require("../models/bannermodel");
const couponmodel = require("../models/couponmodel");
const ordermodel = require("../models/ordermodel");

const userdatause = require("../controller/usercontroller");

const adminlogin = (req, res) => {
  res.render("../views/admin/adminlogin");
};

const admincategory = (req, res) => {
  res.render("../views/admin/admincategory");
};



// admin login

const adminlogdata = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    let user = await admindatamodel.findOne({ email: email });
    if (user) {
      if (email === user.email && password === user.password) {
        req.session.email=email
        // res.send('ok')
        res.redirect("/admindashboard");
      } else {
        res.render("../views/admin/adminlogin.ejs", {
          wrong: "Invalid Credentials",
        });
      }
    } else {
      res.render("../views/admin/adminlogin.ejs", {
        wrong: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// adminlogout
const adminlogout = (req, res) => {

  req.session.destroy()
  res.redirect('/adminlogin')
};

// show customer data
const userdata = async (req, res) => {
  try {
    const userdetail = await Userdatamodel.find();
    res.render("../views/admin/customer.ejs", { userdatashow: userdetail });
  } catch (err) {}
};
// dashboard
const admindashboard = async(req, res) => {
  // find user data
  const boarduserdata = await Userdatamodel.find();
  // find product  data
  // flash count
  const flashcount = await Product.find({category:"Flash"});
  // Continuous Light
  const  continuouslight= await Product.find({category:"Continuous Light"});
  // Monitor
  const  monitor= await Product.find({category:"Monitor"});
  // Audio
  const  audio= await Product.find({category:"Audio"});
  // Light Shaper
  const  lightshaper= await Product.find({category:"Light Shaper"});
  // Accessories
  const accessories= await Product.find({category:"Accessories"});


  // find order
  const boardorderdata = await ordermodel.find();


  res.render("../views/admin/admindashboard",{boarduserdata,boardorderdata,flashcount,continuouslight,monitor,audio,lightshaper,accessories});
};
const adminboarddata =(req,res)=>{


  res.redirect('/admindashboard')
}



























// blockuser
const blockuser = async (req, res) => {
  try {
    console.log("reach");
    const check = await Userdatamodel.findById({ _id: req.query.id });
    console.log(check);
    if (check.status == true) {
      await Userdatamodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
      console.log(req.query.id + "hau");

      console.log(check.status);
    } else {
      await Userdatamodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
      console.log(check.status);
    }
    res.redirect("/admincustomer");
  } catch (error) {
    console.log(error.message);
  }
};
// insert image
const insertProduct = async (req, res) => {






//   const croppedImage = await sharp(req.files[0])
//   .resize({ width: 200, height: 200 })

 

// const product  = product ({
//   cropedimg: croppedImage
// });
// await product .save();





  try {

    let product =  new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: [req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename],// req.file.filename
      // cropedimg: await sharp(req.files[0]).resize(300,200),
      price: req.body.price,
      quantity: req.body.quantity,
    });
  //  console.log(req.files.buffer);
    product.save();
    res.redirect("/adminproducts");
    console.log(product.cropedimg);
  } catch (error) {
    console.log(error.message);
  }
};

// display image
const displayimage = async (req, res) => {
  try {
    const catData = await categorymodel.find();
    const detail = await Product.find();
    res.render("../views/admin/display.ejs", {
      product: detail,
      catData: catData,
    }); //../views/admin/display.ejs
  } catch (err) {}
};

//   blockproduct
const blockproduct = async (req, res) => {
  try {
    console.log("reach");
    const check = await Product.findById({ _id: req.query.id });

    if (check.status == true) {
      await Product.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
      console.log(req.query.id + "hau");

      console.log(check.status);
    } else {
      await Product.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
      console.log(check.status);
    }
    res.redirect("/adminproducts");
  } catch (error) {
    console.log(error.message);
  }
};

// // deleteproduct
// const deleteproduct = async (req, res) => {
//   try {
//     console.log("reach");
//     const checks = await Product.findById({ _id: req.query.id });
//     await Product.findByIdAndDelete({ _id: req.query.id });
//     console.log(checks);
//     res.redirect("/adminproducts");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//   get  productid
let editid;
const adminproductgetid = async (req, res) => {
  try {
    console.log(req.query.id);
    editid = req.query.id;
  } catch (error) {
    console.log(error.message);
  }
};

// edit product
const adminproductedit = async (req, res) => {
  try {
    const checkedit = await Product.findById({ _id: editid });
    console.log(checkedit);
    await Product.findByIdAndUpdate(
      { _id: editid },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          image: req.file.filename,
          price: req.body.price,
          quantity: req.body.quantity,
        },
      }
    );
    res.redirect("/adminproducts");
  } catch (error) {
    console.log(error.message);
  }
};

// render category
const categorydata = async (req, res) => {
  try {
    const userdetaicategory = await categorymodel.find({});
    res.render("../views/admin/admincategory.ejs", {
      category: userdetaicategory,
    });
  } catch (err) {}
  console.log("reach");
};
// add category
const addcategory = async (req, res) => {
  try {
    let category = new categorymodel({
      name: req.body.name,
    });
    console.log(req.file);
    category.save();
    res.redirect("/admincategory");
  } catch (error) {
    console.log(error.message);
  }
  console.log("reach");
};
// category block

const categoryblock = async (req, res) => {
  try {
    console.log("reach");
    const check = await categorymodel.findById({ _id: req.query.id });

    if (check.status == true) {
      await categorymodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
      console.log(req.query.id + "hau");

      console.log(check.status);
    } else {
      await categorymodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
      console.log(check.status);
    }
    res.redirect("/admincategory");
  } catch (error) {
    console.log(error.message);
  }

  console.log("reach");
};

// banner

// insert banner
const insertbanner = (req, res) => {
  try {
    let banner = new bannermodel({
      image: req.file.filename, //it is for add multiple image insted of req.files write req.file,filename
    });
    banner.save();
    res.redirect("/adminbanner");
  } catch (error) {
    console.log(error.message);
  }
};

// display banner image
const banner = async (req, res) => {
  try {
    const bannerimg = await bannermodel.find({});
    res.render("../views/admin/banner.ejs", {
      bannerimg: bannerimg,
    });
  } catch (err) {}
  console.log("reach");
};
// block banner image
const bannerblock = async (req, res) => {
  try {
    const check = await bannermodel.findById({ _id: req.query.id });

    if (check.status == true) {
      await bannermodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
    } else {
      await bannermodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
    }
    res.redirect("/adminbanner");
  } catch (error) {
    console.log(error.message);
  }
};
// coupon inasert
const couponsdata = async (req, res) => {
  try {
    const name = req.body.name;
    const discount = req.body.discount;
    const maxdiscount = req.body.maxdiscount;
    const minamount = req.body.minamount;
    const date = req.body.date;

    let coupondata = await admindatamodel.findOne({ name: name });
    if (coupondata) {
      console.log(exist);
    } else {
      let coupon = new couponmodel({
        name: name,
        discount: discount,
        maxdiscount: maxdiscount,
        minamount: minamount,
        date: date,
      });
      coupon.save();
      res.redirect("/admincoupons");
    }
  } catch (error) {
    console.log(error.message);
  }
};
// display coupon
const admincoupon = async(req, res) => {
  try{
    const coupon = await couponmodel.find({});
    res.render("../views/admin/admincoupon",{coupondata:coupon});

  }
  catch (error){

    console.log(error.message);
  }
};
// coupon block unblock
const couponblock=async(req,res)=>{
  try {
    const check = await couponmodel.findById({ _id: req.query.id });

    if (check.status == true) {
      await couponmodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
    } else {
      await couponmodel.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
    }
    res.redirect("/admincoupons");
  } catch (error) {
    console.log(error.message);
  }
}

// order
 
// ordermodel.insertMany({name:"jijin",
//   product:"SKILLVSeries",
//   address:"vazhappilly,house,chowwannur,po,kunnamkulam,thrissur",
//   payment:"COD"});

// display order
const adminorder = async(req, res) => {
  try{
    const order = await ordermodel.find({});
   

    res.render("../views/admin/adminorder",{order:order});
  }
  catch(error){
console.log(error.message);
  }
 
};





















module.exports = {
  admindashboard,

  // admin login
  adminlogin,
  adminlogdata,
  // logout
  adminlogout,
  // dashboard
  adminboarddata,
  // admincustomer,
  admincategory,
  adminorder,
  admincoupon,
  // user
  userdata,
  blockuser,
  // product
  insertProduct,
  displayimage,
  blockproduct,
  // deleteproduct,
  adminproductgetid,
  adminproductedit,
  // category
  categorydata,
  addcategory,
  categoryblock,
  // banner
  banner,
  insertbanner,
  bannerblock,
  //coupons
  couponsdata,
  couponblock
};

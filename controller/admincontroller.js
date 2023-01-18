const sharp = require("sharp")
const admindatamodel = require("../models/adminmodel");
const Product = require("../models/adminproductmodel");
const Userdatamodel = require("../models/usermodel");
const categorymodel = require("../models/categorymodel");
const bannermodel = require("../models/bannermodel");
const couponmodel = require("../models/couponmodel");
const ordermodel = require("../models/ordermodel");
const User = require("../models/usermodel");
const cloudinary = require('cloudinary').v2;

//cloudinary  Configuration
cloudinary.config({
  cloud_name: "dczou8g32",
  api_key: "634374197678664",
  api_secret: "bT83DQmDOjNOnRPcK8zQqWF6DQU"
});



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
        req.session.email = email
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
    res.redirect('/error')

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
  } catch (err) {
    console.log(err.message);
    res.redirect('/error')

  }
};
// dashboard
const admindashboard = async (req, res) => {
try {
  


  // find order
  const order = await Product.find();
  // find order
  const boardorderdata = await ordermodel.find();
  // user
  const userdata = await User.find();
  // product count
  const productcount = await Product.find();
  // Return','Shipped', 'Placed', 'Delivered', 'Cancelled
  const placed = await ordermodel.find({ status: 'placed' }).count()
  const Return = await ordermodel.find({ status: 'return' }).count()
  const shipped = await ordermodel.find({ status: 'shipping' }).count()
  const Delivered = await ordermodel.find({ status: 'delivered' }).count()
  const Cancelled = await ordermodel.find({ status: 'cancel' }).count()



  let orderPerMonth = []
  for (let i = 0; i < 12; i++) {
    let numberOfOrders = await ordermodel.find({ month: i }).count()
    orderPerMonth.push(numberOfOrders)
  }
  console.log(orderPerMonth);
  console.log( boardorderdata+","+ order+","+ userdata+","+ productcount+", "+placed+", "+Return+","+ shipped+"," +Delivered+", "+Cancelled+","+ orderPerMonth);


  res.render("../views/admin/admindashboard", { boardorderdata, order, userdata, productcount, placed, Return, shipped, Delivered, Cancelled, orderPerMonth })

} catch (error) {
  console.log(error.message);
  res.redirect('/error')

}
};
const adminboarddata = (req, res) => {


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
    res.redirect('/error')

  }
};
// insert image
const insertProduct = async (req, res) => {
  if (req.files) {
    console.log(req.files)
    try {

      // cloudinary
      const files = req.files;
      const promises = await files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, {
            transformation: [
              { width: 485, height: 485, gravity: "face", crop: "fill" },
            ]
          }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      });

      Promise.all(promises)
        .then(async (results) => {
          console.log("All files uploaded successfully", results);
          console.log(req.body)
          const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            image: results,
          })
          newProduct.save()
          console.log(newProduct)

        })
      res.redirect("/adminproducts");
    } catch (error) {
      console.log(error.message);
      res.redirect('/error')

    }
  }
  else {
    res.redirect('/admin/products/categorymangement?message=Select jpeg format')
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
    });
  } catch (err) {
    console.log(err.message);
    res.redirect('/error')

  }
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
    res.redirect('/error')

  }
};


//   get  productid
let  editid;
const adminproductgetid = async (req, res) => {
  try {
    console.log(req.query.id);
    editid = req.query.id;
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')

  }
};

// edit product

const adminproductedit = async (req, res) => {

  try {

console.log( editid);


console.log(req.files);
  const files = req.files;
  const promises = await files.map(async (file, index) => {
    const checkedit = await Product.findById({ _id: editid });
    console.log(checkedit);
    
    return new Promise( (resolve, reject) => {

      cloudinary.uploader.upload(file.path,
       {
        public_id: checkedit.image[index].public_id, 
      overwrite: true,
        transformation: [
          { width: 485, height: 485, gravity: "face", crop: "fill" },
        ]
      }
      , (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
});
});

  Promise.all(promises)
    .then(async (results) => {
      console.log("All files uploaded successfully", results);
      console.log(results)
        const checkedit = await Product.findById({ _id: editid });
        console.log(checkedit);
        await Product.updateOne(
  
          { _id: editid },
          {
            $set: {
              name: req.body.name,
              description: req.body.description,
              category: req.body.category,
              image: results,           
                 price: req.body.price,
              quantity: req.body.quantity,
            },
          }
        );
      })
  console.log(req.file);
    res.redirect("/adminproducts");
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')

  }
};

// render category
const categorydata = async (req, res) => {
  try {
    const userdetaicategory = await categorymodel.find({});
    res.render("../views/admin/admincategory.ejs", {
      category: userdetaicategory,
    });
  } catch (err) {
    console.log(err.message);
    res.redirect('/error')

  }
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
    res.redirect('/error')

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
    res.redirect('/error')

  }

  console.log("reach");
};

// banner

// insert banner
const insertbanner = (req, res) => {
  try {
    let banner = new bannermodel({
      image: req.file.filename,
    });
    banner.save();
    res.redirect("/adminbanner");
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')

  }
};

// display banner image
const banner = async (req, res) => {
  try {
    const bannerimg = await bannermodel.find({});
    res.render("../views/admin/banner.ejs", {
      bannerimg: bannerimg,
    });
  } catch (err) {
    console.log(err.message);
    res.redirect('/error')

  }
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
    res.redirect('/error')

  }
};
// coupon inasert
const couponsdata = async (req, res) => {


  try {

    const name = req.body.name;
    let couponexist = await couponmodel.findOne({ name: name });
    if (couponexist) {
      console.log('exist');
      res.redirect("/admincoupons");
    } else {
      let coupon = new couponmodel({
        name: req.body.name,
        discount: req.body.discount,
        maxdiscount: req.body.maxdiscount,
        minpurchaseamount: req.body.minpurchase,
        createddate: req.body.crearedate,
        expiredate: req.body.expiredate,

      });
      coupon.save();
      res.redirect("/admincoupons");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect('/error')

  }
};


// display coupon
const admincoupon = async (req, res) => {
  try {
    const coupon = await couponmodel.find({});

    res.render("../views/admin/admincoupon", { coupondata: coupon });

  }
  catch (error) {
    res.redirect('/error')

    console.log(error.message);
  }
};

const orderstatus = async (req, res) => {
  try{
  let status = req.body.select
  let id = req.body.proid
  await ordermodel.updateOne({ _id: id }, { $set: { status: status } })
  const date = new Date();
  const month = date.getMonth();
  await ordermodel.updateOne({ _id: id }, { $set: { month: month } })

  res.redirect('/adminorder')
} catch (error) {
  console.log(error.message);
}
}

// display order
const adminorder = async (req, res) => {
  try {
    const order = await ordermodel.find({});


    res.render("../views/admin/adminorder", { order: order });
  }
  catch (error) {
    console.log(error.message);
    res.redirect('/error')

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
  // order
  orderstatus,
  adminorder,
  // coupon
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
  // couponblock

};

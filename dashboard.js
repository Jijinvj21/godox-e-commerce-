// SIDEBAR TOGGLE

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
  if(!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if(sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}



// ---------- CHARTS ----------

// BAR CHART
var barChartOptions = {
  series: [{
    data: [12, 10, 8, 6, 4, 2]
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false
    },
  },
  colors: [
    "#6c6c6c"
    // "#000000",
    // "#000000",
    // "#000000",
    // "#000000"
  ],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: '25%',
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  xaxis: {
    categories: ["jijin", "Laptop", "Phone", "Monitor", "Headphones", "Camera" ],
  },
  yaxis: {
    title: {
      text: "Count"
    }
  }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();


// AREA CHART
var areaChartOptions = {
  series: [{
    name: 'Purchase Orders',
    data: [31, 40, 28, 51, 42, 109, 120, 110, 150, 115, 180, 200]
  }, {
    name: 'Sales Orders',
    data: [11, 32, 45, 32, 34, 52, 41, 71, 81, 101, 91, 110]
  }],
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: [" #6c6c6c", "#353535"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth'
  },
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  markers: {
    size: 0
  },
  yaxis: [
    {
      title: {
        text: 'Purchase Orders',
      },
    },
    {
      opposite: true,
      title: {
        text: 'Sales Orders',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  }
};

var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
areaChart.render();

























































//-----------product add----------
const { result } = require("lodash");
const Project = require("../../models/userschema");
const Product = require("../../models/productschema");
const Category = require("../../models/categoryschema")
const bodyparser = require("body-parser");
const multer = require('multer')
const upload = require('../../config/multer')
const fileUpload = multer()
const Cloudinary = require ('../../config/cloudinary')
const streamifier = require('streamifier')
const url = require('url')
const fs = require('fs');
const { log } = require("console");
require('dotenv').config(),
require("../../config/connection")
const Path = require('path');
const sharp = require('sharp')


const product_add = (req,res) =>{
  Category.find()
  .sort({createdAt:-1})
  .then((result) =>{
    res.render('admin/admin-product-add',{title : "admin-product-add",category : result})
  })
}
  const product_post = async (req, res) => {
    try {

  const dirname = '/home/mujeeb/Desktop/visual studio/project/public/upload/';
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const imgs = [];
  let img;
        const imageName = uniqueSuffix + '-' + req.files.Image[0].originalname;
        console.log(imageName )
     
          const data = {
            image: req.files.Image[0].path
          }
  
          console.log(data.image);
          let war = await Cloudinary.uploader.upload(data.image, {public_id: imageName})
console.log(war);
          //  .then((result)=>console.log( result.public_id))

          //    await  Cloudinary.uploader.upload(req.files.Image[0].originalname,)
          //  .catch((err)=>console.log(err))      
      // console.log(war.url+"this is the url result")
      // console.log(war.public_id+"this is the public_id result")
     
      for (i = 0;i < req.files.Images.length; i++) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

      const imageName = uniqueSuffix + '-' + req.files.Images[i].originalname;
      console.log(imageName )

        // sharp(req.files.Images[i].buffer)
        //   .resize({ width: 485, height: 485 })
        //   .toFormat("png")
        //   .png({ quality: 80 })
        //   .toFile('public/upload/'+imageName); 
          // app.post("/image-upload", (req, res) => {
            const datas = {
              image: req.files.Images[i].path
            }
            let mar = await Cloudinary.uploader.upload(datas.image, {public_id: imageName})
            
        // console.log(mar)
          imgs.push({public_id :mar.public_id , url :mar.url });
      } 

      newproduct = new Product({
        // file:req.file.instalfile,
        title: req.body.name,
        developer: req.body.developer,
        release_date:Date.now(),
        category:  req.body.category,
        genres: req.body.genres,
        cost: req.body.cost,
        imgs:imgs ,
        img:{public_id :war.public_id , url :war.url }
      });
    await newproduct.save();
      res.redirect('/admin-product-add');
          console.log(newproduct+'new product added');

    } catch (err) {
      Category.find()
      .sort({createdAt:-1})
      .then((result) =>{
        res.render('admin/admin-product-add',{title : "admin-product-add",category : result,err})
      })
      console.log(err);

    }
  };

//--------------cloudinary-------------
console.log('IN THE  CLOUDINARY')


require('dotenv').config()
require("./connection")

const cloudinary = require ('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true

  });
module.exports = cloudinary ;

//---------route---------
// router.post('/admin-product-add',upload.fields("image"),controler_admin.product_post)
router.post('/admin-product-add',upload.fields([
  { name: "Image"},
  { name: "Images"},
  { name: "category"},
  { name: "genres"},
  // { name: "instalfile"}, 


]),controler_admin.product_post)


//-----------multer----------
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const path=require('path');

const cloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "DEV",
    },
  });
  const upload = multer({ storage: cloudstorage});

module.exports=upload

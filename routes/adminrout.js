const express = require("express");

const router = express.Router();

const adminController = require("../controller/admincontroller");
const upload = require("../utility/multer");
const uploadbuffer =require("../utility/multerbuffer")
const adminSession = require("../middleware/adminSession");
const salesReport =require("../utility/export")


const adminSessionMW=adminSession.adminSession
const withOutAdminSessionMW=adminSession.withOutAdminSession

// get method

router.get("/admindashboard",adminSessionMW,adminController.admindashboard);

router.get("/adminorder",adminSessionMW, adminController.adminorder);

// post method
router.post("/admindashboard", adminController.admindashboard);
// admin login

router.get("/adminlogin",withOutAdminSessionMW, adminController.adminlogin);

router.post("/adminlogin", adminController.adminlogdata);
// logout  
router.get("/adminlogout", adminController.adminlogout);


// display products
router.get("/adminproducts",adminSessionMW, adminController.displayimage);
// insert data
router.post(
  "/adminproducts",
  uploadbuffer.array("image", 12),
  adminController.insertProduct
);
// blockproduct
router.get("/adminproductsshow",adminSessionMW, adminController.blockproduct);
// get product id
router.get("/adminproductgetid",adminSessionMW, adminController.adminproductgetid);
// edit product data
router.post(
  "/adminproductedit",
  uploadbuffer.array("image", 12),
  adminController.adminproductedit
);

// display user data
router.get("/admincustomer",adminSessionMW, adminController.userdata);
// user block
router.get("/userdatablock",adminSessionMW, adminController.blockuser);

// display category
router.get("/admincategory",adminSessionMW, adminController.categorydata);

// addcategory
router.post("/addcategory", adminController.addcategory);
// blockcategory
router.get("/categoryblock",adminSessionMW, adminController.categoryblock);
// display bannermanage
router.get("/adminbanner",adminSessionMW, adminController.banner);

// addbanner
router.post(
  "/adminbanner",
  upload.single("image",),   // it is for add multiple image for single image changr array to single
  adminController.insertbanner
);
// banner block
router.get("/imageblock",adminSessionMW, adminController.bannerblock);

// coupon
router.get("/admincoupons",adminSessionMW, adminController.admincoupon);
// add coupons
router.post("/admincoupons", adminController.couponsdata);
// block coupon
// orderstatus
router.post("/orderstatus", adminController.orderstatus);

router.get("/exportorder", salesReport.exportorder);
module.exports = router;

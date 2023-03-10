const express=require('express');
const router=express.Router();
const paymentController=require('../controller/paymentcontroller')
const paypalController= require('../utility/paypal')
const sessionMV=require('../middleware/userSession')
 const userSessionMV=sessionMV.userSession
 const noSession=sessionMV.noSession
router.get('/checkout',userSessionMV,paymentController.checkout)
router.post('/checkoutform',userSessionMV,paymentController.checkoutform)
router.post('/couponcheck',userSessionMV,paymentController.couponcheck)
router.post('/checkout',userSessionMV,paymentController.checkouttot)
router.post("/checkoutdata",userSessionMV, paypalController.paypalgate);
router.get('/successpay',userSessionMV,paypalController.success)
module.exports=router 
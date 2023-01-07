const express=require('express');
const router=express.Router();
const paymentController=require('../controller/paymentcontroller')

const sessionMV=require('../middleware/userSession')
 const userSessionMV=sessionMV.userSession
 const noSession=sessionMV.noSession



router.get('/address',userSessionMV,paymentController.address)
router.post('/addadderss',userSessionMV,paymentController.addadderss)
router.get('/checkout',userSessionMV,paymentController.checkout)
router.post('/checkoutform',userSessionMV,paymentController.checkoutform)
router.post('/checkoutdata',userSessionMV,paymentController.checkoutdata)



module.exports=router 
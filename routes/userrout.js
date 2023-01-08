const express=require('express');
const sessionMV=require('../middleware/userSession')
 const userSessionMV=sessionMV.userSession
 const noSession=sessionMV.noSession

const router=express.Router();


const userController=require('../controller/usercontroller')
const productController=require('../controller/productcontroller')

// get method

router.get('/userlogin',noSession,userController.userlogin)
router.get('/usersignup',userController.usersignup)
router.get('/userotp',userController.userotp)
router.get('/logout',userController.logout)


// post method

router.post('/userotp',userController.insertUser)
router.post('/userlogin',userController. userverification)
router.post('/otp',userController.otp)
router.post('/resendotp',userController.resendotp)


// forgotpage

router.get('/forgotemail',userController.forgotemail)

router.get('/forgototp',userController.forgototp)

router.get('/forgotpassword',userController.forgotpassword)


router.post('/forgotemail',userController.forgotemailcheck )

router.post('/forgototpckeck',userController.forgototpckeck )

router.post('/forgotnewpasword',userController.forgotnewpasword)

// user data display

router.get('/viewuserdata',userSessionMV,userController.viewuserdata)
router.post('/addadderss',userSessionMV,userController.addadderss)
router.post('/edituserdata',userSessionMV,userController.edituserdata)

router.post('/edituserpass',userSessionMV,userController.edituserpass)

router.post('/userorderstatus',userSessionMV,userController.updateorder)








module.exports=router 
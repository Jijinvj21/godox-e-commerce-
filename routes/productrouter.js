const express=require('express');
const router=express.Router();
const productController=require('../controller/productcontroller')

const sessionMV=require('../middleware/userSession')
 const userSessionMV=sessionMV.userSession
 const noSession=sessionMV.noSession





router.get('/',productController.landing)
router.get('/productpage',productController.product)
router.get('/singleproduct',productController.singleproduct)


router.get('/cartpage',userSessionMV,productController.userAddToCart)
router.get('/cartimc',userSessionMV,productController.userAddFromCart)
router.get('/cartdec',userSessionMV,productController.userDeductFromCart)
router.get('/cartdataprint',userSessionMV,productController.cartdataprint)
router.get('/productId',userSessionMV,productController.removeFromCart)




router.get('/wishlistdata',userSessionMV,productController.userWishlist)
router.get('/wishlistdat',userSessionMV,productController.userAddToWishlist)
router.get('/wishlistremove',userSessionMV,productController.removeFromWishlist)
router.get('/addcartwishlist',userSessionMV,productController.addcartwishlist)








module.exports=router 
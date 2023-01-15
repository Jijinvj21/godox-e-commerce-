const mongoose = require('mongoose');
// const { userAddToCart } = require('../controller/productcontroller');

// const Adminproduct=require('./adminproductmodel');
const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    cartItems:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'product',
            },
            qty:{
                type:Number,
                required:true,
                default:1,
            },
            total:{
                type:Number
            }
        }],
        totalPrice:Number,
        discoundamount:{
            type:Number
        }
})


const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;
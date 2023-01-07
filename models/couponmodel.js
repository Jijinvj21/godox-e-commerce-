const mongoose=require('mongoose');

const { Schema } = mongoose;
const couponSchema = new Schema({
    name:String,
    discount:String,
    maxdiscount:String,
    minamount:String,
    date:String,
    status:{
        type:Boolean,
        default:true
    }
});
const coupon = mongoose.model('coupon', couponSchema);

module.exports=coupon;
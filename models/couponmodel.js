const mongoose=require('mongoose');

const { Schema } = mongoose;
const couponSchema = new Schema({
    name:String,
    discount:Number,
    maxdiscount:Number,
    minpurchaseamount:Number,
    createddate:Date,
    expiredate:Date,
    status:{
        type:Boolean,
        default:true
    },
    userdata:[{
        userId:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'User'
        },
    
    }],
  
    
});
const coupon = mongoose.model('coupon', couponSchema);

module.exports=coupon;
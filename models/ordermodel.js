const mongoose=require('mongoose');

const { Schema } = mongoose;
const orderSchema = new Schema({
   
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    product:{},
    addresses:[{
        address:String,
        phone:String,
        name:String,
        pincode:String,
        }],
    status:String,
    payment:String,
    date:{
        type:Date,
        default:Date.now
    },
    total:{
        type:String
    }
  
});























const order = mongoose.model('order', orderSchema);

module.exports=order;
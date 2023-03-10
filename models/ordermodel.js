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
    status:{
        type:String,
        default:'Placed',
    },
    payment:String,
    date:{
        type:Date,
        default:Date.now()
    },
    total:{
        type:String
    },
   
    month:Number
  
});























const order = mongoose.model('order', orderSchema);

module.exports=order;
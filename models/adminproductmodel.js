const mongoose=require('mongoose');
const{ Schema } =mongoose;
const adminproductSchema= new Schema({
    name:String,
    description:String,
    category:String,
    image:Array ,
    // cropedimg:String,
    status:{
      type:Boolean,
      default:true
  },
    price:Number,
    quantity:Number

  });
  const Adminproduct = mongoose.model('product', adminproductSchema);
  
  module.exports=Adminproduct;

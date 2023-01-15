const mongoose=require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  name:  String,
  email: String,
  phone: String,
  password:String,
  status:{
    type:Boolean,
    default:true
},
addresses:[{
address:String,
phone:String,
name:String,
pincode:String,
}],
coupondata:[{
 coupons:String
}],
});


const User = mongoose.model('User', userSchema);

module.exports=User;











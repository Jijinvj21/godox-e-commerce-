const mongoose=require('mongoose');
const{ Schema } =mongoose;
const adminSchems= new Schema({
    name:  String,
    email: String,
    password:   String
  });
  const Admin = mongoose.model('Admin', adminSchems);
  
  module.exports=Admin;

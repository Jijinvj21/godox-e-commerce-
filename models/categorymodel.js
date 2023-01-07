const mongoose=require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  name:  String,
  status:{
    type:Boolean,
    default:true
},
});

//3rd make a model
const category = mongoose.model('Category', userSchema);

module.exports=category;
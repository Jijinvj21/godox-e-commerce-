const mongoose=require('mongoose');

const { Schema } = mongoose;
const bannerSchema = new Schema({
    image:{
        type:String //for add multiple image other wise type is string
    },
    status:{
        type:Boolean,
        default:true
    },
});
const banner = mongoose.model('banner', bannerSchema);

module.exports=banner;
const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:{type:mongoose.Types.ObjectId},
    products:[
        { type:mongoose.Types.ObjectId,
    ref:'product'}]
})
const wishlist= mongoose.model('wishlist',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=wishlist
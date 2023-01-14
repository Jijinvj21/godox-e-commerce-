const mongoose=require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected",(err)=>{  
    if(err){
        console.log('error'); 
    }
    else{
        console.log("mongodb connected successfuly");
    }
})
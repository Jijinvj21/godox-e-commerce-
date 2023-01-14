const multer=require('multer');
const path=require('path');



const productstorage = multer.memoryStorage()
const uploadbuffer=multer({storage:productstorage})

module.exports=uploadbuffer;
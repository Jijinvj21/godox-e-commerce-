const multer=require('multer');
const path=require('path');

// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,path.join(__dirname,'../public/databaseimg'));
//     },
//     filename:(req,file,cb)=>{
//         const name=Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
    // filename1:(req,file,cb)=>{
    //     const name=Date.now()+'-'+file.originalname;
    //     cb(null,name);
    // }
// })

const productstorage = multer.memoryStorage()
const uploadbuffer=multer({storage:productstorage})

module.exports=uploadbuffer;
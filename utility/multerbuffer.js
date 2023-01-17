// const multer=require('multer');
// const path=require('path');



// const productstorage = multer.memoryStorage()
// const uploadbuffer=multer({storage:productstorage})

// module.exports=uploadbuffer;










// const multer=require('multer');
// const path=require('path');

// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,path.join(__dirname,'../public/databaseimg'));
//     },
//     filename:(req,file,cb)=>{
//         const name=Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
   
// })

// const upload=multer({storage:storage})

// module.exports=upload;











const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const path=require('path');


const cloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "DEV",
    },
  });
  const upload = multer({ storage: cloudstorage});

module.exports=upload
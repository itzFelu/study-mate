// import {v2 as cloudinary} from 'cloudinary';
const cloudinary=require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'dohfzn1iw', 
  api_key: '398737747243348', 
  api_secret: 'bgzKswwNKEE_JPyBKZM0sR5f9o4' 
});
async function uploadFile(filepath){
  try {
    const result= await cloudinary.uploader.upload(filepath);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports={uploadFile};
// import {v2 as cloudinary} from 'cloudinary';
const cloudinary=require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'confidential', 
  api_key: 'confidential', 
  api_secret: 'confidential' 
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
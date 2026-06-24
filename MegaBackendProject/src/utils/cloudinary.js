////this code can be reused in other projects too

import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"; //node gives us this file system to manager files....link/unlink,etc


// const uploadoncloudinary=async (localFilePath)=>{
//     console.log("uploadoncloudinary called");

//     try{
//         if(!localFilePath) return null;

//         // Upload an image
//         const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})

//         console.log("File has been uploaded successfully on cloudinary.",response.url);
//         return response
//     }catch(error){
//         fs.unlinkSync(localFilePath)  //remove the locally saved file as the upload operation failed

//         if(fs.existsSync(localFilePath)){
//             fs.unlinkSync(localFilePath);
//         }

//         return null;
//     }
// }
const uploadoncloudinary = async(localFilePath)=>{
    console.log("cloudinary called");
 
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET, 
    });

    try{
        console.log("File path:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto"
        });

        // console.log("Upload successful");
        // console.log(response);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        console.log("CLOUDINARY ERROR:");
        console.log(error);
        
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadoncloudinary}

//(async function() {
//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET, 
//     });
    
//     // Upload an image
//      const uploadOnCloudinary = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();
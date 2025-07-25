import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        // console.log("file uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        // console.log(response)
        return response; 
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally saved temp file as upload fails
        return null;
    }
}

const deleteFromCloudinary = async(cloudFilePath) => {
    try {
        if(!cloudFilePath) return null;

        const parts = cloudFilePath.split("/")
        const fileNameWithExtension = parts[parts.length - 1]
        const publicId = fileNameWithExtension.split(".")[0];

        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log("failed to delete image from cloudinary", error)
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import ICloudinary from '../../useCases/interfaces/ICloudinaryInterface';
dotenv.config()
cloudinary.config({ 
    cloud_name: 'dbiw9o16u', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_SECRET_KEY
});
class Cloudinary implements ICloudinary{
    async uploadImage(image: any,folderName:string): Promise<string> {
        try {            
            const uploadResult = await cloudinary.uploader
            .upload(
                image,{
                folder: `${folderName}`,
                resource_type:'image'
                }
            )
            return uploadResult.secure_url
            
        } catch (error) {
            console.error("Error uploading image to cloudinary",error);
            throw error
            
        }
    }
    async uploaddocuments(documents: any,folderName:string): Promise<string> {
        try {            
            const uploadResult = await cloudinary.uploader
            .upload(
                documents,{
                folder: `${folderName}`,
                resource_type:'raw'
                }
            )
            return uploadResult.secure_url
            
        } catch (error) {
            console.error("Error uploading document to cloudinary",error);
            throw error
            
        }
    }

    async uploadMultipleimages(images:[],folderName:string){
        try {
            const uploadPromises = images.map(async (image) => {
                const uploadResult = await cloudinary.uploader.upload(image, {
                    folder: folderName,
                    resource_type: 'image'
                });
                return uploadResult.secure_url;
            });
    
            const uploadedUrls = await Promise.all(uploadPromises);
            return uploadedUrls;
        } catch (error) {
            console.error("Error uploading image to cloudinary",error);
            throw error
        }
    }
}

export default Cloudinary
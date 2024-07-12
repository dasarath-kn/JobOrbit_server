
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
            console.log(image);
            
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
}

export default Cloudinary
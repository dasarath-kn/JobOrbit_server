import { Schema,model } from "mongoose";
import company from "../../entities/company";
const company:Schema<company> =new Schema({
        companyname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
        },
        phonenumber:{
            type:Number,
        },
        industry:{
            type:String,
        },
        state:{
            type:String,
        },
        city:{
            type:String,
        },
        address:{
            type:String,
        },
        about:{
            type:String,
        },
        img_url:{
            type:String
        },
        is_google:{
            type:Boolean
        },
        is_blocked:{
            type:Boolean,
            default:false
        },
        website_url:{
            type:String,
        },
        is_verified:{
            type:Boolean,
            default:false
        },
        admin_verified:{
            type:Boolean,
            default:false
        },
        document_url:{
            type:String
        },
        percentage:{
            type:Number,
            default:25
        }
}) 

const companyModel = model<company>('company',company)
export default companyModel
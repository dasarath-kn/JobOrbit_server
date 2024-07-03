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
            required:true
        },
        phonenumber:{
            type:Number,
            required:true
        },
        industry:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        about:{
            type:String,
            required:true
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
        }
}) 

const companyModel = model<company>('company',company)
export default companyModel
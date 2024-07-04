
import {Schema,model} from "mongoose";
import user from "../../entities/user";

const userSchema:Schema<user> =new Schema({
        firstname:{
            type:String,
            required:true
        },
        lastname:{
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
        field:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        about:{
            type:String
        },
        img_url:{
            type:String
        },
        is_verified:{
            type:Boolean,
            default:false
        },
        is_blocked:{
            type:Boolean,
            default:false
        },
        is_admin:{
            type:Boolean,
            default:false
        },
        github_url:{
            type:String
        },
        portfolio_url:{
            type:String
        },
        resume_url:{
            type:String
        },
        skills:{
            type:[String]
        },
        qualification:{
            type:[String]
        },
        experience:{
            typeKey:[Object]
        }


})


const userModel = model<user>('user',userSchema)
export default userModel
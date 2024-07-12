
import {Schema,model} from "mongoose";
import user from "../../entities/user";

const userSchema:Schema<user> =new Schema({
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
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
        field:{
            type:String,
        },
        location:{
            type:String,
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
        is_google:{
            type:Boolean
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
            type:String
        },
        experience:{
            typeKey:[Object]
        }


})


const userModel = model<user>('user',userSchema)
export default userModel
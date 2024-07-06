import mongoose,{ Schema,model } from "mongoose";
import otp from "../../entities/otp";

const otpSchema:Schema<otp> =new Schema({
        email:{
            type:String,
            required:true
        },
        otp:{
            type:String,
            required:true
        }, createdAt: {
            type: Date,
            default: Date.now,
            expires: 180 
        }
})

const otpModel = model<otp>('otp',otpSchema)
export default otpModel
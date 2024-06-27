import mongoose,{ Schema,model } from "mongoose";
import otp from "../../entities/otp";

const otpSchema:Schema<otp> =new Schema({
        user_id:{
            type:String,
            required:true
        },
        otp:{
            type:String,
            required:true
        }
})

const otpModel = model<otp>('otp',otpSchema)
export default otpModel
import mongoose, {model, Schema } from "mongoose";
import { reviews } from "../../entities/user";

const reviewRatingSchema:Schema<reviews>=new Schema({
    rating_count:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'company'
    },
    time:{
        type: Date,
        default: Date.now
    }
})

const reviewandRatingModel =  model<reviews>("review",reviewRatingSchema)
export default reviewandRatingModel
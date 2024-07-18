import mongoose, { model, Schema } from "mongoose";
import { savedPost } from "../../entities/savedPost";

const savedPostModel:Schema<savedPost> =new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
    }
})

const postSavedModel = model<savedPost>('savedpost',savedPostModel)
export default postSavedModel
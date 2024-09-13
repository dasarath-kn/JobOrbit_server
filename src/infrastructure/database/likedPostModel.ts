import mongoose,{ model, Schema } from "mongoose";
import { liked } from "../../entities/posts";

const likedSchema:Schema<liked> = new Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
    
})
const likeModel =model<liked>('like',likedSchema)
export default likeModel
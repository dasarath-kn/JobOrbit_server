import mongoose, { model, Schema } from "mongoose";
import { Post } from "../../entities/posts";

const postSchema:Schema<Post> = new Schema({
    description:{
        type:String,
        required:true
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company'
    },
    images:[],
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    time:{
        type: Date,
        default: Date.now
    }
    

})

const postModel = model<Post>('post',postSchema)
export default postModel
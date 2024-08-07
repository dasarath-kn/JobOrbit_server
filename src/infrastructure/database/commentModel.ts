import mongoose, { model, Schema } from "mongoose";
import { comment } from "../../entities/comment";

const commentSchema:Schema<comment> = new Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company',
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    message:{
        type:String,
        required:true
    },
    reply:{
        type:String,
        
    },
    like:{
        type:Number,
        default:0
    },
    replied:{
        type:Boolean,
        default:false
    }
})

const commentModel =  model<comment>('comment',commentSchema)
export default commentModel
import mongoose, { model, Schema } from "mongoose";
import message from "../../entities/message";

const messageSchema:Schema<message> = new Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    message:{
        type:String,
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})

const messageModel =  model<message>("message",messageSchema)

export default messageModel
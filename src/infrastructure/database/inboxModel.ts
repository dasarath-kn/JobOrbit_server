import mongoose, { model, Schema } from "mongoose";
import { inbox } from "../../entities/message";

const inboxSchema:Schema<inbox> = new Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },message:{
        type:String,
    },
    time:{
        type:Date
    }
})

const inboxModel = model<inbox>('inbox',inboxSchema)
export default inboxModel
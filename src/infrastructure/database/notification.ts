import mongoose, { model, Schema } from "mongoose";
import Notification from "../../entities/notification";

const notificationSchema:Schema<Notification> = new Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
    
    },
    message:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const notificationModel =model<Notification>("notification",notificationSchema)
export default notificationModel
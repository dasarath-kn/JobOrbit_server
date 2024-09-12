import mongoose from "mongoose";

interface message {
    sender_id:mongoose.Schema.Types.ObjectId|string,
    reciever_id:mongoose.Schema.Types.ObjectId|string,
    message?:string,
    timeStamp?:Date
    url?:string,
    field:string
}
export interface inbox {
    sender_id:mongoose.Schema.Types.ObjectId,
    reciever_id:mongoose.Schema.Types.ObjectId,
    message:string,
    time:Date,
    role:string

}

export default message
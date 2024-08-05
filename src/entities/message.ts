import mongoose from "mongoose";

interface message {
    sender_id:mongoose.Schema.Types.ObjectId,
    reciever_id:mongoose.Schema.Types.ObjectId,
    message:string,
    timeStamp:Date
}

export default message
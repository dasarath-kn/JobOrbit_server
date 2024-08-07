import mongoose from "mongoose";

interface Notification{
    sender_id:mongoose.Schema.Types.ObjectId
    reciever_id:mongoose.Schema.Types.ObjectId,
    company_id:mongoose.Schema.Types.ObjectId,
    message:string,
    date:Date
}

export default Notification
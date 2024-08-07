import mongoose from "mongoose";

export interface comment {
    user_id:mongoose.Schema.Types.ObjectId|string,
    post_id:mongoose.Schema.Types.ObjectId|string,
    company_id:mongoose.Schema.Types.ObjectId|string,
    message:string,
    reply:string,
    like:number
    replied:boolean
}
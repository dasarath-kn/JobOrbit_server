import mongoose from "mongoose";

export interface savedPost{
    user_id:mongoose.Schema.Types.ObjectId|string,
    post_id:mongoose.Schema.Types.ObjectId|string
}
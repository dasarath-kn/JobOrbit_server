import mongoose from "mongoose";

export interface Post{
    description:string,
    company_id:mongoose.Types.ObjectId,
    like:mongoose.Types.ObjectId,
    images:string[],
    time: Date;

}
import mongoose from "mongoose";

export interface subscriptedUser {
   session_id:string,
   plan_id:mongoose.Types.ObjectId|string
    user_id:mongoose.Types.ObjectId|string,
    activation_date:Date,
    expiry_date:Date,
    payment_status:Boolean
}
export default subscriptedUser
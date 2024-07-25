import mongoose from "mongoose";

interface jobShedule{
   user_id:mongoose.Schema.Types.ObjectId,
   job_id:mongoose.Schema.Types.ObjectId,
   company_id:mongoose.Schema.Types.ObjectId
   date:Date,
   time:string,
   message:string,
   scheduled_time:Date
}
export default jobShedule
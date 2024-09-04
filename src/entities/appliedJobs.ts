import mongoose from "mongoose";

interface jobApplied {
    user_id:mongoose.Schema.Types.ObjectId,
    job_id:mongoose.Schema.Types.ObjectId,
    company_id:mongoose.Schema.Types.ObjectId,
    status:string
    applied_date:Date
}
export default jobApplied
 
import mongoose, { model, Schema } from "mongoose";
import jobApplied from "../../entities/appliedJobs";

const jobAppliedSchema:Schema<jobApplied> = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    job_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job"
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"company"
    },
    status:{
        type:String,
        default:"Applied"
    },

    applied_date:{
        type:Date,
        default:Date.now
    }
    
})

const appliedJobModel = model<jobApplied>('appliedjob',jobAppliedSchema)
export default appliedJobModel
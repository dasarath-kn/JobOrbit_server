import mongoose, { model, Schema } from "mongoose";
import jobShedule from "../../entities/jobScheduled";

const scheduledSchema:Schema<jobShedule> = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    job_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'job',
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    scheduled_time:{
        type:Date,
        required:true
    }
})

const JobScheduledModel = model<jobShedule>("scheduledjob",scheduledSchema)
export default JobScheduledModel
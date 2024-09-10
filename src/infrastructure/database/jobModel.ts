import { application } from "express";
import mongoose, {  model, Schema } from "mongoose";
import jobs from "../../entities/jobs";
import cron from 'node-cron';


const jobSchema:Schema<jobs> = new Schema({
    jobtitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },responsibilities:{
        type:String,
        required:true
    },
    requirements:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company'
    },
    applicants_id:[{
       user_id:{ type:mongoose.Schema.Types.ObjectId,
        ref:'user'},
        resume_url:{
            type:String
        }
    }],
    time:{
        type: Date,
        default: Date.now
    },
    list:{
        type:Boolean,
        default:true
    },
    closedate:{
        type:String,
        required:true
    },
    unlistTime:{
        type:Date,
        required:true
    }
})
const jobModel =model<jobs>('job',jobSchema)
export default jobModel


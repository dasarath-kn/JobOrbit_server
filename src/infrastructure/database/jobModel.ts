import { application } from "express";
import mongoose, {  model, Schema } from "mongoose";
import jobs from "../../entities/jobs";

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
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    time:{
        type: Date,
        default: Date.now
    }
})
const jobModel =model<jobs>('job',jobSchema)
export default jobModel
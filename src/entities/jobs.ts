import mongoose, { Date, ObjectId } from "mongoose";

interface jobs{
    jobtitle:string,
    description: string;
    responsibilities: string;
    requirements: string;
    qualification: string;
    type:string,
    location:string,
    skills:string,
    company_id:mongoose.Types.ObjectId;
    applicants_id:mongoose.Types.ObjectId[];
    time: Date;
    list:boolean
}
export default jobs
export interface jobApplied{
    job_id:mongoose.Types.ObjectId[];
    applicants_id:mongoose.Types.ObjectId[];
    company_id:mongoose.Types.ObjectId[];
    user_id:mongoose.Types.ObjectId[];
    status:string,
    applied_date:Date
    
}

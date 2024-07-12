import mongoose, { ObjectId } from "mongoose";

interface jobs{
    jobtitle:string,
    description: string;
    responsibilities: string;
    requirements: string;
    qualification: string;
    type:string,
    location:string
    company_id:mongoose.Types.ObjectId;
    applicants_id:mongoose.Types.ObjectId[];
    time: Date;
}
export default jobs
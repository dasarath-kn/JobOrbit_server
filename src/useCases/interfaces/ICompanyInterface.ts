import { comment } from "../../entities/comment";
import company from "../../entities/company";
import jobs from "../../entities/jobs";
import jobShedule from "../../entities/jobScheduled";
import message, { inbox } from "../../entities/message";
import { Post } from "../../entities/posts";
import { reviews } from "../../entities/user";
import { jobData, messages } from "./IUserInterface";
export interface data {
    review:reviews[]
    counts:number[]
}
interface ICompanyInterface {
    findCompanyByEmail(email: string): Promise<company | null>
    saveCompany(companyData: company): Promise<company | null>
    checkOtp(otp: string): Promise<string | null>
    verifyCompany(email: string): Promise<boolean>
    saveCompanydata(company: company): Promise<company | null>
    getCompanydata(id: string): Promise<company | null>
    resetPassword(company: company): Promise<boolean | null>
    saveJobs(jobData: jobs): Promise<boolean | null>
    getJobs(id: string,page:string): Promise<jobData | null>
    removeJob(id: string): Promise<boolean>
    savePosts(postData: Post): Promise<boolean>
    getPosts(id: string): Promise<Post[] | null>
    updateProfile(id: string, company: company): Promise<boolean | null>
    uploadDocument(id: string, document_url: string): Promise<boolean>
    deletePost(post_id: string): Promise<boolean>
    jobApplications(id: string): Promise<jobs[] | null>
    saveScheduledJobs(jobScheduleddata: jobShedule): Promise<boolean>
    getScheduledJobs(job_id: string): Promise<jobShedule[] | null>
    findScheduledJobs(id:string): Promise<jobShedule[] | null>
    getReviews(id:string):Promise<data |null>
    saveMessages(messageData:message):Promise<boolean>
    getMessages(reciever_id:string,sender_id:string):Promise<messages | null>
    getcomment(id: string): Promise<comment[] | null>
    replycomment(comment_id:string,reply:string):Promise<boolean>
    deleteApplicant(job_id:string,user_id:string):Promise<boolean>
    findInbox(reciever_id:string):Promise<inbox[]|inbox|null>
    listJob(job_id:string,status:string):Promise<string>
}

export default ICompanyInterface
import { comment } from "../../entities/comment";
import company from "../../entities/company";
import jobs from "../../entities/jobs";
import message, { inbox } from "../../entities/message";
import Notification from "../../entities/notification";
import postreport from "../../entities/postreport";
import { Post } from "../../entities/posts";
import { savedPost } from "../../entities/savedPost";
import subscriptedUser from "../../entities/subscribedUser";
import subscriptions from "../../entities/subscriptions";
import user, { experienceData, reviews } from "../../entities/user";
export interface data {
    review:reviews
    counts:[]
}
export interface messages {
    sender:message,
    reciever:message

}
export interface jobData {
    count: number;
    jobs: jobs[];
}
interface IUserInterface {
    findUserById(id: string): Promise<user | null>
    findUserByEmail(email: string): Promise<user | null>
    saveUser(user: user): Promise<user | null>
    verifyUser(email: string): Promise<boolean>
    saveOtp(Email: string, otp: string): Promise<boolean>
    checkOtp(otp: string): Promise<string | null>
    getUserdata(user_id: string): Promise<user | null>
    saveUserdata(user: user): Promise<user | null>
    resetPassword(user: user): Promise<boolean | null>
    updateProfile(id: string, user: user, percentage: number): Promise<boolean | null>
    updateSkill(skill: [], id: string, percentage: number): Promise<boolean>
    updateResume(id: string, resume_url: string, percentage: number): Promise<boolean>
    viewjobs(page:string,type:string,location:string,date:string): Promise<jobData | null>
    getPosts(): Promise<Post[] | null>
    likePost(post_id: string, user_id: string): Promise<boolean | null>
    unlikePost(post_id: string, user_id: string): Promise<boolean | null>
    savePost(postData: savedPost,message:string): Promise<boolean>
    getSavedpost(id: string): Promise<savedPost[] | null>
    postcomment(commentData: comment): Promise<boolean>
    getcomment(id: string): Promise<comment[] | null>
    findJobdetails(id: string): Promise<jobs | null>
    addExperience(experienceData: experienceData, percentage: number, id: string): Promise<boolean>
    applyJob(job_id: string, user_id: string,company_id:string): Promise<boolean>
    getsubscriptionplan(): Promise<subscriptions[] | null>
    findPlanbyId(id: string): Promise<subscriptions | null>
    savesubscribedUsers(subscribedData: subscriptedUser): Promise<boolean>
    updatesubscribedUsers(id: string, status: string): Promise<boolean>
    findSubscribedUserById(id: string): Promise<subscriptedUser | null>
    savePostReport(post_id:string,postreportData: postreport): Promise<Boolean>
    findAppliedJobs(user_id: string): Promise<jobs[] | null>
    getUserdatas(): Promise<user[] | null>
    getCompanydatas(): Promise<company[] | null>
    findCompanyById(id: string): Promise<company | null>
    saveReviews(reviewData: reviews): Promise<boolean>
    getReviews(id:string):Promise<data |null>
    connectUser(id:string,connection_id:string):Promise<boolean>
    connectCompany(user_id:string,company_id:string):Promise<boolean>
    saveMessages(messageData:message):Promise<boolean>
    getMessages(reciever_id:string,sender_id:string):Promise<messages | null>
    saveNotification(sender_id:string,reciever_id:string,message:string):Promise<boolean>
    findNotification(sender_id:string,reciever_id:string):Promise<Notification[]|null>
    findConnectionRequest(reciever_id:string):Promise<Notification[]|null>
    manageConnection(user_id:string,connection_id:string,notification_id:string,message:string):Promise<boolean>
    saveInbox(sender_id:string,reciever_id:string):Promise<boolean>
    findInbox(sender_id:string):Promise<inbox[]|inbox|null>
    updateInbox(sender_id:string,reciever_id:string,message:string):Promise<boolean>

}


export default IUserInterface
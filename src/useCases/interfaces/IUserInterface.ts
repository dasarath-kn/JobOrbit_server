import { comment } from "../../entities/comment";
import jobs from "../../entities/jobs";
import { Post } from "../../entities/posts";
import { savedPost } from "../../entities/savedPost";
import subscriptedUser from "../../entities/subscribedUser";
import subscriptions from "../../entities/subscriptions";
import user, { experienceData } from "../../entities/user";
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
    updateProfile(id: string, user: user): Promise<boolean | null>
    updateSkill(skill:[],id:string,percentage:number):Promise<boolean>
    viewjobs(): Promise<jobs[] | null>
    getPosts(): Promise<Post[] | null>
    likePost(post_id: string, user_id: string): Promise<boolean | null>
    unlikePost(post_id: string, user_id: string): Promise<boolean | null>
    savePost(postData: savedPost): Promise<boolean>
    getSavedpost(id: string): Promise<savedPost[] | null>
    postcomment(commentData: comment): Promise<boolean>
    getcomment(id: string): Promise<comment[] | null>
    findJobdetails(id: string): Promise<jobs | null>
    addExperience(experienceData: experienceData, id: string): Promise<boolean>
    applyJob(job_id: string, user_id: string): Promise<boolean>
    getsubscriptionplan(): Promise<subscriptions[] | null>
    findPlanbyId(id: string): Promise<subscriptions | null>
    savesubscribedUsers(subscribedData:subscriptedUser):Promise<boolean>
    updatesubscribedUsers(id:string,status:string):Promise<boolean>
    findSubscribedUserById(id:string):Promise<subscriptedUser|null>
}


export default IUserInterface
import jobs from "../../entities/jobs";
import { Post } from "../../entities/posts";
import user from "../../entities/user";
interface IUserInterface {
    findUserByEmail(email: string): Promise<user | null>
    saveUser(user: user): Promise<user | null>
    verifyUser(email: string): Promise<boolean>
    saveOtp(Email: string, otp: string): Promise<boolean>
    checkOtp(otp: string): Promise<string | null>
    getUserdata(user_id: string): Promise<user | null>
    saveUserdata(user: user): Promise<user | null>
    resetPassword(user: user): Promise<boolean | null>
    updateProfile(id: string, user: user): Promise<boolean | null>
    viewjobs(): Promise<jobs[] | null>
    getPosts(): Promise<Post[] | null>
    likePost(post_id: string, user_id: string): Promise<boolean | null>
    unlikePost(post_id: string, user_id: string): Promise<boolean | null>
}


export default IUserInterface
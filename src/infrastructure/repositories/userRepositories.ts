import { comment } from "../../entities/comment";
import company from "../../entities/company";
import jobs from "../../entities/jobs";
import otp from "../../entities/otp";
import postreport from "../../entities/postreport";
import { Post } from "../../entities/posts";
import { savedPost } from "../../entities/savedPost";
import subscriptedUser from "../../entities/subscribedUser";
import subscriptions from "../../entities/subscriptions";
import user, { experienceData, reviews } from "../../entities/user";
import { UserDataResult } from "../../useCases/interfaces/IAdminInterface";
import IUserInterface, { data } from '../../useCases/interfaces/IUserInterface'
import commentModel from "../database/commentModel";
import companyModel from "../database/companyModel";
import jobModel from "../database/jobModel";
import otpModel from "../database/otpModel";
import postModel from "../database/postModel";
import postReportModel from "../database/postReportModel";
import reviewandRatingModel from "../database/reviewRatingModel";
import postSavedModel from "../database/savedPostModel";
import subscribedModel from "../database/subscribedUsersModel";
import subscriptionModel from "../database/subscription";
import userModel from "../database/userModel";
import { ObjectId } from 'mongodb';

class userRepository implements IUserInterface {




    async findUserById(id: string): Promise<user | null> {
        try {
            let userData = await userModel.findOne({ _id: id }).populate('plan_id')
            return userData ? userData : null

        } catch (error) {
            console.error(error);
            throw new Error("unable to find userdata");

        }
    }

    async findUserByEmail(email: string): Promise<user | null> {
        try {
            let userData = await userModel.findOne({ email: email })
            return userData ? userData.toObject() : null
        } catch (error: any) {
            console.error(error);
            throw new Error("unable to find userdata");

        }
    }
    async saveUser(user: user): Promise<user | null> {
        try {
            const newUser = new userModel(user)
            await newUser.save()
            return newUser ? newUser : null

        } catch (error: any) {
            console.error(error);
            throw new Error("unable to save newuser");

        }
    }

    async verifyUser(email: string): Promise<boolean> {
        try {

            const verifiedUser = await userModel.updateOne({ email: email }, { $set: { is_verified: true } })
            console.log(verifiedUser);

            return verifiedUser.acknowledged

        }
        catch (error: any) {
            console.error(error);
            throw new Error("Unable to verifyuser")

        }
    }
    async saveOtp(email: string | undefined, otp: string): Promise<boolean> {
        try {

            const saveOtp = await otpModel.updateOne({ email: email }, { $set: { otp: otp } }, { upsert: true })

            return saveOtp.acknowledged
        } catch (error: any) {
            console.error(error);
            throw new Error("Unable to saveotp")

        }
    }


    async checkOtp(otp: string): Promise<string | null> {
        try {
            let checkedOtp = await otpModel.findOne({ otp: otp })
            return checkedOtp ? checkedOtp.email : null
        } catch (error: any) {
            console.error(error);
            throw new Error("Unable to find the otp")

        }
    }

    async getUserdata(user_id: string): Promise<user | null> {
        try {
            let userdata = await userModel.findOne({ _id: user_id })
            return userdata ? userdata : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdata")

        }
    }


    async saveUserdata(userdata: user): Promise<user | null> {
        try {
            let finduser = await userModel.findOne({ email: userdata.email })
            if (finduser) {
                return finduser
            } else {
                let saveUser = new userModel(userdata)
                await saveUser.save()
                if (saveUser) {
                    let data = await userModel.findOne({ email: userdata.email })
                    return data
                } else {
                    return null
                }
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to save userdata")

        }
    }
    async resetPassword(user: user): Promise<boolean | null> {
        try {
            let { email, password } = user
            let reset = await userModel.updateOne({ email: email }, { $set: { password: password } })
            if (reset) {
                return reset.acknowledged
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to reset password")

        }
    }
    async updateProfile(id: string, user: user, percentage: number): Promise<boolean> {
        try {
            if (percentage == 15) {
                let updated = await userModel.updateOne({ _id: id }, user, { new: true })
                let percentageupdate = await userModel.updateOne({ _id: id }, { $inc: { percentage: percentage } })
                return updated.acknowledged
            }
            else {
                let updated = await userModel.updateOne({ _id: id }, user, { new: true })
                let percentageupdate = await userModel.updateOne({ _id: id }, { $set: { percentage: percentage } })

                return updated.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update userdata")
        }
    }
    async viewjobs(): Promise<jobs[] | null> {
        try {
            let jobs = await jobModel.find({}).populate('company_id')
            return jobs ? jobs : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update userdata")
        }
    }

    async getPosts(): Promise<Post[] | null> {
        try {
            let posts = await postModel.find({}).sort({ time: -1 }).populate('company_id')
            return posts ? posts : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to get posts")
        }
    }
    async likePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            let liked = await postModel.updateOne({ _id: post_id }, { $addToSet: { like: user_id } })
            return liked.acknowledged ? liked.acknowledged : null

        } catch (error) {
            console.error(error);
            throw new Error(`Unable to like post`)
        }
    }
    async unlikePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            let unLiked = await postModel.updateOne({ _id: post_id }, { $pull: { like: user_id } })
            return unLiked.acknowledged ? unLiked.acknowledged : null
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to unlike post`)
        }
    }
    async savePost(postData: savedPost): Promise<boolean> {
        try {
            let saved = new postSavedModel(postData)
            await saved.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to save post`)
        }
    }
    async getSavedpost(id: string): Promise<savedPost[] | null> {
        try {
            let savedPost = await postSavedModel.find({ user_id: id })
            return savedPost ? savedPost : null

        } catch (error) {
            console.error(error);
            throw new Error(`Unable to get savedpost`)
        }
    }
    async postcomment(commentData: comment): Promise<boolean> {
        try {
            const postcomment = new commentModel(commentData)
            await postcomment.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to post comment`)
        }

    }
    async getcomment(id: string): Promise<comment[] | null> {
        try {
            const comments = await commentModel.find({ post_id: id }).populate('user_id')
            return comments ? comments : null
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to find comments`)
        }
    }
    async findJobdetails(id: string): Promise<jobs | null> {
        try {
            let jobs = await jobModel.findOne({ _id: id }).populate('company_id')
            return jobs ? jobs : null

        } catch (error) {
            console.error(error);
            throw new Error('Unable to find job')
        }
    }
    async addExperience(experienceData: experienceData, percentage: number, id: string): Promise<boolean> {
        try {
            if (percentage === 15) {
                let experience = await userModel.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $inc: { percentage: percentage } })
                return experience.acknowledged
            } else {
                let experience = await userModel.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $set: { percentage: percentage } })
                return experience.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error('Unable to save user experience')
        }
    }
    async updateResume(id: string, resume_url: string, percentage: number): Promise<boolean> {
        try {
            if (percentage === 15) {
                let update = await userModel.updateOne({ _id: id }, { $set: { resume_url: resume_url }, $inc: { percentage: percentage } })
                return update.acknowledged
            } else {
                let update = await userModel.updateOne({ _id: id }, { $set: { resume_url: resume_url, percentage: percentage } })
                return update.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error('Unable to update user resume')
        }
    }
    async applyJob(job_id: string, user_id: string): Promise<boolean> {
        try {
            let job = await jobModel.updateOne({ _id: job_id }, { $addToSet: { applicants_id: user_id } })
            let jobCount = await userModel.updateOne({ _id: user_id }, { $inc: { jobapplied_Count: 1 } })
            return job.acknowledged
        } catch (error) {
            console.error(error);
            throw new Error('Unable to apply user for job')
        }
    }
    async getsubscriptionplan(): Promise<subscriptions[] | null> {
        try {
            let plans = await subscriptionModel.find({ unlist: false })
            return plans ? plans : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to get subscriptiondetails")
        }
    }
    async findPlanbyId(id: string): Promise<subscriptions | null> {
        try {
            let subscriptionData = await subscriptionModel.findOne({ _id: id })
            return subscriptionData ? subscriptionData : null


        } catch (error) {
            console.error(error);
            throw new Error("Unable to get subscriptiondetails")
        }
    }
    async savesubscribedUsers(subscribedData: subscriptedUser): Promise<boolean> {
        try {
            let saved = new subscribedModel(subscribedData)
            await saved.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save subscribed users")
        }
    }
    async updatesubscribedUsers(id: string, status: string): Promise<boolean> {
        try {
            if (status == 'success') {
                let updated = await subscribedModel.updateOne({ session_id: id }, { $set: { payment_status: true } })
                let plan = await subscribedModel.findOne({ session_id: id })
                const subscriptionPlan = await subscriptionModel.findOne({ _id: plan?.plan_id })
                const userUpdate = await userModel.updateOne({ _id: plan?.user_id }, { $set: { plan_id: subscriptionPlan?._id } })
                return updated.acknowledged
            } else {
                let updated = await subscribedModel.updateOne({ session_id: id }, { $set: { payment_status: false } })
                return updated.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update subscribed users")
        }
    }
    async findSubscribedUserById(id: string): Promise<subscriptedUser | null> {
        try {
            let user = await subscribedModel.findOne({ user_id: id }).populate('user_id').populate('plan_id')

            return user ? user : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find subscribed user")
        }
    }
    async updateSkill(skill: string[], id: string, percentage: number): Promise<boolean> {
        try {
            let updateResult;
            if (percentage === 15) {
                updateResult = await userModel.updateOne(
                    { _id: id },
                    { $addToSet: { skills: { $each: skill } }, $inc: { percentage: percentage } }
                );
            } else {
                updateResult = await userModel.updateOne(
                    { _id: id },
                    { $addToSet: { skills: { $each: skill } }, $set: { percentage: percentage } }
                );
            }
            return updateResult.acknowledged;
        } catch (error) {
            console.error(error);
            throw new Error("Unable to update user skill");
        }
    }
    async savePostReport(post_id:string,postreportData: postreport): Promise<Boolean> {
        try {
            const report= await postReportModel.findOne({post_id:post_id})
            if(!report){
                const data ={post_id:post_id,user_datas:postreportData}
                let saved = new postReportModel(data)
                await saved.save()
                return true

            }else{
               const update = await postReportModel.updateOne({post_id:post_id},{$addToSet:{user_datas:postreportData}}) 
                return update.acknowledged
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save postreport");
        }
    }

    async findAppliedJobs(user_id: string): Promise<jobs[] | null> {
        try {

            let data = await jobModel.find({ applicants_id: { $in: user_id } }).populate("company_id")

            return data ? data : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find applied jobs");
        }
    }
    async getUserdatas(): Promise<user[] | null> {
        try {



            let userData: user[] = await userModel.find({
                is_blocked: false, is_verified: true, is_admin: false
            })
            return userData ? userData : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdatas")

        }
    }
    async getCompanydatas(): Promise<company[] | null> {
        try {

            let companyData = await companyModel.find({
                is_verified: true, admin_verified: true, is_blocked: false
            })

            return companyData ? companyData : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find companydatas")

        }

    }
    async findCompanyById(id: string): Promise<company | null> {
        try {
            let company = await companyModel.findOne({ _id: id })
            return company ? company : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find companydatas")

        }
    }
    async saveReviews(reviewData: reviews): Promise<boolean> {
        try {
            let reviewdata = new reviewandRatingModel(reviewData)
            await reviewdata.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save Reviews")

        }
    }
    async getReviews(id:string): Promise<data | null> {
        try {
            const objectId = new ObjectId(id);
            const reviewdata = await reviewandRatingModel.find({company_id:id}).populate('user_id')  
            const count =[]   
            for(let i=5;i>=1;i--){
            const averageStar = await reviewandRatingModel.aggregate([{$match:{company_id:objectId,rating_count:i}},{$group:{_id:null,average:{$avg:"$rating_count"}}}])
            
            if(averageStar.length==0){
                count.push(0)

            }else{
                count.push(averageStar[0].average)

            }   
        }
            const data ={
                review:reviewdata,counts:count
            }
            
            return data ? data : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to get Reviews")

        }

    }

}


export default userRepository
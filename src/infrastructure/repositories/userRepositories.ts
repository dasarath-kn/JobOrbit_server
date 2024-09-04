import jobApplied from "../../entities/appliedJobs";
import { comment } from "../../entities/comment";
import company from "../../entities/company";
import jobs from "../../entities/jobs";
import message, { inbox } from "../../entities/message";
import Notification from "../../entities/notification";
import otp from "../../entities/otp";
import postreport from "../../entities/postreport";
import { Post } from "../../entities/posts";
import { savedPost } from "../../entities/savedPost";
import subscriptedUser from "../../entities/subscribedUser";
import subscriptions from "../../entities/subscriptions";
import user, { experienceData, reviews } from "../../entities/user";
import { UserDataResult } from "../../useCases/interfaces/IAdminInterface";
import IUserInterface, { data, jobAppliedData, jobData, messages } from '../../useCases/interfaces/IUserInterface'
import commentModel from "../database/commentModel";
import companyModel from "../database/companyModel";
import inboxModel from "../database/inboxModel";
import appliedJobModel from "../database/jobApplied";
import appliedJobModels from "../database/jobApplied";
import jobModel from "../database/jobModel";
import messageModel from "../database/messageModel";
import notificationModel from "../database/notification";
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
            const userData = await userModel.findOne({ _id: id }).populate('plan_id')
            return userData ? userData : null

        } catch (error) {
            console.error(error);
            throw new Error("unable to find userdata");

        }
    }

    async findUserByEmail(email: string): Promise<user | null> {
        try {
            const userData = await userModel.findOne({ email: email })
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
            const checkedOtp = await otpModel.findOne({ otp: otp })
            return checkedOtp ? checkedOtp.email : null
        } catch (error: any) {
            console.error(error);
            throw new Error("Unable to find the otp")

        }
    }

    async getUserdata(user_id: string): Promise<user | null> {
        try {
            const userdata = await userModel.findOne({ _id: user_id }).populate("connections.connection_id").populate("companies.company_id")
            return userdata ? userdata : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdata")

        }
    }


    async saveUserdata(userdata: user): Promise<user | null> {
        try {
            const finduser = await userModel.findOne({ email: userdata.email })
            if (finduser) {
                return finduser
            } else {
                const saveUser = new userModel(userdata)
                await saveUser.save()
                if (saveUser) {
                    const data = await userModel.findOne({ email: userdata.email })
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
            const { email, password } = user
            const reset = await userModel.updateOne({ email: email }, { $set: { password: password } })
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
                const updated = await userModel.updateOne({ _id: id }, user, { new: true })
                const percentageupdate = await userModel.updateOne({ _id: id }, { $inc: { percentage: percentage } })
                return updated.acknowledged
            }
            else {
                const updated = await userModel.updateOne({ _id: id }, user, { new: true })
                const percentageupdate = await userModel.updateOne({ _id: id }, { $set: { percentage: percentage } })

                return updated.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update userdata")
        }
    }
    async viewjobs(page: string, type: string, location: string, date: string, user_id: string): Promise<jobData | null> {
        try {
            const pages = Number(page) * 8;
            const filter: any = {};
            if (type) {
                filter.type = type;
            }
            if (location) {
                filter.location = location;
            }
            if (date) {
                const now = new Date();
                let dateFilter: any;
                if (date === 'last-week') {
                    dateFilter = new Date(now.setDate(now.getDate() - 7));
                } else if (date === 'last-month') {
                    dateFilter = new Date(now.setMonth(now.getMonth() - 1));
                }
                filter.time = { $gte: dateFilter };
            }
            filter["applicants_id.user_id"] = { $nin: [user_id] };
            filter.list = true;
            const jobCount = await jobModel.find(filter).countDocuments();
            const jobs = await jobModel.find(filter)
                .sort({ time: -1 })
                .skip(pages)
                .limit(8)
                .populate('company_id');

            if (jobs.length === 0) {
                return null;
            }

            return {
                count: Math.ceil(jobCount / 8),
                jobs
            };

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find jobs");
        }
    }


    async getPosts(): Promise<Post[] | null> {
        try {
            const posts = await postModel.find({}).sort({ time: -1 }).populate('company_id').populate('like')
            return posts ? posts : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to get posts")
        }
    }
    async likePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            const liked = await postModel.updateOne({ _id: post_id }, { $addToSet: { like: user_id } })
            return liked.acknowledged ? liked.acknowledged : null

        } catch (error) {
            console.error(error);
            throw new Error(`Unable to like post`)
        }
    }
    async unlikePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            const unLiked = await postModel.updateOne({ _id: post_id }, { $pull: { like: user_id } })
            return unLiked.acknowledged ? unLiked.acknowledged : null
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to unlike post`)
        }
    }
    async savePost(postData: savedPost, message: string): Promise<boolean> {
        try {
            if (message == "saved") {
                const saved = new postSavedModel(postData)
                await saved.save()
                return true

            } else {
                const { post_id } = postData
                const remove = await postSavedModel.deleteOne({ post_id: post_id })
                return remove.acknowledged
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to save post`)
        }
    }
    async getSavedpost(id: string): Promise<savedPost[] | null> {
        try {
            const savedPost = await postSavedModel.find({ user_id: id }).populate('post_id').populate('company_id')
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
            const comments = await commentModel.find({ post_id: id }).populate('user_id').populate('company_id')
            return comments ? comments : null
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to find comments`)
        }
    }
    async findJobdetails(id: string): Promise<jobs | null> {
        try {
            const jobs = await jobModel.findOne({ _id: id }).populate('company_id')
            return jobs ? jobs : null

        } catch (error) {
            console.error(error);
            throw new Error('Unable to find job')
        }
    }
    async addExperience(experienceData: experienceData, percentage: number, id: string): Promise<boolean> {
        try {
            if (percentage === 15) {
                const experience = await userModel.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $inc: { percentage: percentage } })
                return experience.acknowledged
            } else {
                const experience = await userModel.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $set: { percentage: percentage } })
                return experience.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error('Unable to save user experience')
        }
    }
    async updateResume(id: string, resumeurl: string, percentage: number): Promise<boolean> {
        try {
            const resumeUrlsArray = Array.isArray(resumeurl) ? resumeurl : [resumeurl];

            if (percentage === 15) {
                const update = await userModel.updateOne(
                    { _id: id },
                    {
                        $addToSet: { resume_url: { $each:resumeUrlsArray } },
                        $inc: { percentage: percentage }
                    }
                );
                return update.acknowledged
            } else {
                // const update = await userModel.updateOne({ _id: id }, { $set: { resume_url: resume_url, percentage: percentage } })
                const update = await userModel.updateOne(
                    { _id: id },
                    {
                        $addToSet: { resume_url: { $each: resumeUrlsArray } },
                        $set: { percentage: percentage }
                    }
                );

                return update.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error('Unable to update user resume')
        }
    }
    async applyJob(job_id: string, user_id: string, company_id: string, resume_url: string): Promise<boolean> {
        try {
            const data = { job_id: job_id, user_id: user_id, company_id: company_id }
            const jobData = { user_id: user_id, resume_url: resume_url }
            const job = await jobModel.updateOne({ _id: job_id }, { $addToSet: { applicants_id: jobData } })
            const jobCount = await userModel.updateOne({ _id: user_id }, { $inc: { jobapplied_Count: 1 } })
            const saveApplied = new appliedJobModel(data)
            await saveApplied.save()
            return job.acknowledged
        } catch (error) {
            console.error(error);
            throw new Error('Unable to apply user for job')
        }
    }
    async getsubscriptionplan(): Promise<subscriptions[] | null> {
        try {
            const plans = await subscriptionModel.find({ unlist: false })
            return plans ? plans : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to get subscriptiondetails")
        }
    }
    async findPlanbyId(id: string): Promise<subscriptions | null> {
        try {
            const subscriptionData = await subscriptionModel.findOne({ _id: id })
            return subscriptionData ? subscriptionData : null


        } catch (error) {
            console.error(error);
            throw new Error("Unable to get subscriptiondetails")
        }
    }
    async savesubscribedUsers(subscribedData: subscriptedUser): Promise<boolean> {
        try {
            const saved = new subscribedModel(subscribedData)
            await saved.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save subscribed users")
        }
    }
    async updatesubscribedUsers(id: string, status: string): Promise<boolean> {
        try {
            if (status === 'success') {

                const updated = await subscribedModel.updateOne({ session_id: id }, { $set: { payment_status: true } })
                const plan = await subscribedModel.findOne({ session_id: id })
                const subscriptionPlan = await subscriptionModel.findOne({ _id: plan?.plan_id })
                const userUpdate = await userModel.updateOne({ _id: plan?.user_id }, { $set: { plan_id: subscriptionPlan?._id } })
                return updated.acknowledged
            } else {
                const updated = await subscribedModel.deleteOne({ session_id: id })
                return updated.acknowledged
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update subscribed users")
        }
    }
    async findSubscribedUserById(id: string): Promise<subscriptedUser | null> {
        try {
            const user = await subscribedModel.findOne({ user_id: id, payment_status: true }).populate('user_id').populate('plan_id')

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
    async savePostReport(post_id: string, postreportData: postreport): Promise<Boolean> {
        try {
            const report = await postReportModel.findOne({ post_id: post_id })
            if (!report) {
                const data = { post_id: post_id, user_datas: postreportData }
                const saved = new postReportModel(data)
                await saved.save()
                return true

            } else {
                const update = await postReportModel.updateOne({ post_id: post_id }, { $addToSet: { user_datas: postreportData } })
                return update.acknowledged
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save postreport");
        }
    }

    async findAppliedJobs(user_id: string, page: string): Promise<jobAppliedData | null> {
        try {
            const pages = Number(page) * 8
            const jobCount = await appliedJobModel.find().countDocuments()
            const jobs = await appliedJobModel.find({ user_id: user_id }).skip(pages).limit(8).populate("job_id").populate('company_id').populate("job_id.company_id")

            if (jobs.length === 0) {
                return null;
            }

            return {
                count: Math.ceil(jobCount / 8),
                jobs
            };
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find applied jobs");
        }
    }
    async getUserdatas(): Promise<user[] | null> {
        try {



            const userData: user[] = await userModel.find({
                is_blocked: false, is_admin: false
            })
            return userData ? userData : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdatas")

        }
    }
    async getCompanydatas(): Promise<company[] | null> {
        try {

            const companyData = await companyModel.find({
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
            const company = await companyModel.findOne({ _id: id })
            return company ? company : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find companydatas")

        }
    }
    async saveReviews(reviewData: reviews): Promise<boolean> {
        try {
            const reviewdata = new reviewandRatingModel(reviewData)
            await reviewdata.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save Reviews")

        }
    }
    async getReviews(id: string): Promise<data | null> {
        try {
            const objectId = new ObjectId(id);
            const reviewdata = await reviewandRatingModel.find({ company_id: id }).populate('user_id')
            const count: number[] = []
            for (let i = 5; i >= 1; i--) {
                const averageStar = await reviewandRatingModel.aggregate([{ $match: { company_id: objectId, rating_count: i } }, { $group: { _id: null, average: { $avg: "$rating_count" } } }])

                if (averageStar.length == 0) {
                    count.push(0)

                } else {
                    count.push(averageStar[0].average)

                }
            }
            const datas: data = {
                review: reviewdata, counts: count
            }

            return datas ? datas : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to get Reviews")

        }

    }
    async connectUser(id: string, connection_id: string): Promise<boolean> {
        try {

            const connect = { connection_id }
            const user = { connection_id: id }
            const updaterUser = await userModel.updateOne({ _id: id }, { $addToSet: { connections: connect } })
            const updateConnection = await userModel.updateOne({ _id: connection_id }, { $addToSet: { connections: user } })
            if (updaterUser && updateConnection) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to connect user")

        }
    }

    async saveMessages(messageData: message): Promise<boolean> {
        try {
            const saveMessages = new messageModel(messageData)
            await saveMessages.save()
            return true
        } catch (error) {
            console.error(error);
            throw new Error("Unable to save message")
        }
    }
    async getMessages(reciever_id: string, sender_id: string): Promise<messages | null> {
        try {
            const sender = await messageModel.find({ reciever_id: reciever_id, sender_id: sender_id })
            const reciever = await messageModel.find({ reciever_id: sender_id, sender_id: reciever_id })
                ;

            const messages: messages = {
                sender: sender,
                reciever: reciever
            }

            return messages ? messages : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to get message")
        }
    }

    async connectCompany(user_id: string, company_id: string): Promise<boolean> {
        try {
            console.log("id", user_id);
            console.log("connection", company_id);
            const connect = { company_id }
            const user = { user_id: user_id }
            const updaterUser = await userModel.updateOne({ _id: user_id }, { $addToSet: { companies: connect } })
            const updateConnection = await companyModel.updateOne({ _id: company_id }, { $addToSet: { users: user } })
            if (updaterUser && updateConnection) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to connect company")

        }
    }

    async saveNotification(sender_id: string, reciever_id: string, message: string): Promise<boolean> {
        try {
            const data = { sender_id, reciever_id, message }
            const notification = new notificationModel(data)
            await notification.save()
            return true

        } catch (error) {
            console.error(error);
            throw new Error("Unable to save notification")

        }
    }
    async findNotification(sender_id: string, reciever_id: string): Promise<Notification[] | null> {
        try {
            const notification = await notificationModel.find({ sender_id: sender_id, reciever_id: reciever_id }).populate('sender_id')
            return notification ? notification : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find notification")
        }
    }
    async findConnectionRequest(reciever_id: string): Promise<Notification[] | null> {
        try {
            const connections = await notificationModel.find({ reciever_id: reciever_id }).sort({ date: -1 }).populate("sender_id")
            return connections ? connections : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find connection")
        }
    }
    async manageConnection(user_id: string, connection_id: string, notification_id: string, message: string): Promise<boolean> {
        try {
            if (message == "accept") {
                const users = await userModel.updateOne({ _id: user_id, 'connections.connection_id': connection_id },
                    { $set: { 'connections.$.status': true } })
                const connection = await userModel.updateOne({ _id: connection_id, 'connections.connection_id': user_id },
                    { $set: { 'connections.$.status': true } })
                const notification = await notificationModel.deleteOne({ _id: notification_id })
                return true
            } else {
                const users = await userModel.updateOne(
                    { _id: user_id },
                    { $pull: { connections: { connection_id: connection_id } } }
                );
                const connection = await userModel.updateOne(
                    { _id: connection_id },
                    { $pull: { connections: { connection_id: user_id } } }
                );
                const notification = await notificationModel.deleteOne({ _id: notification_id })
                return true
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to update connection")
        }
    }
    async saveInbox(sender_id: string, reciever_id: string, role: string): Promise<boolean> {
        try {
            const data1 = { sender_id: sender_id, reciever_id: reciever_id, role: role }
            const data2 = { sender_id: reciever_id, reciever_id: sender_id, role: role }

            const exist = await inboxModel.findOne({ sender_id: sender_id, reciever_id: reciever_id })
            if (!exist) {
                const inbox = new inboxModel(data1)
                await inbox.save()
                const inboxsave = new inboxModel(data2)
                await inboxsave.save()
                return true
            } else {
                return false
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to save ")
        }
    }
    async findInbox(sender_id: string, role: string): Promise<inbox[] | inbox | null> {
        try {
            const inbox = await inboxModel.find({
                sender_id: sender_id, role: role
            })

                .sort({ time: -1 })
                .populate('reciever_id');
            return inbox ? inbox : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find inboxData ")
        }
    }
    async updateInbox(sender_id: string, reciever_id: string, message: string): Promise<boolean> {
        try {
            const senderUpdate = await inboxModel.updateOne({ sender_id: sender_id, reciever_id: reciever_id }, { message: message, time: Date.now() })
            const recieverUpdate = await inboxModel.updateOne({ sender_id: reciever_id, reciever_id: sender_id }, { message: message, time: Date.now() })
            if (senderUpdate && recieverUpdate) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find inboxData ")
        }
    }
    async updateOnlineStatus(user_id: string, status: boolean): Promise<boolean> {
        try {
            const onlineStatus = await userModel.updateOne({ _id: user_id }, { $set: { online: status } })
            return onlineStatus.acknowledged
        } catch (error) {
            console.error(error);
            throw new Error("Unable to update user online status ")
        }
    }
    async removeExperience(field: string, id: string): Promise<boolean> {
        try {
            const remove = await userModel.updateOne({ _id: id }, { $pull: { experience: { experiencefield: field } } })
            return remove.acknowledged
        } catch (error) {
            console.error(error);
            throw new Error("Unable to delete user experience ")
        }
    }
    async removeSkills(val: string, id: string): Promise<boolean> {
        try {
            const remove = await userModel.updateOne({ _id: id }, { $pull: { skills: val } })
            return remove.acknowledged
        } catch (error) {
            console.error(error);
            throw new Error("Unable to removeskills ")
        }
    }
}


export default userRepository
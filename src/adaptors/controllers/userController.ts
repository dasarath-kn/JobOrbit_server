import { Request, Response } from "express";
import user, { reviews } from '../../entities/user'
import userUsecase from "../../useCases/userUsecase";
import Cloudinary from "../../infrastructure/utils/cloudinary";
import mongoose from "mongoose";
import { savedPost } from "../../entities/savedPost";
import { comment } from "../../entities/comment";
import subscriptedUser from "../../entities/subscribedUser";
import postreport from "../../entities/postreport";
import getExpiryDate from "../../infrastructure/utils/expiryDate";
class userController {
    private userUsecases: userUsecase
    private Cloudinary: Cloudinary
    constructor(userUsecases: userUsecase, cloud: Cloudinary) {
        this.userUsecases = userUsecases
        this.Cloudinary = cloud
    }

    async signup(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password, phonenumber, field, location } = req.body
            const userData = { firstname, lastname, email, password, phonenumber, field, location }
            const exists = await this.userUsecases.findUser(userData as user)
            console.log(exists);
            if (!exists.data) {
                const { userSaved } = exists
                res.status(200).json({ success: true, message: "saved user", userSaved })
            } else {
                console.log("Email already exist");
                res.status(400).json({ success: false, message: 'Email already exist' })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })

        }
    }

    async login(req: Request, res: Response) {
        try {

            const { email, password } = req.body
            const userExist = await this.userUsecases.login(email, password)

            if (userExist.success) {
                const { userExistdata } = userExist
                console.log(userExistdata);
                const { token } = userExist
                res.status(200).json({ message: userExist.message, userExistdata, token })
            } else {
                res.status(400).json({ message: userExist.message })
            }


        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })
        }

    }
    async otp(req: Request, res: Response) {
        try {
            const { otp } = req.body
            const verifiedOtp = await this.userUsecases.verfiyOtp(otp)
            const { token } = verifiedOtp
            if (verifiedOtp.success) {
                res.status(200).json({ message: verifiedOtp.message, token })
            } else {
                res.status(400).json({ message: verifiedOtp.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })

        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body
            console.log(email);

            const resendOtp = await this.userUsecases.resendOtp(email)
            if (resendOtp.success) {
                res.status(200).json({ success: true, message: resendOtp.message })
            } else {
                res.status(200).json({ success: false, message: "Failed to sent otp" })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })

        }

    }

    async getUserdata(req: Request, res: Response) {
        try {
            const { id } = req

            const data = await this.userUsecases.userData(id as string)
            if (data.success) {
                const { userData } = data
                res.status(200).json({ success: true, message: data.message, userData })
            } else {
                res.status(400).json({ success: false, message: data.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })

        }
    }
    async googleSignup(req: Request, res: Response) {
        try {
            const { name, email, isGoogle } = req.body
            const firstname = name
            const is_google = isGoogle
            const userdata = { firstname, email, is_google }
            console.log(userdata);

            const userSaveddata = await this.userUsecases.googleSaveuser(userdata as user)
            if (userSaveddata?.success) {
                const { token } = userSaveddata
                res.status(200).json({ success: true, message: userSaveddata.message, token })
            } else {
                res.status(400).json({ success: false, message: userSaveddata?.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async verifyUser(req: Request, res: Response) {
        try {
            const { email } = req.body
            console.log(req.body);

            const userData = await this.userUsecases.userExist(email)
            if (userData.success) {
                const { Userdata } = userData
                res.status(200).json({ success: true, message: userData.message, Userdata })
            } else {
                res.status(400).json({ success: false, message: userData.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const userdata = { email, password }

            const resetpassword = await this.userUsecases.passwordReset(userdata as user)
            if (resetpassword.success) {
                res.status(200).json({ success: true, message: resetpassword.message })
            } else {
                res.status(400).json({ success: false, message: resetpassword.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const { id } = req
            const { firstname, lastname, field, location, github_url, portfolio_url, about, qualification, img_url, percentage } = req.body
            const percentages = Number(percentage)
            const userData = { firstname, lastname, field, location, github_url, portfolio_url, about, qualification, img_url }
            console.log(req.body);

            const file = req.file?.path
            const editProfile = await this.userUsecases.updateProfile(id as string, userData as user, file as string, percentages as number)
            if (editProfile.success) {
                const { userData } = editProfile
                res.status(200).json({ success: true, message: editProfile.message, userData })
            } else {
                res.status(400).json({ success: false, message: editProfile.message })

            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async addSkills(req: Request, res: Response) {
        try {
            const { skill, percentage } = req.body
            const { id } = req
            const addskills = await this.userUsecases.manageSkill(skill, id as string, percentage as number)
            if (addskills.success) {
                res.status(200).json({ success: true, message: addskills.message })
            } else {
                res.status(400).json({ success: false, message: addskills.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }


    async getjobs(req: Request, res: Response) {
        try {
            const { page,type,location,date } = req.query            
            const findJobs = await this.userUsecases.jobs(page as string,type as string,location as string,date as string)
            if (findJobs.success) {
                const { jobs, count } = findJobs
                res.status(200).json({ success: true, message: findJobs.message, jobs, count })
            } else {
                res.status(400).json({ success: false, message: findJobs.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }

    }
    async getPosts(req: Request, res: Response) {
        try {
            const getPosts = await this.userUsecases.posts()
            if (getPosts.success) {
                const { posts } = getPosts
                res.status(200).json({ success: true, messge: getPosts.message, posts })
            } else {
                res.status(400).json({ success: false, message: getPosts.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async likeUnlike(req: Request, res: Response) {
        try {
            const { post_id, status } = req.query
            const { id } = req
            const userid = id
            const manageLikeUnlike = await this.userUsecases.manageLikeUnlike(post_id as string, userid as string, status as string)
            if (manageLikeUnlike.success) {
                res.status(200).json({ success: true, message: manageLikeUnlike.message })
            } else {
                res.status(400).json({ success: false, message: manageLikeUnlike.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async savePost(req: Request, res: Response) {
        try {
            const { id } = req
            const { post_id, message, company_id } = req.body
            const postData = { user_id: id, post_id, company_id }

            const savedPost = await this.userUsecases.postSave(postData as savedPost, message)
            if (savedPost.success) {
                res.status(200).json({ success: true, message: savedPost.message })
            } else {
                res.status(400).json({ success: false, message: savedPost.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getsavedPost(req: Request, res: Response) {
        try {
            const { id } = req

            const getsavedPosts = await this.userUsecases.savedPosts(id as string)
            if (getsavedPosts.success) {
                const { savedPosts } = getsavedPosts

                res.status(200).json({ success: true, message: getsavedPosts.success, savedPosts })
            } else {
                res.status(400).json({ success: false, message: getsavedPosts.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async postComment(req: Request, res: Response) {
        try {
            const { id } = req
            const { post_id, message, company_id } = req.body
            const commentData = { user_id: id, post_id, company_id, message }
            const comments = await this.userUsecases.shareComment(commentData as comment)
            if (comments.success) {
                res.status(200).json({ success: true, message: comments.message })
            } else {
                res.status(400).json({ success: false, message: comments.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getcomments(req: Request, res: Response) {
        try {
            const { post_id } = req.query
            const comment = await this.userUsecases.comments(post_id as string)
            if (comment.message) {
                const { comments } = comment
                res.status(200).json({ success: true, message: comment.message, comments })
            } else {
                res.status(400).json({ success: false, message: comment.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }

    }
    async viewJobdetails(req: Request, res: Response) {
        try {
            const { job_id } = req.query
            const { id } = req
            const details = await this.userUsecases.jobDetails(job_id as string, id as string)
            if (details.success) {
                const { jobDetails, plan_id } = details

                res.status(200).json({ success: true, message: details.message, jobDetails, plan_id })
            } else {
                res.status(400).json({ success: false, message: details.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async addexperience(req: Request, res: Response) {
        try {
            const { id } = req

            const { experiencefield, mode, start_date, end_date, responsibilities, percentage } = req.body
            const experienceData = { experiencefield, mode, start_date, end_date, responsibilities }
            const percentages = Number(percentage)
            const addexperience = await this.userUsecases.experience(experienceData as any, percentages, id as string)
            if (addexperience.success) {
                res.status(200).json({ success: true, message: addexperience.message })
            } else {
                res.status(400).json({ success: false, message: addexperience.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async uploadResume(req: Request, res: Response) {
        try {
            console.log(req.file);
            const { id } = req
            const file = req.file?.path
            const { percentage } = req.body
            const percentages = Number(percentage)
            const upload = await this.userUsecases.resume(id as string, file as any, percentages)
            if (upload.success) {
                res.status(200).json({ success: true, message: upload.message })
            } else {
                res.status(400).json({ success: false, message: upload.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async applyJob(req: Request, res: Response) {
        try {
            const { id } = req
            const { job_id, company_id } = req.body
            console.log(req.body);

            const applyJob = await this.userUsecases.jobApplication(job_id as string, id as string, company_id as string)
            if (applyJob.success) {
                res.status(200).json({ success: true, message: applyJob.message })
            } else {
                res.status(400).json({ success: false, message: applyJob.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getSubscriptionPlans(req: Request, res: Response) {
        try {
            const subscriptionData = await this.userUsecases.subscriptionPlans()
            if (subscriptionData.success) {
                const { subscriptionplan } = subscriptionData
                res.status(200).json({ success: true, message: subscriptionData.message, subscriptionplan })
            } else {
                res.status(400).json({ success: false, message: subscriptionData.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async paysubscriptionplan(req: Request, res: Response) {
        try {
            const { plan_id, expiry_date } = req.body
            const { id } = req
            const date = await getExpiryDate(expiry_date)
            const subscriptionData = { user_id: id, session_id: '', plan_id: plan_id, expiry_date: date }
            const payment = await this.userUsecases.subscriptionPayment(plan_id, subscriptionData as subscriptedUser)
            if (payment.success) {
                const { payment_id } = payment
                res.status(200).json({ success: true, payment_id })
            } else {
                res.status(400).json({ success: false })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async webhook(req: Request, res: Response) {
        try {
            const data = req.body

            const webhook = await this.userUsecases.updateSubscribedUsers(data as any)
            if (webhook?.success) {
                res.status(200).json({ success: true, message: webhook.message })
            } else {
                res.status(400).json({ success: false, message: webhook?.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async findSubscribedUser(req: Request, res: Response) {
        try {
            const { id } = req

            const findSubscribedUser = await this.userUsecases.subscribedUserdetails(id as string)

            if (findSubscribedUser.success) {
                const { subscribedUser } = findSubscribedUser
                res.status(200).json({ success: true, message: findSubscribedUser.messsage, subscribedUser })
            } else {
                res.status(400).json({ success: false, message: findSubscribedUser.messsage })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async reportPost(req: Request, res: Response) {
        try {
            const { id } = req
            const { post_id, report_message } = req.body
            const date = Date.now()
            const postreportData = { user_id: id, report_message, date }

            console.log(postreportData, "ddlj");

            const report = await this.userUsecases.postReportsave(post_id as string, postreportData as any)
            if (report.success) {
                res.status(200).json({ success: true, message: report.message })
            } else {
                res.status(400).json({ success: false, message: report.message })
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async appliedJobs(req: Request, res: Response) {
        try {
            const { id } = req

            const applied = await this.userUsecases.findAppliedJobsByUserid(id as string)
            if (applied.success) {
                const { appliedJobs } = applied
                res.status(200).json({ success: true, message: applied.message, appliedJobs })
            } else {
                res.status(400).json({ success: false, message: applied.message })
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            const userDetails = await this.userUsecases.findUsers()
            if (userDetails.success) {
                const { userDatas } = userDetails;

                res.status(200).json({ success: true, message: userDetails.message, userDatas })
            } else {
                res.status(400).json({ success: false, message: userDetails?.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async getComapnies(req: Request, res: Response) {
        try {
            const companyDetails = await this.userUsecases.findCompanies()
            if (companyDetails.success) {
                const { companyDatas } = companyDetails
                res.status(200).json({ success: true, messsage: companyDetails.message, companyDatas })
            } else {
                res.status(400).json({ success: true, message: companyDetails.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async getCompany(req: Request, res: Response) {
        try {
            const { id } = req.query
            const company = await this.userUsecases.viewCompany(id as string)
            if (company.success) {
                const { companyData } = company
                res.status(200).json({ success: true, message: company.message, companyData })
            } else {
                res.status(400).json({ success: true, message: company.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async findUser(req: Request, res: Response) {
        try {
            const { id } = req.query
            const user = await this.userUsecases.findUserdetails(id as string)
            if (user?.success) {
                const { userData } = user
                res.status(200).json({ success: true, message: user.message, userData })
            } else {
                res.status(400).json({ success: false, message: user?.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async postReview(req: Request, res: Response) {
        try {
            const { rating_count, review, company_id } = req.body
            const { id } = req
            const reviewData = { rating_count, review, user_id: id, date: Date.now(), company_id }
            const reviews = await this.userUsecases.addreviews(reviewData as any)
            if (reviews.success) {
                res.status(200).json({ success: true, message: reviews.message })
            } else {
                res.status(400).json({ success: false, message: reviews.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async getReviews(req: Request, res: Response) {
        try {
            const { id } = req.query
            const reviewDatas = await this.userUsecases.reviews(id as string)
            if (reviewDatas.success) {
                const { reviews } = reviewDatas

                res.status(200).json({ success: true, message: reviewDatas.message, reviews })
            } else {
                res.status(400).json({ success: false, messagwe: reviewDatas.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async connectUser(req: Request, res: Response) {
        try {



        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async newConnection(req: Request, res: Response) {
        try {
            const { id } = req
            const { connection_id } = req.body


            const connection = await this.userUsecases.addConnection(id as string, connection_id)
            if (connection.success) {
                res.status(200).json({ success: true, message: connection.message })
            } else {
                res.status(400).json({ success: false, message: connection.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const { _id } = req.query            
            const { id } = req
            console.log();
            const reciever_id = _id
            const sender_id = id

            const messageData = await this.userUsecases.message(reciever_id as string, sender_id as string)
            if (messageData.success) {
                const { messages } = messageData
                res.status(200).json({ success: true, message: messageData.message, messages })
            } else {
                res.status(400).json({ success: false, message: messageData.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async newCompanyConnection(req: Request, res: Response) {
        try {
            const { id } = req
            const { company_id } = req.body
            console.log(req.body);



            const connection = await this.userUsecases.addCompanyConnection(id as string, company_id)
            if (connection.success) {
                res.status(200).json({ success: true, message: connection.message })
            } else {
                res.status(400).json({ success: false, message: connection.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async connectRequests(req: Request, res: Response) {
        try {
            const { id } = req
            const connection = await this.userUsecases.connections(id as string)
            if (connection.success) {
                const { connectRequests } = connection
                res.status(200).json({ success: true, message: connection.message, connectRequests })
            } else {
                res.status(400).json({ success: false, message: connection.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async manageConnection(req: Request, res: Response) {
        try {
            const { id } = req
            const { connection_id, notification_id, message } = req.body
            const manage = await this.userUsecases.connectionManage(id as string, connection_id, notification_id, message)
            if (manage.success) {
                res.status(200).json({ success: true, message: manage.message })
            } else {
                res.status(400).json({ success: false, message: manage.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async saveInbox(req: Request, res: Response) {
        try {
            const { reciever_id,role } = req.body
            const { id } = req
            const sender_id = id
          

            const saveData = await this.userUsecases.inbox(sender_id as string, reciever_id,role)
            if (saveData.success) {
                res.status(200).json({ success: true, message: saveData.message })
            } else {
                res.status(400).json({ success: false, message: saveData.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async conversationData(req:Request,res:Response){
        try {
            const {id} =req
            const sender_id = id
            const {role}=req.query
            
            const data = await this.userUsecases.conversation(sender_id as string,role as string)
            if(data.success){
                const {conversationData} =data
                res.status(200).json({success:true,message:data.message,conversationData})
            }else{
                res.status(400).json({success:false,message:data.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async removeSkill(req:Request,res:Response){
        try {
            const {skill}=req.query
            const {id} =req            
            const remove = await this.userUsecases.deleteSkills(skill as string,id as string)
            if(remove.success){
                res.status(200).json({success:true,message:remove.message})
            }else{
                res.status(400).json({success:false,message:remove.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })  
        }
    }
    async removeExperience(req:Request,res:Response){
        try {
            const {field}=req.query
            const  {id} =req
            
            const remove = await this.userUsecases.deleteExperience(field as string,id as string)
            if(remove.success){
                res.status(200).json({success:true,message:remove.message})
            }else{
                res.status(400).json({success:false,message:remove.message})
            }
        }  catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })  
        }
    }
}



export default userController
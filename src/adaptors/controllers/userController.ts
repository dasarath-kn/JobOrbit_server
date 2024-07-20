import { Request,Response } from "express";
import user from '../../entities/user'
import userUsecase from "../../useCases/userUsecase";
import Cloudinary from "../../infrastructure/utils/cloudinary";
import mongoose from "mongoose";
import { savedPost } from "../../entities/savedPost";
import { comment } from "../../entities/comment";
import subscriptedUser from "../../entities/subscribedUser";
class userController {
    private userUsecases :userUsecase
    private Cloudinary:Cloudinary
    constructor(userUsecases:userUsecase,cloud:Cloudinary){
        this.userUsecases =userUsecases
        this.Cloudinary =cloud
    }

    async signup(req:Request,res:Response){
        try {
            const {firstname,lastname,email,password,phonenumber,field,location} =req.body
            const userData ={firstname,lastname,email,password,phonenumber,field,location}
              const exists = await this.userUsecases.findUser(userData as user)
              console.log(exists);
              if(!exists.data){
                let {userSaved} =exists
                res.status(200).json({success:true, message:"saved user",userSaved})
              }else{
                console.log("Email already exist");
                res.status(400).json({success:false,message:'Email already exist'})
              }
              
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }
    }

    async login(req:Request,res:Response){
        try {
            
            const {email,password} =req.body
            const userExist = await this.userUsecases.login(email,password)
            
            if(userExist.success){
                let {userExistdata} =userExist
                console.log(userExistdata);
                let {token} =userExist
                res.status(200).json({message:userExist.message,userExistdata,token})               
            }else{ 
                res.status(400).json({message:userExist.message})
            }
            

        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})             
        }

    }
    async otp(req:Request,res:Response){
        try {
         let{otp} =req.body
           let verifiedOtp = await this.userUsecases.verfiyOtp(otp)
           let {token} =verifiedOtp
           if(verifiedOtp.success){
            res.status(200).json({message:verifiedOtp.message,token})
           }else{
            res.status(400).json({message:verifiedOtp.message})
           }

        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }
    }

    async resendOtp(req:Request,res:Response){
        try {
            let {email} = req.body
            console.log(email);
            
            let resendOtp = await this.userUsecases.resendOtp(email)
            if(resendOtp.success){
                res.status(200).json({success:true,message:resendOtp.message})
            }else{
                res.status(200).json({success:false,message:"Failed to sent otp"})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }

    }

    async getUserdata(req:Request,res:Response){
        try {
            let {id} =req
            
            let data = await this.userUsecases.userData(id as string)
            if(data.success){
                let {userData} =data
                res.status(200).json({success:true,message:data.message,userData})
            }else{
                res.status(400).json({success:false,message:data.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})

        }
    }
    async googleSignup(req:Request,res:Response){
        try {            
            let {name,email,isGoogle} =req.body
            let firstname =name
            let is_google=isGoogle
            const userdata ={firstname,email,is_google}
            console.log(userdata);
            
            let userSaveddata = await this.userUsecases.googleSaveuser(userdata as user)
            if(userSaveddata?.success){
                let {token} =userSaveddata
                res.status(200).json({success:true,message:userSaveddata.message,token})
            }else{
                res.status(400).json({success:false,message:userSaveddata?.message})
            }
                        
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }
    async verifyUser(req:Request,res:Response){
        try {
            let {email} =req.body
            console.log(req.body);
            
            let userData = await this.userUsecases.userExist(email)           
            if(userData.success){
                const {Userdata}=userData
                res.status(200).json({success:true,message:userData.message,Userdata})
            }else{
                res.status(400).json({success:false,message:userData.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }
    async resetPassword(req:Request,res:Response){
        try {
            let {email,password} =req.body
            const userdata ={email,password}
            
            let resetpassword = await this.userUsecases.passwordReset(userdata as user)
            if(resetpassword.success){
                res.status(200).json({success:true,message:resetpassword.message})
            }else{
                res.status(400).json({success:false,message:resetpassword.message})

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
             
        }
    }
    async editProfile(req:Request,res:Response){
        try {
            const {id}=req
            const {firstname,lastname,field,location,github_url,portfolio_url,about,qualification,img_url}=req.body
            const userData ={firstname,lastname,field,location,github_url,portfolio_url,about,qualification,img_url}
             const file =req.file?.path
            let editProfile =await this.userUsecases.updateProfile(id as string,userData as user,file as string)
            if(editProfile.success){
                const {userData}=editProfile
                res.status(200).json({success:true,message:editProfile.message,userData})
            }else{
                res.status(400).json({success:false,message:editProfile.message})
                
            }            
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }

    async getjobs(req:Request,res:Response){
        try {
            let findJobs = await this.userUsecases.jobs()
            if(findJobs.success){
                const {jobs} =findJobs
                res.status(200).json({success:true,message:findJobs.message,jobs})
            }else{
                res.status(400).json({success:false,message:findJobs.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }

    }
    async getPosts(req:Request,res:Response){
        try {
            let getPosts = await this.userUsecases.posts()
            if(getPosts.success){
                const {posts}=getPosts
                res.status(200).json({success:true,messge:getPosts.message,posts})
            }else{
                res.status(400).json({success:false,message:getPosts.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
    async likeUnlike(req:Request,res:Response){
        try {
            const {post_id,status}=req.query            
            const {id}=req
           const userid= id
            let manageLikeUnlike = await this.userUsecases.manageLikeUnlike(post_id as string,userid as string,status as string)
            if(manageLikeUnlike.success){
                res.status(200).json({success:true,message:manageLikeUnlike.message})
            }else{
                res.status(400).json({success:false,message:manageLikeUnlike.message})
   
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
    async savePost(req:Request,res:Response){
        try {
            let {id}=req
            let {post_id}=req.body            
            let postData={user_id:id,post_id}
            
            let savedPost =await this.userUsecases.postSave(postData as savedPost)
            if(savedPost.success){
                res.status(200).json({success:true,message:savedPost.message})
            }else{
                res.status(400).json({success:false,message:savedPost.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
    async getsavedPost(req:Request,res:Response){
        try {
            let {id} =req
            
            let getsavedPosts = await this.userUsecases.savedPosts(id as string)
            if(getsavedPosts.success){
                const {savedPosts}=getsavedPosts

                res.status(200).json({success:true,message:getsavedPosts.success,savedPosts})
            }else{
                res.status(400).json({success:false,message:getsavedPosts.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"}) 
        }
    }
    async postComment(req:Request,res:Response){
        try {
            const {id}=req
            const {post_id,message}=req.body
            const commentData ={user_id:id,post_id,message}
            let comments = await this.userUsecases.shareComment(commentData as comment)
            if(comments.success){
                res.status(200).json({success:true,message:comments.message})
            }else{
                res.status(400).json({success:false,message:comments.message})
            }
        } catch (error) {
               console.error(error);
            res.status(500).json({success:false,message:"Internal server error"}) 
        }
        }
        async getcomments(req:Request,res:Response){
            try {
                const {post_id}=req.query
                const comment =await this.userUsecases.comments(post_id as string)
                if(comment.message){
                    const {comments}=comment
                    res.status(200).json({success:true,message:comment.message,comments})
                }else{
                    res.status(400).json({success:false,message:comment.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"}) 
            }
            
        }
        async viewJobdetails(req:Request,res:Response){
            try {
                const {job_id} =req.query
                let details = await this.userUsecases.jobDetails(job_id as string)                
                if(details.success){
                    const {jobDetails}=details
                    res.status(200).json({success:true,message:details.message,jobDetails})
                }else{
                    res.status(400).json({success:false,message:details.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"}) 
            }
        }
        async addexperience(req:Request,res:Response){
            try {
                const {id}=req
                
                const {experiencefield,duration,responsibilities}=req.body
                const experienceData ={experiencefield,duration,responsibilities}
               
                let addexperience = await this.userUsecases.experience(experienceData as any,id as string)
                if(addexperience.success){
                    res.status(200).json({success:true,message:addexperience.message})
                }else{
                    res.status(400).json({success:false,message:addexperience.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})
                
            }
        }
        async applyJob(req:Request,res:Response){
            try {
                const {id} =req
                const {job_id} =req.query
                console.log("job_id:",job_id,"userid:",id);
                
                
                const applyJob = await this.userUsecases.jobApplication(job_id,id as string)
                if(applyJob.success){
                    res.status(200).json({success:true,message:applyJob.message})
                }else{
                    res.status(400).json({success:false,message:applyJob.message})

                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"}) 
            }
        }
        async getSubscriptionPlans(req:Request,res:Response){
            try {
                let subscriptionData = await this.userUsecases.subscriptionPlans()
                if(subscriptionData.success){
                    const {subscriptionplan}=subscriptionData
                res.status(200).json({success:true,message:subscriptionData.message,subscriptionplan})
                }else{
                    res.status(400).json({success:false,message:subscriptionData.message})
                }
                
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})
            }
        }
        async paysubscriptionplan(req:Request,res:Response){
        try {
            const {price} =req.body
            const {id}=req
            console.log(price);
            const subscriptionData={user_id:id,session_id:'',plan_id:price}
        
            const payment =await this.userUsecases.subscriptionPayment(price,subscriptionData as subscriptedUser)
            if(payment.success){
                const {payment_id}=payment
                res.status(200).json({success:true,payment_id})
            }else{
                res.status(400).json({success:false})
            }
            
        } catch (error) {
            console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})
        }
        }

        async webhook(req:Request,res:Response){
            try {
               const data =req.body

               const webhook = await this.userUsecases.updateSubscribedUsers(data as any)
                if(webhook?.success){
                    res.status(200).json({success:true,message:webhook.message})
                }else{
                    res.status(400).json({success:false,message:webhook?.message})

                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})
 
            }
        }
        async findSubscribedUser(req:Request,res:Response){
            try {
                const {id} =req
                
                const findSubscribedUser = await this.userUsecases.subscribedUserdetails(id as string)
                
                if(findSubscribedUser.success){
                    const {subscribedUser} =findSubscribedUser
                    res.status(200).json({success:true,message:findSubscribedUser.messsage,subscribedUser})
                }else{
                    res.status(400).json({success:false,message:findSubscribedUser.messsage})
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({success:false,message:"Internal server error"})
   
            }
        }
    }


export default userController
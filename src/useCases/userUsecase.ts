import Stripe from "stripe";
import { comment } from "../entities/comment";
import { savedPost } from "../entities/savedPost";
import user, { experienceData, reviews } from "../entities/user";
import userRepository from "../infrastructure/repositories/userRepositories";
import Cloudinary from "../infrastructure/utils/cloudinary";
import HashPassword from "../infrastructure/utils/hashedPassword";
import Jwt from "../infrastructure/utils/jwtToken";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Otpgenerator from "../infrastructure/utils/otpGenerator";
import jwt from 'jsonwebtoken';
import StripePayment from "../infrastructure/utils/stripe";
import subscriptedUser from "../entities/subscribedUser";
import postreport from "../entities/postreport";
import message from "../entities/message";
class userUsecase {
    private userRepo: userRepository;
    private hashPassword: HashPassword
    private otpGenerator: Otpgenerator
    private nodeMailer: NodeMailer
    private jwttoken: Jwt
    private cloundinary: Cloudinary
    private stripe:StripePayment
    constructor(userRepo: userRepository, hashPassword: HashPassword, otpGenerator: Otpgenerator, nodeMailer: NodeMailer, jwttoken: Jwt, cloudinary: Cloudinary,stripe:StripePayment) {
        this.userRepo = userRepo
        this.hashPassword = hashPassword
        this.otpGenerator = otpGenerator
        this.nodeMailer = nodeMailer
        this.jwttoken = jwttoken
        this.cloundinary = cloudinary
        this.stripe =stripe
    }

    async findUser(userData: user) {
        try {
            let userExist = await this.userRepo.findUserByEmail(userData.email);
            if (userExist) {
                return { data: true }
            } else {
                let hashed = await this.hashPassword.hashPassword(userData.password)
                userData.password = hashed as string
                let userSaved = await this.userRepo.saveUser(userData);
                let otp = await this.otpGenerator.otpgenerate()
                await this.nodeMailer.sendEmail(userData.email, otp)
                await this.userRepo.saveOtp(userSaved?.email, otp)
                let token = await this.jwttoken.generateToken(userData._id, "user")

                return { data: false, userSaved }
            }

        } catch (error) {
            console.error(error);
            throw error;

        }
    }

    async login(email: string, password: string) {
        try {
            let userExistdata = await this.userRepo.findUserByEmail(email)
            if (userExistdata) {
                let checkPassword = await this.hashPassword.comparePassword(password, userExistdata.password)
                if (checkPassword) {
                    if (userExistdata.is_blocked) {
                        return { success: false, message: "You've been blocked admin" }
                    } else if (!userExistdata.is_verified) {
                        let otp = this.otpGenerator.otpgenerate()
                        await this.nodeMailer.sendEmail(email, otp)
                        await this.userRepo.saveOtp(email, otp)
                        return { success: true, message: "User not verified", userExistdata }
                    }
                    else {
                        let token = await this.jwttoken.generateToken(userExistdata._id, "user")
                        let refreshtoken = await this.jwttoken.generateRefreshtoken(userExistdata._id,"user")
                        return { success: true, userExistdata, message: "User logined successfully", token,refreshtoken }
                    }
                }
                else {
                    return { success: false, message: "Invalid Password" }
                }
            } else {
                return { success: false, message: 'Invalid Email' }
            }

        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async verfiyOtp(otp: string) {
        try {
            let verifiedOtp = await this.userRepo.checkOtp(otp)
            if (verifiedOtp) {
                await this.userRepo.verifyUser(verifiedOtp)
                let userData = await this.userRepo.findUserByEmail(verifiedOtp)
                let token = await this.jwttoken.generateToken(userData?._id as string, "user")
                return { success: true, message: 'User verified successfully', token }
            } else {
                return { success: false, message: 'Incorrect otp' }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }

    async resendOtp(email: string) {
        try {
            let otp = this.otpGenerator.otpgenerate()
            await this.nodeMailer.sendEmail(email, otp)
            await this.userRepo.saveOtp(email, otp)
            return { success: true, message: "Otp send successfully" }

        } catch (error) {
            console.error(error);
            throw error

        }
    }

    async userData(user_id: string) {
        try {
            let userData = await this.userRepo.getUserdata(user_id)
            if (userData) {
                return { success: true, message: "Userdata sent successfully", userData }
            } else {
                return { success: false, message: "Failed to sent userdata" }
            }


        } catch (error) {
            console.error(error);
            throw error

        }
    }

    async googleSaveuser(userdata: user) {
        try {

            let saved = await this.userRepo.saveUserdata(userdata)
            if (saved) {
                if (saved.is_blocked) {
                    return { success: false, message: "You've been blocked admin" }

                } else {
                    let token = this.jwttoken.generateToken(saved._id, "user")
                    return { success: true, message: " Logined successfully", token }
                }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async userExist(email: string) {
        try {
            let Userdata = await this.userRepo.findUserByEmail(email)
            console.log(Userdata);

            if (Userdata) {
                let otp = this.otpGenerator.otpgenerate()
                await this.nodeMailer.sendEmail(email, otp)
                await this.userRepo.saveOtp(email, otp)
                return { success: true, message: "Otp sent sucessfully", Userdata }
            } else {
                return { success: false, message: "Email not found " }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }

    async passwordReset(userdata: user) {
        try {
            let { password } = userdata
            let hashed = await this.hashPassword.hashPassword(password)
            console.log(hashed);

            userdata.password = hashed as string

            let data = await this.userRepo.resetPassword(userdata)
            if (data) {
                return { success: true, message: "Password reset successfully" }
            } else {
                return { success: false, message: "Failed to reset password" }
            }

        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async updateProfile(id: string, user: user, file: string,percentage:number) {
        try {
            if (file) {
                let cloudinary = await this.cloundinary.uploadImage(file, "User Profile")
                user.img_url = cloudinary
            }


            let updatedData = await this.userRepo.updateProfile(id, user,percentage)
            if (updatedData) {
                let userData = await this.userRepo.getUserdata(id)
                return { success: true, message: "User profile updated successfully", userData }
            } else {
                return { success: false, message: "Failed to update user profile" }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async manageSkill(skill:[],id:string,percentage:number){
        try {
            let updateSkill =await this.userRepo.updateSkill(skill,id,percentage)
            if(updateSkill){
                return {success:true,message:"Skill added successfully"}
            }else{
                return {success:false,message:"Failed to add skill"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async jobs(page:string,type:string,location:string,date:string) {
        try {
            let jobData = await this.userRepo.viewjobs(page,type,location,date)
            if (jobData) {
                const {jobs,count}=jobData
                return { success: true, message: "Jobs sent successfully", jobs,count }
            } else {
                return { success: false, message: "Failed to sent job" }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async posts() {
        try {
            let posts = await this.userRepo.getPosts()
            if (posts) {
                return { success: true, message: "Posts sent sucessfully", posts }
            } else {
                return { success: false, message: "Failed to sent posts" }
            }

        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async manageLikeUnlike(post_id: string, user_id: string, status: string) {
        try {
            
            if (status == "Like") {
                
                let liked = await this.userRepo.likePost(post_id, user_id)
                if (liked) {
                    return { success: true, message: " Post linked successfully" }
                } else {
                    return { success: false, message: " Failed to like post" }

                }
            } else {
                let unliked = await this.userRepo.unlikePost(post_id, user_id)
                if (unliked) {
                    return { success: true, message: " Post unlinked successfully" }

                } else {
                    return { success: false, message: " Failed to unlike post" }

                }
            }

        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async postSave(postData:savedPost,message:string){
        try {
            let savePost =await this.userRepo.savePost(postData,message)
            if(savePost){
                return {success:true,message:`Post ${message}`}
            }else{
                return {success:false,message:"Failed to save post"}
            }
            
        } catch (error) {
            console.error(error);
            throw error 
        }
    }
    async savedPosts(id:string){
        try {
            let savedPosts = await this.userRepo.getSavedpost(id)
            if(savedPosts){
                return {success:true,message:"Saved posts sent succcessfully",savedPosts}
            }else{
                return{success:false,message:"Failed to sent savedpost "}
            }
        } catch (error) {
            console.error(error);
            throw error  
        }
    }

    async shareComment(commentData:comment){
        try {
        const comment = await this.userRepo.postcomment(commentData)
        if(comment){
            return {success:true,message:"Comment added successfully"}
        }else{
            return {success:false,message:"Failed to add comment"}
        }
            
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async comments(post_id:string){
        try {
            const comments =await this.userRepo.getcomment(post_id)
            if(comments){
                return {success:true,message:"Comments sent successfully",comments}
            }
            else{
                return {success:false,message:"Failed to sent comments"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async jobDetails(job_id:string,id:string){
        try {
            let jobDetails = await this.userRepo.findJobdetails(job_id)
            if(jobDetails){
                let userData = await this.userRepo.findUserById(id)
                if(userData){
                    const {plan_id}=userData                    
                return {success:true,message:"Jobdetails sent successfully",jobDetails,plan_id}
                }else{
                    return {success:false}
                }
            }else{
                return {success:false,message:"Failed to send jobdetails"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async experience(experienceData:experienceData,percentage:number,id:string){
        try {
            
            let experience = await this.userRepo.addExperience(experienceData as experienceData,percentage as number,id as string)
            if(experience){
                return {success:true,message:'User experience added successfully'}
            }else{
                return {success:false,message:'Failed to add user experience'}
            }
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async resume(id:string,file:string,percentage:number){
        try {
            let resume_url =''
            if(file){
                let cloudinary = await this.cloundinary.uploaddocuments(file,"Resume")
                resume_url=cloudinary
            }
            let upload = await this.userRepo.updateResume(id,resume_url,percentage)
            if(upload){
                return {success:true,message:"Resume uploaded successfully"}
            }else{
                return {success:false,message:"Failed to upload resume"}
            }
            
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async jobApplication(job_id:string,user_id:string,company_id:string){
        try {
            let job = await this.userRepo.applyJob(job_id,user_id,company_id)
            if(job){
                return {success:true,message:"Job applied successfully"}
            }else{
                return {success:false,message:'Failed to apply job'}

            }
            
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async subscriptionPlans(){
        try {
            let subscriptionplan = await this.userRepo.getsubscriptionplan()
            if(subscriptionplan){
                return {success:true,message:"Subscription plans sent successfully",subscriptionplan}
            }else{
                return {success:false,message:"Failed to sent subscription"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async subscriptionPayment(price:string,subscribedData:subscriptedUser){
        try {
            console.log(price);
            
            let payment_id = await this.stripe.createCheckoutSession(price)
            if(payment_id){
                subscribedData.session_id =payment_id
                let save = await this.userRepo.savesubscribedUsers(subscribedData)
                if(save){
                    return {success:true,message:"Payment id sent successfully",payment_id}

                }else{
                    return {success:false,message:"Failed to sent payment id"}
 
                }
        }else{
            return {success:false,message:'Failed to complete transaction'}
           }
            
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async updateSubscribedUsers(datas: any) {
        try {
          switch (datas.type) {
            case 'checkout.session.completed':
              const session = datas.data.object;
              const id = session.id;
              const message = "success";
              const update = await this.userRepo.updatesubscribedUsers(id, message);
              if (update) {
                return { success: true, message: 'Updated successfully' };
              } else {
                return { success: false, message: "Failed to update" };
              }
      
            case 'checkout.session.async_payment_failed':
              console.log("Payment Failed");
              return { success: false, message: "Payment failed" }; // Provide a response for this case
      
            default:
              console.log(`Unhandled event type: ${datas.type}`);
              return { success: false, message: `Unhandled event type: ${datas.type}` }; // Provide a response for unhandled event types
          }
        } catch (error) {
          console.error(error);
          throw new Error("Error updating subscribed users"); // Provide a clearer error message
        }
      }
      async subscribedUserdetails(id:string){
        try {
            let subscribedUser= await this.userRepo.findSubscribedUserById(id)
            if(subscribedUser){
                return {success:true,messsage:'Subscribed User details sent successfully',subscribedUser}

            }else{
                return {success:false,messsage:'Subscribed User details sent failed'}

            }
        } catch (error) {
            console.error(error);
            throw error  
        }
      }

      async postReportsave(post_id:string,postreportData:postreport){
        try {
            let reportPost = await this.userRepo.savePostReport(post_id,postreportData)
            if(reportPost){
                return {success:true,message:"Post reported successfully"}

            }else{
                return {success:false,message:"Failed to report post"}
            }
        } catch (error) {
            console.error(error);
            throw error 
        }
      }

      async findAppliedJobsByUserid(user_id:string){
        try {
            const appliedJobs = await this.userRepo.findAppliedJobs(user_id)
            if(appliedJobs){
                return {success:true,message:"User Applied jobs sent successfully",appliedJobs}
            }else{
                return {success:false,message:"Failed to sent user applied jobs"}
            }
        } catch (error) {
            console.error(error);
            throw error 
        }
      }
      async findUsers() {
        try {
            let userDatas = await this.userRepo.getUserdatas()
            if (userDatas) {
                
                return { success: true, message: "Userdatas sent suceessfully", userDatas }
            } else {
                return { success: false, message: "Failed to send userdata" }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async findCompanies() {
        try {
            let companyDatas = await this.userRepo.getCompanydatas()
            if (companyDatas) {
               return { success: true, message: "Companydatas sent successfully",companyDatas }
            } else {
                return { success: false, message: "Failed to sent companydata" }
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async viewCompany(id:string){
        try {
            const companyData = await this.userRepo.findCompanyById(id)
            if(companyData){
                return{success:true,message:"Companydata sent successfully",companyData}
            }else{
                return{success:false,message:"Unable to sent companydata"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async findUserdetails(id:string){
        try {
            let userData = await this.userRepo.findUserById(id)
            if(userData){
                return{success:true,message:"Userdata sent successfully",userData}
            }else{
                return{success:false,message:"Failed to sent userdata"}
            }
            
        } catch (error) {
            
        }
    }
    async addreviews(reviewData:reviews){
        try {
            const saveReview = await this.userRepo.saveReviews(reviewData)
            if(saveReview){
                return {success:true,message:"Review added successfully",}
            }else{
                return {success:false,message:"Failed to save review"}
            }
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async reviews(id :string){
        try {
            const reviews = await this.userRepo.getReviews(id as string)
            
            if(reviews){
                console.log(reviews,"rrrrr ");
                
                return {success:true,message:"Reviews sent successfully",reviews}
            }else{
                return {success:false,message:"Failed to sent reviews"}
            }
        } catch (error) {
            console.error(error);
            throw error 
        }
    }

    async addConnection(user_id:string,connection_id:string){
        try {
            const connection = await this.userRepo.connectUser(user_id,connection_id)
            if(connection){
                return {success:true,message:"Connection request sent successfully"}
            }else{
                return {success:false,message:"Failed to sent  connection"}
            }
        } catch (error) {
            console.log(error);
            throw error
            
        }
    }
    async message(reciever_id:string,sender_id:string){
        try {
            const messages = await this.userRepo.getMessages(reciever_id,sender_id)
            if(messages){
                return {success:true,message:"Messages sent successfully",messages}
            }else{
                return {success:false,message:"Failed to sent message"}
            }
        } catch (error) {
            console.log(error);
            throw error
            
        }
    }
    async addCompanyConnection(user_id:string,company_id:string){
        try {
            const connection = await this.userRepo.connectCompany(user_id,company_id)
            if(connection){
                return {success:true,message:"Connection request sent successfully"}
            }else{
                return {success:false,message:"Failed to sent  connection"}
            }
        } catch (error) {
            console.log(error);
            throw error
            
        }
    }
    async connections(reciever_id:string){
        try {

            const connectRequests = await this.userRepo.findConnectionRequest(reciever_id)
            if(connectRequests){
                return {success:true,message:"Connect Request data sent successfully",connectRequests}
            }else{
                return {success:false,message:"Failed to sent connect request data"}
            }
        } catch (error) {
            console.log(error);
            throw error
             
        }
    }

    async connectionManage(user_id: string,connection_id:string, notification_id: string, message: string){
        try {
           const connect = await this.userRepo.manageConnection(user_id,connection_id,notification_id,message)
           if(connect){
            return {success:true,message:"Connection updated"}
           }else{
            return {success:false,message:"Failed to update  connection"}
           } 
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async inbox(sender_id:string,reciever_id:string,role:string){
        try {
            const saveData = await this.userRepo.saveInbox(sender_id,reciever_id,role)
            if(saveData){
                return {success:true,message:"Inbox saved"}
            }else{
                return {success:false,message:"Failed to save"}
            }
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async conversation(sender_id:string,role:string){
        try {
            const conversationData = await this.userRepo.findInbox(sender_id,role)
            if(conversationData){
                return {success:true,message:"Conversation list sent successfully",conversationData}
            }else{
             return {success:false,messsage:"Failed to sent conversation data"}
            }
        } catch (error) {
            console.log(error);
            throw error  
        }
    }
}

export default userUsecase
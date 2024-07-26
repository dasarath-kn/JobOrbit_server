import Stripe from "stripe";
import { comment } from "../entities/comment";
import { savedPost } from "../entities/savedPost";
import user, { experienceData } from "../entities/user";
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
    async jobs() {
        try {
            let jobs = await this.userRepo.viewjobs()
            if (jobs) {
                return { success: true, message: "Jobs sent successfully", jobs }
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

    async postSave(postData:savedPost){
        try {
            let savePost =await this.userRepo.savePost(postData)
            if(savePost){
                return {success:true,message:"Post saved to your collection"}
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
    async jobApplication(job_id:string,user_id:string){
        try {
            let job = await this.userRepo.applyJob(job_id,user_id)
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

      async postReportsave(postreportData:postreport){
        try {
            let reportPost = await this.userRepo.savePostReport(postreportData)
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
      
}

export default userUsecase
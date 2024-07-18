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
class userUsecase {
    private userRepo: userRepository;
    private hashPassword: HashPassword
    private otpGenerator: Otpgenerator
    private nodeMailer: NodeMailer
    private jwttoken: Jwt
    private cloundinary: Cloudinary
    constructor(userRepo: userRepository, hashPassword: HashPassword, otpGenerator: Otpgenerator, nodeMailer: NodeMailer, jwttoken: Jwt, cloudinary: Cloudinary) {
        this.userRepo = userRepo
        this.hashPassword = hashPassword
        this.otpGenerator = otpGenerator
        this.nodeMailer = nodeMailer
        this.jwttoken = jwttoken
        this.cloundinary = cloudinary
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
    async updateProfile(id: string, user: user, file: string) {
        try {
            if (file) {
                let cloudinary = await this.cloundinary.uploadImage(file, "User Profile")
                user.img_url = cloudinary
            }


            let updatedData = await this.userRepo.updateProfile(id, user)
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
    async jobDetails(job_id:string){
        try {
            let jobDetails = await this.userRepo.findJobdetails(job_id)
            if(jobDetails){
                return {success:true,message:"Jobdetails sent successfully",jobDetails}
            }else{
                return {success:false,message:"Failed to send jobdetails"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async experience(experienceData:experienceData,id:string){
        try {
            
            let experience = await this.userRepo.addExperience(experienceData as experienceData,id as string)
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
}

export default userUsecase
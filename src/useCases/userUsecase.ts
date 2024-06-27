import user from "../entities/user";
import userRepository from "../infrastructure/repositories/userRepositories";
import HashPassword from "../infrastructure/utils/hashedPassword";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Otpgenerator from "../infrastructure/utils/otpGenerator";
import jwt from 'jsonwebtoken';
class userUsecase {
    private userRepo: userRepository;
    private hashPassword: HashPassword
    private otpGenerator: Otpgenerator
    private nodeMailer: NodeMailer
    constructor(userRepo: userRepository, hashPassword: HashPassword, otpGenerator: Otpgenerator, nodeMailer: NodeMailer) {
        this.userRepo = userRepo
        this.hashPassword = hashPassword
        this.otpGenerator = otpGenerator
        this.nodeMailer = nodeMailer
    }

    async findUser(userData: user) {
        try {
            let userExist = await this.userRepo.findUserByEmail(userData.email);
            if (userExist) {
                return { data: true }
            } else {
                let hashed = await this.hashPassword.hashPassword(userData.password)
                userData.password = hashed as string
                let userSave = await this.userRepo.saveUser(userData);
                let otp = this.otpGenerator.otpgenerate()
                await this.nodeMailer.sendEmail(userData.email, otp)
                let user_id =userSave?._id
                
              await this.userRepo.saveOtp(user_id,otp)
                return { data: false, userSave }
            }

        } catch (error) {
            console.error(error);
            throw (error);

        }
    }

    async login(email: string, password: string) {
        try {
            let userExistdata = await this.userRepo.findUserByEmail(email)
            if (userExistdata) {
                let checkpassword = await this.hashPassword.comparePassword(password, userExistdata.password)
                if (checkpassword &&userExistdata.is_verified) {
                   
                    return { success: true, userExistdata, message: "User logined successfully" }
                } else if (userExistdata.is_blocked) {
                    return { success: false, message: "You've been blocked admin" }
                }
                else if (!userExistdata.is_verified) {
                    let otp = this.otpGenerator.otpgenerate()
                    console.log(otp);
                    
                    await this.nodeMailer.sendEmail(userExistdata.email, otp)
                    let user_id =userExistdata._id
                    await this.userRepo.saveOtp(user_id,otp)

                    return {success:false,message:"Not verified user"}
                }
                else {
                    return { success: false, message: "Invalid Password" }
                }
            } else {
                return { success: false }
            }

        } catch (error) {
            console.error(error);
            throw (error)
        }
    }

    async verfiyOtp(otp:string){
        try {
            let verifiedOtp =await this.userRepo.checkOtp(otp)
            if(verifiedOtp){
                await this.userRepo.verifyUser(verifiedOtp)
                return {success:true,message:'User verified successfully'}
            }else{
                return {success:false,message:'User not verified'}
            }
           
        } catch (error) {
            console.error(error);
            throw (error)
            
        }
    }




}

export default userUsecase
import user from "../entities/user";
import userRepository from "../infrastructure/repositories/userRepositories";
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
    constructor(userRepo: userRepository, hashPassword: HashPassword, otpGenerator: Otpgenerator, nodeMailer: NodeMailer, jwttoken: Jwt) {
        this.userRepo = userRepo
        this.hashPassword = hashPassword
        this.otpGenerator = otpGenerator
        this.nodeMailer = nodeMailer
        this.jwttoken = jwttoken
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
                    }
                    else {
                        let token = await this.jwttoken.generateToken(userExistdata._id, "user")
                        return { success: true, userExistdata, message: "User logined successfully", token }
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



}

export default userUsecase
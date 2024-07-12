import company from "../entities/company";
import jobs from "../entities/jobs";
import CompanyRepositories from "../infrastructure/repositories/companyRespositories";
import userRepository from "../infrastructure/repositories/userRepositories";
import HashPassword from "../infrastructure/utils/hashedPassword";
import Jwt from "../infrastructure/utils/jwtToken";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Otpgenerator from "../infrastructure/utils/otpGenerator";

class CompanyUsecase {
    private companyRepo:CompanyRepositories
    private hashPassword:HashPassword
    private userRepo:userRepository
    private otpGenerator:Otpgenerator
    private nodeMailer:NodeMailer
    private jwttoken :Jwt
    constructor(companyRepo:CompanyRepositories,hashPassword:HashPassword,userRepo:userRepository,otpGenerator:Otpgenerator,nodeMailer:NodeMailer,jwttoken:Jwt){
        this.companyRepo = companyRepo
        this.hashPassword =hashPassword
        this.otpGenerator = otpGenerator
        this.userRepo =userRepo
        this.nodeMailer= nodeMailer
        this.jwttoken =jwttoken
    }
    async signUp(companyData :company){
        try {
            let companyExist = await this.companyRepo.findCompanyByEmail(companyData.email)
            if(companyExist){
                if(!companyExist.is_verified){ 
                    const  otp = await this.otpGenerator.otpgenerate()
                    await this.nodeMailer.sendEmail(companyData.email,otp)
                   await this.userRepo.saveOtp(companyExist.email,otp)                   
                    
                   return {success:true ,message:"company is not verified"}

                }else{
                    return {success:false ,message:"Email alreadyexist"}

                }
            }
            else{
            const hashedPassword = await this.hashPassword.hashPassword(companyData.password)
            companyData.password =hashedPassword as string
            const companySaved = await this.companyRepo.saveCompany(companyData)
             const  otp = await this.otpGenerator.otpgenerate()
            await this.nodeMailer.sendEmail(companyData.email,otp)
            await this.userRepo.saveOtp(companySaved?.email,otp)
            
            if(companySaved){
                return {success:true ,message:"New company saved sucessfully",companySaved}
            }else{
                return {success:false ,message:"New company is not saved"}
            }
        }
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async login(email:string,password:string){
        try {
            let companyData = await this.companyRepo.findCompanyByEmail(email)
           
            if(companyData){
                let checkPassword =await this.hashPassword.comparePassword(password,companyData.password)
                if(checkPassword){
                    if(companyData.is_blocked){
                        return {success:false,message:"You've been blocked by admin"}
                    }
                    else{
                let token = await this.jwttoken.generateToken(companyData._id,"company")
                        return {success:true,message:"Company logined successfully",companyData,token}
                    }
                }else{
                    return {success:false,message:"Invalid Password"}
                }
            }else{
                return {success:false,message:"Invalid Email"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
            
        }

    }
    async verifyOtp(otp:string){
        try {
            let findOtp = await this.companyRepo.checkOtp(otp)
            
            if(findOtp){
                await this.companyRepo.verifyCompany(findOtp)
                const companyData =await this.companyRepo.findCompanyByEmail(findOtp)
                const token = await this.jwttoken.generateToken(companyData?._id as string,"company")
                return {success:true,message:"Company verified successfully",token}
            }else{
                return {success:false,message:"Incorrect otp"}
            }
            
        } catch (error) {
            console.error(error);
            throw  error
            
        }
    }

    async googleSavecompany(companydata:company){
        try {
            let saved = await this.companyRepo.saveCompanydata(companydata)
            if(saved){
                if(saved.is_blocked){
                    return {success:false,message:"You've been blocked admin"}
    
                }
                let token = this.jwttoken.generateToken(saved._id,"company")
                return {success:true,message:"Logined successfully",token}
            }else{
                return{success:false,message:"Logined failed"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async companData(id:string){
        try {
            let companydata = await this.companyRepo.getCompanydata(id)
            if(companydata){
                return {success:true,message:"Companydata sent successfully",companydata}
            }else{
                return {success:false,message:"Failed to sent companydata"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
            
        }
    }
    async companyExist(email:string){
        try {
            let companyData = await this.companyRepo.findCompanyByEmail(email)
           
            if(companyData){
                let otp = this.otpGenerator.otpgenerate()
                await this.nodeMailer.sendEmail(email, otp)
                await this.userRepo.saveOtp(email, otp)
                return {success:true,message:"Otp sent sucessfully",companyData}
            }else{
                return {success:false,message:"Email not found "}
            }
            
        } catch (error) {
            console.error(error);
            throw error
            
        }
    }
    async passwordReset(companydata:company){
        try {
            let {password} =companydata
            let hashed = await this.hashPassword.hashPassword(password)
            console.log(hashed);
            
            companydata.password=hashed as string
            
            let data = await this.companyRepo.resetPassword(companydata )
            if(data){
                return {success:true,message:"Password reset successfully"}
            }else{
                return {success:false,message:"Failed to reset password"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async savingJobs(jobData:jobs){
        try {

            let savedJob = await this.companyRepo.saveJobs(jobData)
            if(savedJob){
                return {success:true,message:"Job created successfully"}
            }else{
                return {success:false,message:"Failed to create job"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async jobs(id:string){
      try {
        let jobData = await this.companyRepo.getJobs(id)
        if(jobData){
            return{success:true,message:"Jobs sent successfully",jobData}
        } else{
            return{success:false,message:"Failed to sent jobs"}
        }
      } catch (error) {
        console.error(error);
        throw error
      }
    }
    async jobRemove(id:string){
        try {
            let removedJob =await this.companyRepo.removeJob(id)
            if(removedJob){
                return{success:true,message:"Job removed successfully"}
            }else{
                return {success:false,message:"Failed to remove job"}
            }
        } catch (error) {
            console.error(error);
        throw error
        }
    }


}
export default CompanyUsecase
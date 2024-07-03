import company from "../entities/company";
import CompanyRepositories from "../infrastructure/repositories/companyRespositories";
import userRepository from "../infrastructure/repositories/userRepositories";
import HashPassword from "../infrastructure/utils/hashedPassword";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Otpgenerator from "../infrastructure/utils/otpGenerator";

class CompanyUsecase {
    private companyRepo:CompanyRepositories
    private hashPassword:HashPassword
    private userRepo:userRepository
    private otpGenerator:Otpgenerator
    private nodeMailer:NodeMailer
    constructor(companyRepo:CompanyRepositories,hashPassword:HashPassword,userRepo:userRepository,otpGenerator:Otpgenerator,nodeMailer:NodeMailer){
        this.companyRepo = companyRepo
        this.hashPassword =hashPassword
        this.otpGenerator = otpGenerator
        this.userRepo =userRepo
        this.nodeMailer= nodeMailer
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

                        return {success:true,message:"Company logined successfully",companyData}
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
                return {success:true,message:"Company verified successfully"}
            }else{
                return {success:false,message:"Incorrect otp"}
            }
            
        } catch (error) {
            console.error(error);
            throw  error
            
        }
    }

    

}
export default CompanyUsecase
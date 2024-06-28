import company from "../entities/company";
import CompanyRepositories from "../infrastructure/repositories/companyRespositories";
import userRepository from "../infrastructure/repositories/userRepositories";
import HashPassword from "../infrastructure/utils/hashedPassword";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Otpgenerator from "../infrastructure/utils/otpGenerator";

class CompanyUsecase {
    private companyRepo:CompanyRepositories
    private hashPassword:HashPassword
    private otpGenerator:Otpgenerator
    private userRepo:userRepository
    private nodeMailer:NodeMailer
    constructor(companyRepo:CompanyRepositories,hashPassword:HashPassword,otpGenerator:Otpgenerator,userRepo:userRepository,nodeMailer:NodeMailer){
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
                    return {success:false ,message:"company is not verified"}

                }else{
                    return {success:false ,message:"Email alreadyexist"}

                }
            }
            else{
            const hashedPassword = await this.hashPassword.hashPassword(companyData.password)
            companyData.password =hashedPassword as string
            const companySave = await this.companyRepo.saveCompany(companyData)
            const  otp = await this.otpGenerator.otpgenerate()
            await this.nodeMailer.sendEmail(companyData.email,otp)
            await this.userRepo.saveOtp(companySave?.email,otp)
            
            if(companySave){
                return {success:true ,message:"New company saved sucessfully",companySave}
            }else{
                return {success:false ,message:"New company is not saved"}
            }
        }
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    

}
export default CompanyUsecase
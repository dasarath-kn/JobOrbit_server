import company from "../../entities/company";
import ICompanyInterface from "../../useCases/interfaces/ICompanyInterface";
import companyModel from "../database/companyModel";
import otpModel from "../database/otpModel";

class CompanyRepositories implements ICompanyInterface{
  
    async saveCompany(companyData: company): Promise<company | null> {
     try {
        let newCompany = new companyModel(companyData)
        await newCompany.save()        
        return companyData? companyData : null
     } catch (error) {
        console.error(error);
        throw new Error("Unable to save new company")
        
     }
   }

   async findCompanyByEmail(email: string): Promise<company | null> {
       try {
        let companyData = await companyModel.findOne({email:email})
        return companyData ? companyData : null
        
       } catch (error) {
        console.error(error);
        throw new Error("Unable to find company");
        
       }
   }
   async checkOtp(otp:string):Promise<string | null>{
      try {
         let checkedOtp = await otpModel.findOne({otp:otp})
         return checkedOtp?checkedOtp.email:null
         
      } catch (error) {
         console.error(error);
         throw new Error("Unable to find otp")
         
      }
   }

    async verifyCompany(email: string): Promise<boolean> {
      try {
         let verifyCompany = await companyModel.updateOne({email:email},{$set:{is_verified:true}},{upsert:true})
         return verifyCompany.acknowledged
         
      } catch (error) {
        console.error(error);
        throw new Error("Unable to verfiy company")
         
      }
   }
}

export default CompanyRepositories
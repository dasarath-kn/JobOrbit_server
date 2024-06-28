import company from "../../entities/company";
import ICompanyInterface from "../../useCases/interfaces/ICompanyInterface";
import companyModel from "../database/companyModel";

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
}

export default CompanyRepositories
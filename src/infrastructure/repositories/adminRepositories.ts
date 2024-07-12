import admin from "../../entities/admin";
import company from "../../entities/company";
import user from "../../entities/user";
import IAdminInterface, { CompanyDataResult, UserDataResult } from "../../useCases/interfaces/IAdminInterface";
import companyModel from "../database/companyModel";
import userModel from "../database/userModel";

class AdminRespositories implements IAdminInterface{
    async findAdminbyEmail(email: string): Promise<admin |null> {
        try {
            let adminData = await userModel.findOne({email:email})
            return adminData?adminData:null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find admindata");
            
            
        }
    }
   async getUserdatas(page:string): Promise<UserDataResult| null> {
        try {
            let skipCount =Number(page)*3
            let Count:number = await companyModel.find().countDocuments()            

            let userData:user[] = await userModel.find({}).skip(skipCount).limit(3)
            if (userData.length === 0) {
                return null;
            }
            return {
                count: Math.round(Count/3) ,
                userDatas: userData
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdatas")
            
        }
    }
    async getCompanydatas(page:string): Promise<CompanyDataResult| null> {
        try {
            let skipCount =Number(page)*3
            let Count:number = await companyModel.find().countDocuments()            

            let companyData:company[]=await companyModel.find().skip(skipCount).limit(3)
            if (companyData.length === 0) {
                return null;
            }
            return {
                count: Math.round(Count/3) ,
                companyDatas: companyData
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find companydatas")
            
        }
    }
   async blockUnblockUsers(user_id: string, status: string):Promise<string> {
    try {
        if(status =="block"){
            let  updatedStatus = await userModel.updateOne({_id:user_id},{$set:{is_blocked:true}})
            return updatedStatus.acknowledged?"User Blocked successfully":""
        }else{
            let  updatedStatus = await userModel.updateOne({_id:user_id},{$set:{is_blocked:false}})
            return updatedStatus.acknowledged?"User UnBlocked successfully":""
 
        }

        
    } catch (error) {
        console.error(error);
        throw new Error("Unable to block or unblock")

        
    }
   };

  async blockUnblockCompanies(company_id: string, status: string): Promise<string> {
      try {        
        if(status=="verify"){
            let updatedStatus = await companyModel.updateOne({_id:company_id},{$set:{admin_verified:true}})
            return updatedStatus.acknowledged?"Company Verified Successfully":""
        }else if(status=="block"){
            let updatedStatus = await companyModel.updateOne({_id:company_id},{$set:{is_blocked:true}})
            return updatedStatus.acknowledged?"Company blocked Successfully":""   
        }else if(status =="reject"){
            let updatedStatus = await companyModel.deleteOne({_id:company_id})
            return updatedStatus.acknowledged?"Company rejected Successfully":""   
        }
        else{
            let updatedStatus = await companyModel.updateOne({_id:company_id},{$set:{is_blocked:false}})
            return updatedStatus.acknowledged?"Company unblocked Successfully":""
        }
        
      } catch (error) {
        console.error(error);
        throw new Error("Unable to block or unblock")
        
      }
  }
}
export default AdminRespositories
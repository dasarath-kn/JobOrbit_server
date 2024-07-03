import { Request,Response } from "express"
import AdminUsecase from "../../useCases/adminUsecase";
class adminController {
    private adminUsecases:AdminUsecase
    constructor(adminUsecases:AdminUsecase){
        this.adminUsecases =adminUsecases
    }
    async login(req:Request,res:Response){
        try {            
            let {email,password} =req.body
            let adminExist =await this.adminUsecases.login(email,password)
            if(adminExist?.success){
                  res.status(200).json({success:true,message:adminExist.message})
            }else{
                res.status(400).json({success:false,message:adminExist?.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
        }
    }

    async userBlockUnblock(req:Request,res:Response){
        try {
            let {user_id,status} =req.query            
            let blockUnblockUser=await this.adminUsecases.blockUnblockUsers(user_id as string,status as string)
            if(blockUnblockUser.success){
                res.status(200).json({success:true,message:blockUnblockUser.message})
            }else{
                res.status(400).json({success:false,message:blockUnblockUser.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false ,message:"Internal server error"})
            
        }
    }
    async companyBlockUnblock(req:Request,res:Response){
        let {company_id,status} =req.query
        let blockUnblockCompany = await this.adminUsecases.blockUnblockCompanies(company_id as string,status as string)
        if(blockUnblockCompany.success){
            res.status(200).json({success:true,message:blockUnblockCompany.message})
        }else{
            res.status(400).json({success:false,message:blockUnblockCompany.message})
        }
    }

    async getUsers(req:Request,res:Response){
        try {
            let userDetails= await this.adminUsecases.findUsers()
            if(userDetails.success){
               let {userDatas} =userDetails;
                
                res.status(200).json({success:true,message:userDetails.message,userDatas})
            }else{
                res.status(400).json({success:false,message:userDetails?.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }
    async getComapnies(req:Request,res:Response){
        try {
            let companyDetails = await this.adminUsecases.findCompanies()
            if(companyDetails.success){
                const {companyDatas} =companyDetails
                res.status(200).json({success:true,messsage:companyDetails.message,companyDatas})
            }else{
                res.status(400).json({success:true,message:companyDetails.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }
    
}
export default adminController
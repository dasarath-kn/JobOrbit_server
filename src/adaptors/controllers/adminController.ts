import { Request,Response } from "express"
import AdminUsecase from "../../useCases/adminUsecase";
import subscriptions from "../../entities/subscriptions";
class adminController {
    private adminUsecases:AdminUsecase
    constructor(adminUsecases:AdminUsecase){
        this.adminUsecases =adminUsecases
    }
    async login(req:Request,res:Response){
        try {            
            const {email,password} =req.body
            const adminExist =await this.adminUsecases.login(email,password)
            if(adminExist?.success){
                const {token} =adminExist
                  res.status(200).json({success:true,message:adminExist.message,token})
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
            const {user_id,status} =req.query 
            console.log(req.query);
                       
            const blockUnblockUser=await this.adminUsecases.blockUnblockUsers(user_id as string,status as string)
            console.log(blockUnblockUser);
            
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
        const {company_id,status} =req.query          
        const blockUnblockCompany = await this.adminUsecases.blockUnblockCompanies(company_id as string,status as string)
        if(blockUnblockCompany.success){
            res.status(200).json({success:true,message:blockUnblockCompany.message})
        }else{
            res.status(400).json({success:false,message:blockUnblockCompany.message})
        }
    }

    async getUsers(req:Request,res:Response){
        try {
            const {page} =req.query
            const userDetails= await this.adminUsecases.findUsers(page as string)
            if(userDetails.success){
                const {userDatas,count} =userDetails;
                
                res.status(200).json({success:true,message:userDetails.message,userDatas,count})
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
            const {page}= req.query
            const companyDetails = await this.adminUsecases.findCompanies(page as string)
            if(companyDetails.success){
                const {companyDatas,count} =companyDetails
                res.status(200).json({success:true,messsage:companyDetails.message,companyDatas,count})
            }else{
                res.status(400).json({success:true,message:companyDetails.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
            
        }
    }
    
    async subscription(req:Request,res:Response){
        try {
            const {subscriptiontype,limit,month,price}=req.body
            const subscriptionData ={subscriptiontype,limit,month,price}
            console.log(
            subscriptionData

            );
            
            const save = await this.adminUsecases.savesubscriptionPlan(subscriptionData as subscriptions)
            if(save.Success){
                res.status(200).json({success:true,message:save.message})
            }else{
                res.status(400).json({success:false,message:save.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
              
        }
    }

    async getSubscriptionPlans(req:Request,res:Response){
        try {
            const subscriptionData = await this.adminUsecases.subscriptionPlans()
            if(subscriptionData.success){
                const {subscriptionplan}=subscriptionData
            res.status(200).json({success:true,message:subscriptionData.message,subscriptionplan})
            }else{
                res.status(400).json({success:false,message:subscriptionData.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
    async deletePlan(req:Request,res:Response){
        try {
            const {id} =req.query
            const removed = await this.adminUsecases.removePlan(id as string)
            if(removed?.success){
                res.status(200).json({success:true,message:removed.message})
            }else{
                res.status(400).json({success:false,message:removed?.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
    async listUnlistPlan(req:Request,res:Response){
        try {
            const {id,message} =req.body
            const manage = await this.adminUsecases.managePlans(id,message)
            if(manage.success){
                res.status(200).json({success:true,message:manage.message})
            }else{
                res.status(400).json({success:false,message:manage.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})  
        }
    }
    async getDashboard(req:Request,res:Response){
        try {
            const data = await this.adminUsecases.dashboard()
            if(data.success){
                const {dashboardData} =data
                res.status(200).json({success:true,message:data.message,dashboardData})
            }else{
                res.status(400).json({success:false,message:data.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})  
        
        }

    }
    async getPostreportdata(req:Request,res:Response){
        try {
            const reportdata = await this.adminUsecases.postreport()
            if(reportdata.message){
                const {postReportData} =reportdata
                res.status(200).json({success:true,message:reportdata.message,postReportData})
            }else{
                res.status(400).json({success:false,message:reportdata.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})  
        }
    }
    async removePost(req:Request,res:Response){
        try {
            const {id}=req.query
            console.log(id);
            
            const remove = await this.adminUsecases.deletePost(id as string)
            if(remove.success){
                res.status(200).json({success:true,message:remove.message})
            }else{
                res.status(400).json({success:false,message:remove.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:"Internal server error"})  
        }
    }
}
export default adminController
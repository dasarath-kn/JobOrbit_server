import { json } from "body-parser"
import AdminRespositories from "../infrastructure/repositories/adminRepositories"
import HashPassword from "../infrastructure/utils/hashedPassword"
import Jwt from "../infrastructure/utils/jwtToken"
import subscriptions from "../entities/subscriptions"
class AdminUsecase {
    private adminRepo: AdminRespositories
    private hashPassword: HashPassword
    private jwttoken: Jwt
    constructor(adminRepo: AdminRespositories, hashPassword: HashPassword, jwttoken: Jwt) {
        this.adminRepo = adminRepo
        this.hashPassword = hashPassword
        this.jwttoken = jwttoken
    }
    async login(email: string, password: string) {
        try {
            const adminExistdata = await this.adminRepo.findAdminbyEmail(email)
            if (adminExistdata) {
                const checkPassword = await this.hashPassword.comparePassword(password, adminExistdata.password)
                if (checkPassword) {
                    if (adminExistdata.is_admin) {
                        const id = adminExistdata._id.toString()

                        const token = await this.jwttoken.generateToken(id, "admin")

                        return { success: true, adminExistdata, message: 'Admin logined successfully', token }
                    } else {
                        return { success: false, message: 'Invalid admin ' }
                    }
                } else {
                    return { success: false, message: 'Invalid Password' }
                }
            } else {
                return { success: false, message: 'Invalid Email' }
            }

        } catch (error) {
            console.error(error)
            throw error

        }
    }
    async findUsers(page: string) {
        try {
            const userData = await this.adminRepo.getUserdatas(page)
            if (userData) {
                const { count, userDatas } = userData
                return { success: true, message: "Userdatas sent suceessfully", userDatas, count }
            } else {
                return { success: false, message: "Failed to send userdata" }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async findCompanies(page: string) {
        try {
            const companyData = await this.adminRepo.getCompanydatas(page)
            if (companyData) {
                const { count, companyDatas } = companyData
                return { success: true, message: "Companydatas sent successfully", count, companyDatas }
            } else {
                return { success: false, message: "Failed to sent companydata" }
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async blockUnblockUsers(user_id: string, status: string) {
        try {
            const changeStatus = await this.adminRepo.blockUnblockUsers(user_id, status)
            if (changeStatus) {
                return { success: true, message: changeStatus }
            } else {
                return { success: false, message: "Failed to block or unblock" }
            }
        } catch (error) {
            console.error(error);
            throw error

        }
    }

    async blockUnblockCompanies(company_id: string, status: string) {
        try {
            const changeStatus = await this.adminRepo.blockUnblockCompanies(company_id, status)

            if (changeStatus) {
                return { success: true, message: changeStatus }
            } else {
                return { success: false, message: changeStatus }
            }

        } catch (error) {
            console.error(error);
            throw error

        }
    }
    async savesubscriptionPlan(subscriptionData: subscriptions) {
        try {
            const savedSubscription = await this.adminRepo.subscription(subscriptionData)
            if (savedSubscription) {
                return { Success: true, message: "Subscription plan saved successfully" }
            } else {
                return { Success: false, message: "Failed to save subscription plan" }
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async subscriptionPlans(){
        try {
            const subscriptionplan = await this.adminRepo.getsubscriptionplan()
            if(subscriptionplan){
                return {success:true,message:"Subscription plans sent successfully",subscriptionplan}
            }else{
                return {success:false,message:"Failed to sent subscription"}
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async removePlan(plan_id:string){
        try {
            const remove = await this.adminRepo.deletePlan(plan_id)
            if(remove){
                return {success:true,message:"Plan removed successfully"}
            }else{
                return {success:false,message:"Failed to remove"}
            }
            
        } catch (error) {
            console.error(error);
            throw error 
        }
    }
    async managePlans(plan_id:string,message:string){
        try {
            const manage = await this.adminRepo.listUnlistPlans(plan_id,message)
            if(manage){
                return {success:true,message:`Plan ${message} successfully`}
            }else{
                return {success:false,message:`Failed to ${message} plan`}
  
            }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async dashboard(){
        try {
            const dashboardData = await this.adminRepo.getDashboard()
            if(dashboardData){
                return {success:true,message:'Dashboard data sent successfully',dashboardData}
            }else{
                return {success:false,message:'Failed to sent dashboard data'}
            }
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
    async postreport(){
        try {
            const postReportData = await this.adminRepo.getPostreportdata()
            if(postReportData){
                return {success:true,message:"Post report data sent successfully",postReportData}
            }else{
                return {success:false,message:"Failed to sent post report data"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async deletePost(post_id:string){
        try {
            const remove = await this.adminRepo.removePost(post_id)
            if(remove){
                const removeReportPost = await this.adminRepo.deleteReportPost(post_id)
                if(removeReportPost){
                    return {success:true,message:"Post deleted successfully"}

                }else{
                    return{success:false,message:"Failed to delete post"}
    
                }
            }else{
                return{success:false,message:"Failed to delete post"}
            }
        } catch (error) {
            console.error(error);
            throw error  
        }
    }
}

export default AdminUsecase
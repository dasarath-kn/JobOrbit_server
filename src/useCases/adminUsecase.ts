import { json } from "body-parser"
import AdminRespositories from "../infrastructure/repositories/adminRepositories"
import HashPassword from "../infrastructure/utils/hashedPassword"
class AdminUsecase {
    private adminRepo: AdminRespositories
    private hashPassword: HashPassword
    constructor(adminRepo: AdminRespositories, hashPassword: HashPassword) {
        this.adminRepo = adminRepo
        this.hashPassword = hashPassword
    }
    async login(email: string, password: string) {
        try {
            let adminExistdata = await this.adminRepo.findAdminbyEmail(email)
            if (adminExistdata) {
                let checkPassword = await this.hashPassword.comparePassword(password, adminExistdata.password)
                if (checkPassword) {                    
                    if (adminExistdata.is_admin) {
                        return { success: true, adminExistdata, message: 'Admin logined successfully' }
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
    async findUsers(){
        try {
            let userDatas = await this.adminRepo.getUserdatas()
            if(userDatas){
                return {success:true ,message:"Userdatas sent suceessfully",userDatas}
            }else{
                return {success:false ,message:"Failed to send userdata"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
            
        }
    }
    async findCompanies(){
        try {
         let companyDatas = await this.adminRepo.getCompanydatas()
         if(companyDatas){
            return {success:true,message:"Companydatas sent successfully",companyDatas}
         }    else{
            return {success:false,message:"Failed to sent companydata"}
         }
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    
    async blockUnblockUsers(user_id:string,status:string){
        try {
            let changeStatus = await this.adminRepo.blockUnblockUsers(user_id,status)
            if(changeStatus){
                return {success:true,message:changeStatus}
            }else{
                return {success:false,message:"Failed to block or unblock"}
            }
        } catch (error) {
            console.error(error);
            throw error
            
        }
    }

    async blockUnblockCompanies(company_id:string,status:string){
        try {
            let changeStatus = await this.adminRepo.blockUnblockCompanies(company_id,status)
            if(changeStatus){
                return {success:true,message:changeStatus}
            }else{
                return {success:false,message:changeStatus}
            }

        } catch (error) {
            console.error(error);
            throw error
            
        }
    }
}

export default AdminUsecase
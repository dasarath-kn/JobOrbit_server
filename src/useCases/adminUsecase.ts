import { json } from "body-parser"
import AdminRespositories from "../infrastructure/repositories/adminRepositories"
import HashPassword from "../infrastructure/utils/hashedPassword"
import Jwt from "../infrastructure/utils/jwtToken"
class AdminUsecase {
    private adminRepo: AdminRespositories
    private hashPassword: HashPassword
    private jwttoken :Jwt
    constructor(adminRepo: AdminRespositories, hashPassword: HashPassword,jwttoken:Jwt) {
        this.adminRepo = adminRepo
        this.hashPassword = hashPassword
        this.jwttoken =jwttoken
    }
    async login(email: string, password: string) {
        try {
            let adminExistdata = await this.adminRepo.findAdminbyEmail(email)
            if (adminExistdata) {
                let checkPassword = await this.hashPassword.comparePassword(password, adminExistdata.password)
                if (checkPassword) {                    
                    if (adminExistdata.is_admin) {
                        let id =adminExistdata._id.toString()
                        
                        let token = await this.jwttoken.generateToken(id,"admin")
                       
                        return { success: true, adminExistdata, message: 'Admin logined successfully',token }
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
    async findUsers(page:string){
        try {
            let userData = await this.adminRepo.getUserdatas(page)
            if(userData){
                const {count,userDatas}=userData
                return {success:true ,message:"Userdatas sent suceessfully",userDatas,count}
            }else{
                return {success:false ,message:"Failed to send userdata"}
            }
            
        } catch (error) {
            console.error(error);
            throw error
            
        }
    }
    async findCompanies(page:string){
        try {
         let companyData = await this.adminRepo.getCompanydatas(page)
         if(companyData){
            const {count,companyDatas}=companyData
            return {success:true,message:"Companydatas sent successfully",count,companyDatas}
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
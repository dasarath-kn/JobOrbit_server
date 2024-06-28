import company from "../../entities/company"
import CompanyUsecase from "../../useCases/companyUsecase"
import { Response,Request } from "express"
class CompanyController{
   private companyusecase:CompanyUsecase
    constructor(companyusecase:CompanyUsecase){
        this.companyusecase=companyusecase
    }

    async login(req:Request,res:Response){
        try {
            let {email,password}= req.body
            
            
        } catch (error) {
            console.error(error);
            res.send(500).json({success:false,message:"Internal server error"})
            
        }
    }

    async signUp(req:Request,res:Response){
        try {
            const {companyname,email,phonenumber,password,industry,state,city,address,about}= req.body
            const companyData ={companyname,email,phonenumber,password,industry,state,city,address,about}
            const companyExist = await this.companyusecase.signUp(companyData as company)
            if(companyExist.success){
                res.status(200).json({success:true,message:companyExist.message,companyExist})
            }else{
                res.status(400).json({success:false,message:companyExist.message})
            }
            
        } catch (error) {
            console.error(error);
            res.send(500).json({success:false,message:"Internal server error"})

            
        }
    }

}
export default CompanyController
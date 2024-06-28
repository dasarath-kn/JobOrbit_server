import { Request,Response } from "express"
import AdminUsecase from "../../useCases/adminUsecase";
class adminController {
    private adminUsecases:AdminUsecase
    constructor(adminUsecases:AdminUsecase){
        this.adminUsecases =adminUsecases
    }
    async login(req:Request,res:Response){
        try {
            console.log(req.body);
            
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
}
export default adminController
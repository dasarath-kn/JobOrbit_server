import { Request,Response } from "express";
import user from '../../entities/user'
import userUsecase from "../../useCases/userUsecase";
class userController {
    private userUsecases :userUsecase
    constructor(userUsecases:userUsecase){
        this.userUsecases =userUsecases
    }

    async signup(req:Request,res:Response){
        try {
            const {firstname,lastname,email,password,phonenumber,field,location} =req.body
            const userData ={firstname,lastname,email,password,phonenumber,field,location}
              const exists = await this.userUsecases.findUser(userData as user)
              console.log(exists);
              if(!exists.data){
                let {userSaved} =exists
                res.status(200).json({success:true, message:"saved user",userSaved})
              }else{
                console.log("Email already exist");
                res.status(400).json({success:false,message:'Email already exist'})
              }
              
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }
    }

    async login(req:Request,res:Response){
        try {
            
            const {email,password} =req.body
            const userExist = await this.userUsecases.login(email,password)
            
            if(userExist.success){
                let {userExistdata} =userExist
                console.log(userExistdata);
                let {token} =userExist
                res.status(200).json({message:userExist.message,userExistdata,token})               
            }else{ 
                res.status(400).json({message:userExist.message})
            }
            

        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})             
        }

    }
    async otp(req:Request,res:Response){
        try {
         let{otp} =req.body
           let verifiedOtp = await this.userUsecases.verfiyOtp(otp)
           let {token} =verifiedOtp
           if(verifiedOtp.success){
            res.status(200).json({message:verifiedOtp.message,token})
           }else{
            res.status(400).json({message:verifiedOtp.message})
           }

        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }
    }

    async resendOtp(req:Request,res:Response){
        try {
            let {email} = req.body
            console.log(email);
            
            let resendOtp = await this.userUsecases.resendOtp(email)
            if(resendOtp.success){
                res.status(200).json({success:true,message:resendOtp.message})
            }else{
                res.status(200).json({success:false,message:"Failed to sent otp"})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})
            
        }

    }

    async getUserdata(req:Request,res:Response){
        try {
            let {user_id} =req
            
            let data = await this.userUsecases.userData(user_id as string)
            if(data.success){
                let {userData} =data
                res.status(200).json({success:true,message:data.message,userData})
            }else{
                res.status(400).json({success:false,message:data.message})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})

        }
    }
}

export default userController
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
              console.log(userData);
              const exists = await this.userUsecases.findUser(userData as user)
              console.log(exists);
              if(!exists.data){
                console.log("saved user");
                res.status(200).json({success:true, message:"saved user",exists})
              }else{
                console.log("user already exist");
                res.status(400).json({success:false,message:'user already exist'})
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
            if(userExist.data){
                let {userExistdata} =userExist
                console.log("user logined sucessfully");
                res.status(200).json({message:"user logined sucessfully",userExistdata})               
            }else{                
                res.status(400).json({message:"user not found"})
            }
            

        } catch (error) {
            console.error(error);
            res.status(500).json({success:false,message:'Internal server error'})             
        }
    }
}

export default userController
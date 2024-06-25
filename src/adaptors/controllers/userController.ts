import { Request,Response } from "express";
import user from '../../entities/user'
class userController {
    constructor(){

    }

    async login(req:Request,res:Response){
        try {
            const {email,password} =req.body
          
            
            
            
            
        } catch (error) {
            
        }
    }
}

export default userController
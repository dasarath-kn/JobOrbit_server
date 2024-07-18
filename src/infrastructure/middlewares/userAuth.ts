import { NextFunction,Request,Response } from "express";
import userRepository from "../repositories/userRepositories";
import Jwt from "../utils/jwtToken";

const userRepo =new userRepository()
const jwt =new Jwt()
declare global {
    namespace Express {
      interface Request {
        id?: string; 
      }
    }
  }

const Auth = async(req:Request,res:Response,next:NextFunction)=>{
    try {  
              
        const authHeader = req.headers['authorization'] 
        
        if(!authHeader){
            return res.status(400).json({success:false,message:"Unauthorised Access "})
        }
        const verify = jwt.verifyJwttoken(authHeader)   
        if(!verify || verify.role!=='user'){
            console.log("sdfd");
            
            return res.status(401).json({success:false,message:"Unauthorised Access -Invalid token",blocked:true})
        }
        const user =await userRepo.findUserById(verify.id)
        if(user?.is_blocked){
            return res.status(401).json({ success: false, message: "User is blocked by admin", blocked: true });
        }
        req.id=verify.id  
        
        return next();
    } catch (error:any) {
        const refreshtoken =req.headers['refresh-token'];
        if(refreshtoken){
            const refreshtokenPayload =jwt.verifyRefreshToken(refreshtoken as string)
            const newaccesstoken =jwt.generateToken(refreshtokenPayload?.id,'user')
            const newRefreshtoken =jwt.generateRefreshtoken(refreshtokenPayload?.id,'user')
            return res.status(200).json({success:true,newaccesstoken,newRefreshtoken})

        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token",blocked:true });
    
        
    }
}
export default Auth
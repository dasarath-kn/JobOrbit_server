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
        if(!verify){
            return res.status(401).json({success:false,message:"Unauthorised Access -Invalid token"})
        }
        req.id=verify.id  
        return next();
    } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    
        
    }
}
export default Auth
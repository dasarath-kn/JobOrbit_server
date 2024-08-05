import { NextFunction,Request,Response } from "express";
import Jwt from "../utils/jwtToken";
import AdminRespositories from "../repositories/adminRepositories";

const adminRepo =new AdminRespositories()
const jwt =new Jwt()
declare global {
    namespace Express {
      interface Request {
        id?: string; 
      }
    }
  }

const adminAuth = async(req:Request,res:Response,next:NextFunction)=>{
    try {  
              
        const authHeader = req.headers['authorization'] 
        
        if(!authHeader){
            return res.status(400).json({success:false,message:"Unauthorised Access "})
        }
        const verify = jwt.verifyJwttoken(authHeader)   
        if(!verify || verify.role!=='admin'){
            return res.status(401).json({success:false,message:"Unauthorised Access -Invalid token"})
        }
        // const company =await adminRepo.getCompanydata(verify.id)
        // if(company?.is_blocked){
        //     return res.status(401).json({ success: false, message: "Company is blocked by admin", blocked: true });
        // }
        req.id=verify.id  
        
        return next();
    } catch (error:any) {
        if (error.name === 'Token has expired') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token",blocked:true });
        
    }
}
export default adminAuth
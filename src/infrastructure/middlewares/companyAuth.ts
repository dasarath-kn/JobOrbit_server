import { NextFunction,Request,Response } from "express";
import Jwt from "../utils/jwtToken";
import CompanyRepositories from "../repositories/companyRespositories";

const companyRepo =new CompanyRepositories()
const jwt =new Jwt()
declare global {
    namespace Express {
      interface Request {
        id?: string; 
      }
    }
  }

const companyAuth = async(req:Request,res:Response,next:NextFunction)=>{
    try {  
              
        const authHeader = req.headers['authorization'] 
        
        if(!authHeader){
            return res.status(400).json({success:false,message:"Unauthorised Access "})
        }
        const verify = jwt.verifyJwttoken(authHeader)   
        if(!verify || verify.role!=='company'){
            return res.status(401).json({success:false,message:"Unauthorised Access -Invalid token"})
        }
        const company =await companyRepo.getCompanydata(verify.id)
        if(company?.is_blocked){
            return res.status(401).json({ success: false, message: "Company is blocked by admin", blocked: true });
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
export default companyAuth
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

class Jwt {
    private jwtsecretkey;
    constructor(){
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
        }
        this.jwtsecretkey =process.env.JWT_SECRET_KEY
    }
    generateToken(id:string,role:string){        
        try {
            const payload ={id,role}
            const token = jwt.sign(payload,this.jwtsecretkey as string,{expiresIn:"1d"})            
            return token
        } catch (error) {
            console.error(error);
            
        }
    }
    verifyJwttoken(token:string){
        try {
            const verify = jwt.verify(token,this.jwtsecretkey) as JwtPayload
            return verify
            
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error('Token has expired:', error);
                throw new Error('Token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error('Invalid token:', error);
                throw new Error('Invalid token');
            } else {
                console.error('Error while verifying token:', error);
                throw new Error('Failed to verify token');
            } 
        }
    }
}

export default Jwt
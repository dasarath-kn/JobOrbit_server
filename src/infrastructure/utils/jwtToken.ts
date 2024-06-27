import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

class Jwt {
    private jwtsecretkey;
    constructor(){
        this.jwtsecretkey =process.env.JWT_SECRET_KEY
    }
    generateToken(id:string,role:string){
        try {
            
        } catch (error) {
            console.error(error);
            
        }
    }
}
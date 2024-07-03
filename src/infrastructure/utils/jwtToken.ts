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
            const payload ={id,role}
            const token = jwt.sign(payload,this.jwtsecretkey as string,{expiresIn:"1d"})            
            return token
        } catch (error) {
            console.error(error);
            
        }
    }
}

export default Jwt
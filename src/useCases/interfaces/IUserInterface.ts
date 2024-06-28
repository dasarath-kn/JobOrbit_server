import otp from "../../entities/otp";
import user from "../../entities/user";
interface IUserInterface{
    findUserByEmail(email:string):Promise<user | null>
    saveUser(user:user):Promise<user | null>
    verifyUser(id:string):Promise<boolean>
    saveOtp(Email:string,otp:string):Promise<boolean>
    checkOtp(otp:string):Promise<string|undefined>
}


export default IUserInterface
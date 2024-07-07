import user from "../../entities/user";
interface IUserInterface{
    findUserByEmail(email:string):Promise<user | null>
    saveUser(user:user):Promise<user | null>
    verifyUser(email:string):Promise<boolean>
    saveOtp(Email:string,otp:string):Promise<boolean>
    checkOtp(otp:string):Promise<string|null>
    getUserdata(user_id:string):Promise<user|null>
    saveUserdata(user:user):Promise<user |null >
    resetPassword(user:user):Promise<boolean|null >
}


export default IUserInterface
import admin from "../../entities/admin";
import company from "../../entities/company";
import user from "../../entities/user";

interface IAdminInterface {
    findAdminbyEmail(email:string):Promise<admin |null>
    getUserdatas():Promise<user[]|null>
    getCompanydatas():Promise<company[]|null>
    blockUnblockUsers(user_id:string,status:string):Promise<string>
    blockUnblockCompanies(company_id:string,status:string):Promise<string>
}   

export default IAdminInterface
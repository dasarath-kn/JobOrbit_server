import admin from "../../entities/admin";

interface IAdminInterface {
    findAdminbyEmail(email:string):Promise<admin |null>
}

export default IAdminInterface
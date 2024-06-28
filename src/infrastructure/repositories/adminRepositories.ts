import admin from "../../entities/admin";
import IAdminInterface from "../../useCases/interfaces/IAdminInterface";
import userModel from "../database/userModel";

class AdminRespositories implements IAdminInterface{
    async findAdminbyEmail(email: string): Promise<admin |null> {
        try {
            let adminData = await userModel.findOne({email:email})
            return adminData?adminData:null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to find admindata");
            
            
        }
    }
}
export default AdminRespositories
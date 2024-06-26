import user from "../../entities/user";
import IUserInterface from '../../useCases/interfaces/IUserInterface'
import userModel from "../database/userModel";
class userRepository implements IUserInterface{
     async findUserByEmail(email: string): Promise<user | null> {
        try {
           let userData = await userModel.findOne({email:email}) 
          return userData?userData.toObject():null
        } catch (error:any) {
            console.error(error);
            throw new Error("unable to find userdata");
            
        }    
    } 
    async saveUser(user:user):Promise<user | null>{
        try {
            const newUser = new userModel(user)
            await newUser.save()
            return newUser?newUser:null
            
        } catch (error:any) {
            console.error(error);
            throw new Error("unable to save newuser");
            
        }
    }
}


export default userRepository
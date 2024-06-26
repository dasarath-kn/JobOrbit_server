import user from "../entities/user";
import userRepository from "../infrastructure/repositories/userRepositories";

class userUsecase {
    private userRepo:userRepository;
    constructor(userRepo:userRepository){
        this.userRepo =userRepo
    }

    async findUser(userData:user){
        try {
            let userExist = await this.userRepo.findUserByEmail(userData.email);
            if(userExist){
                return {data:true}
            }else{
                let userSave = await this.userRepo.saveUser(userData);
                return { data:false,userSave }
            }
        
        } catch (error) {
            console.error(error);
            throw  (error);
            
        }
    }

    async login(email:string,password:string){
        try {
            let userExistdata = await this.userRepo.findUserByEmail(email)  
            if(userExistdata){
                return {data :true,userExistdata}
            }else{                
                return {data :false}
            }
            
        } catch (error) {
            console.error(error);
            throw (error)
        }
    }
    
}

export default userUsecase
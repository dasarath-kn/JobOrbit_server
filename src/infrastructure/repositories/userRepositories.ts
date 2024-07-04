import otp from "../../entities/otp";
import user from "../../entities/user";
import IUserInterface from '../../useCases/interfaces/IUserInterface'
import otpModel from "../database/otpModel";
import userModel from "../database/userModel";
class userRepository implements IUserInterface {

    async findUserByEmail(email: string): Promise<user | null> {
        try {
            let userData = await userModel.findOne({ email: email })
            return userData ? userData.toObject() : null
        } catch (error: any) {
            console.error(error);
            throw new Error("unable to find userdata");

        }
    }
    async saveUser(user: user): Promise<user | null> {
        try {
            const newUser = new userModel(user)
            await newUser.save()
            return newUser ? newUser : null

        } catch (error: any) {
            console.error(error);
            throw new Error("unable to save newuser");

        }
    }

    async verifyUser(email: string): Promise<boolean> {
        try {

            const verifiedUser = await userModel.updateOne({ email: email }, { $set: { is_verified: true } })
            console.log(verifiedUser);
            
            return verifiedUser.acknowledged

        }
        catch (error: any) {
            console.error(error);
            throw new Error("Unable to verifyuser")

        }
    }
    async saveOtp(email: string | undefined, otp: string): Promise<boolean> {
        try {
            const saveOtp = await otpModel.updateOne({ email: email }, { $set: { otp: otp } }, { upsert: true })
            return saveOtp.acknowledged
        } catch (error: any) {
            console.error(error);
            throw new Error("Unable to saveotp")

        }
    }


    async checkOtp(otp: string): Promise<string | null> {
        try {
            let checkedOtp = await otpModel.findOne({ otp: otp })
            return checkedOtp ? checkedOtp.email : null
        } catch (error: any) {
            console.error(error);
            throw new Error("Unable to find the otp")

        }
    }

    async getUserdata(user_id: string): Promise<user | null> {
        try {
            let userdata = await userModel.findOne({ _id: user_id })
            return userdata ? userdata : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to find userdata")

        }
    }



}


export default userRepository
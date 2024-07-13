import jobs from "../../entities/jobs";
import otp from "../../entities/otp";
import { Post } from "../../entities/posts";
import user from "../../entities/user";
import IUserInterface from '../../useCases/interfaces/IUserInterface'
import jobModel from "../database/jobModel";
import otpModel from "../database/otpModel";
import postModel from "../database/postModel";
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


    async saveUserdata(userdata: user): Promise<user | null> {
        try {
            let finduser = await userModel.findOne({ email: userdata.email })
            if (finduser) {
                return finduser
            } else {
                let saveUser = new userModel(userdata)
                await saveUser.save()
                if (saveUser) {
                    let data = await userModel.findOne({ email: userdata.email })
                    return data
                } else {
                    return null
                }
            }

        } catch (error) {
            console.error(error);
            throw new Error("Unable to save userdata")

        }
    }
    async resetPassword(user: user): Promise<boolean | null> {
        try {
            let { email, password } = user
            let reset = await userModel.updateOne({ email: email }, { $set: { password: password } })
            if (reset) {
                return reset.acknowledged
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            throw new Error("Unable to reset password")

        }
    }
    async updateProfile(id: string, user: user): Promise<boolean> {
        try {
            let updated = await userModel.updateOne({ _id: id }, user, { new: true })
            return updated.acknowledged

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update userdata")
        }
    }
    async viewjobs(): Promise<jobs[] | null> {
        try {
            let jobs = await jobModel.find({}).populate('company_id')
            return jobs ? jobs : null

        } catch (error) {
            console.error(error);
            throw new Error("Unable to update userdata")
        }
    }

    async getPosts(): Promise<Post[] | null> {
        try {
            let posts = await postModel.find({}).sort({ time: -1 }).populate('company_id')
            return posts ? posts : null
        } catch (error) {
            console.error(error);
            throw new Error("Unable to get posts")
        }
    }
    async likePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            console.log(user_id,"dfdf");
            
            let liked = await postModel.updateOne({ _id: post_id }, { $addToSet: { like: user_id } })
            return liked.acknowledged ? liked.acknowledged : null

        } catch (error) {
            console.error(error);
            throw new Error(`Unable to like post`)
        }
    }
    async unlikePost(post_id: string, user_id: string): Promise<boolean | null> {
        try {
            let unLiked = await postModel.updateOne({ _id: post_id }, { $pull: { like: user_id } })
            return unLiked.acknowledged ? unLiked.acknowledged : null
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to unlike post`)
        }
    }
}


export default userRepository
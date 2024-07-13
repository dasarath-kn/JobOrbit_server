import company from "../../entities/company";
import jobs from "../../entities/jobs";
import { Post } from "../../entities/posts";

interface ICompanyInterface {
    findCompanyByEmail(email: string): Promise<company | null>
    saveCompany(companyData: company): Promise<company | null>
    checkOtp(otp: string): Promise<string | null>
    verifyCompany(email: string): Promise<boolean>
    saveCompanydata(company: company): Promise<company | null>
    getCompanydata(id: string): Promise<company | null>
    resetPassword(company: company): Promise<boolean | null>
    saveJobs(jobData: jobs): Promise<boolean | null>
    getJobs(id: string): Promise<jobs[] | null>
    removeJob(id: string): Promise<boolean>
    savePosts(postData: Post): Promise<boolean>
    getPosts(id: string): Promise<Post[] | null>

}

export default ICompanyInterface
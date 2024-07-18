import admin from "../../entities/admin";
import company from "../../entities/company";
import subscriptions from "../../entities/subscriptions";
import user from "../../entities/user";
export interface CompanyDataResult {
    count: number;
    companyDatas: company[];
}export interface UserDataResult {
    count: number;
    userDatas: user[];
}
interface IAdminInterface {
    findAdminbyEmail(email: string): Promise<admin | null>
    getUserdatas(page: string): Promise<UserDataResult | null>
    getCompanydatas(page: string): Promise<CompanyDataResult | null>
    blockUnblockUsers(user_id: string, status: string): Promise<string>
    blockUnblockCompanies(company_id: string, status: string): Promise<string>
    subscription(subscriptionData: subscriptions): Promise<boolean>
    getsubscriptionplan(): Promise<subscriptions[] | null>
    deletePlan(id:string):Promise<boolean>
    listUnlistPlans(id:string,message:string):Promise<boolean>
}

export default IAdminInterface
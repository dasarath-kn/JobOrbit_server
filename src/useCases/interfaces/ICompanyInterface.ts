import company from "../../entities/company";

interface ICompanyInterface{
    findCompanyByEmail(email:string):Promise<company |null>
    saveCompany(companyData:company):Promise<company |null>
    checkOtp(otp:string):Promise<string | null>
    verifyCompany(email:string):Promise<boolean>
    saveCompanydata(company:company):Promise<company | null>
    getCompanydata(id:string):Promise<company|null>
    resetPassword(company:company):Promise<boolean|null >

}

export default ICompanyInterface
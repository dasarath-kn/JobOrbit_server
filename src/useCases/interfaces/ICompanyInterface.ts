import company from "../../entities/company";

interface ICompanyInterface{
    findCompanyByEmail(email:string):Promise<company |null>
    saveCompany(companyData:company):Promise<company |null>
}

export default ICompanyInterface
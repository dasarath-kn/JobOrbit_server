import company from "../../entities/company"
import CompanyUsecase from "../../useCases/companyUsecase"
import { Response, Request } from "express"
class CompanyController {
    private companyusecase: CompanyUsecase
    constructor(companyusecase: CompanyUsecase) {
        this.companyusecase = companyusecase
    }

    async login(req: Request, res: Response) {
        try {
            let { email, password } = req.body
            let companyDetails = await this.companyusecase.login(email, password)
            let { companyData } = companyDetails
            if (companyDetails.success) {
                let { token } = companyDetails
                res.status(200).json({ success: true, message: companyDetails.message, companyData, token })
            } else {
                res.status(400).json({ success: false, message: companyDetails.message })
            }


        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async signUp(req: Request, res: Response) {
        try {
            const { companyname, email, phonenumber, password, industry, state, city, address, about } = req.body
            const companyData = { companyname, email, phonenumber, password, industry, state, city, address, about }
            const companyExist = await this.companyusecase.signUp(companyData as company)
            let { companySaved } = companyExist
            if (companyExist.success) {
                res.status(200).json({ success: true, message: companyExist.message, companySaved })
            } else {
                res.status(400).json({ success: false, message: companyExist.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })


        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            let { otp } = req.body

            let verfiyOtp = await this.companyusecase.verifyOtp(otp)
            if (verfiyOtp.success) {
                const { token } = verfiyOtp
                res.status(200).json({ success: true, message: verfiyOtp.message, token })
            } else {
                res.status(400).json({ success: false, message: verfiyOtp.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async googleSignup(req: Request, res: Response) {
        try {
            let { name, email, isGoogle } = req.body
            let companyname = name
            let is_google = isGoogle
            let companydata = { companyname, email, is_google }

            let companySaveddata = await this.companyusecase.googleSavecompany(companydata as company)
            if (companySaveddata.success) {
                let { token } = companySaveddata
                res.status(200).json({ success: true, message: companySaveddata.message, token })
            } else {
                res.status(400).json({ success: false, message: companySaveddata.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

}
export default CompanyController
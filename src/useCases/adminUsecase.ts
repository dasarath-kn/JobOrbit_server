import AdminRespositories from "../infrastructure/repositories/adminRepositories"
import HashPassword from "../infrastructure/utils/hashedPassword"
class AdminUsecase {
    private adminRepo: AdminRespositories
    private hashPassword: HashPassword
    constructor(adminRepo: AdminRespositories, hashPassword: HashPassword) {
        this.adminRepo = adminRepo
        this.hashPassword = hashPassword
    }
    async login(email: string, password: string) {
        try {
            let adminExistdata = await this.adminRepo.findAdminbyEmail(email)
            if (adminExistdata) {
                let checkPassword = await this.hashPassword.comparePassword(password, adminExistdata.password)
                if (checkPassword) {
                    if (adminExistdata.is_admin) {
                        return { success: true, adminExistdata, message: 'Admin logined successfully' }
                    } else {
                        return { success: false, message: 'Invalid admin ' }
                    }
                } else {
                    return { success: false, message: 'Invalid Password' }
                }
            } else {
                return { success: false, message: 'Invalid Email' }
            }

        } catch (error) {
            console.error(error)
            throw error

        }
    }
}

export default AdminUsecase
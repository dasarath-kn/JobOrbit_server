import express from 'express'
import adminController from '../../adaptors/controllers/adminController'
import AdminUsecase from '../../useCases/adminUsecase'
import AdminRespositories from '../repositories/adminRepositories'
import HashPassword from '../utils/hashedPassword'
const adminRoute = express.Router()
const adminRepo =new AdminRespositories()
const hashPassword =new HashPassword()
const adminUsecase = new AdminUsecase(adminRepo,hashPassword)
const AdminController =new adminController(adminUsecase)
adminRoute.post('/login',(req,res)=>AdminController.login(req,res))


export default adminRoute
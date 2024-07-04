import express from 'express'
import adminController from '../../adaptors/controllers/adminController'
import AdminUsecase from '../../useCases/adminUsecase'
import AdminRespositories from '../repositories/adminRepositories'
import HashPassword from '../utils/hashedPassword'
import Jwt from '../utils/jwtToken'
const adminRoute = express.Router()
const adminRepo =new AdminRespositories()
const hashPassword =new HashPassword()
const jwt =new Jwt()
const adminUsecase = new AdminUsecase(adminRepo,hashPassword,jwt)
const AdminController =new adminController(adminUsecase)
adminRoute.post('/login',(req,res)=>AdminController.login(req,res))
adminRoute.get('/userdata',(req,res)=>AdminController.getUsers(req,res))
adminRoute.get('/companydata',(req,res)=>AdminController.getComapnies(req,res))
adminRoute.patch('/userblockunblock',(req,res)=>AdminController.userBlockUnblock(req,res))
adminRoute.patch('/companyblockunblock',(req,res)=>AdminController.companyBlockUnblock(req,res))

export default adminRoute
import express from 'express'
import adminController from '../../adaptors/controllers/adminController'
import AdminUsecase from '../../useCases/adminUsecase'
import AdminRespositories from '../repositories/adminRepositories'
import HashPassword from '../utils/hashedPassword'
import Jwt from '../utils/jwtToken'
import adminAuth from '../middlewares/adminAuth'
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
adminRoute.post('/subscription',(req,res)=>AdminController.subscription(req,res))
adminRoute.
route('/getsubscriptionplan')
.get((req,res)=>AdminController.getSubscriptionPlans(req,res))
.delete((req,res)=>AdminController.deletePlan(req,res))
.patch((req,res)=>AdminController.listUnlistPlan(req,res))
adminRoute.get('/dashboarddata',(req,res)=>AdminController.getDashboard(req,res))
adminRoute.get('/getpostdata',(req,res)=>AdminController.getPostreportdata(req,res))

export default adminRoute
import  express from "express";
import userController from '../../adaptors/controllers/userController'
import userUsecase from "../../useCases/userUsecase";
import userRepository from "../repositories/userRepositories";
import HashPassword from "../utils/hashedPassword";
import Otpgenerator from '../utils/otpGenerator'
import NodeMailer from "../utils/nodeMailer";
import Jwt from "../utils/jwtToken";
import userAuth from "../middlewares/userAuth";
const router = express.Router()
const userRepo =new userRepository()
const hashPassword = new HashPassword()
const otpGenerator =new Otpgenerator()
const nodeMailer = new NodeMailer()
const jwttoken = new Jwt()
const userUsecases =new userUsecase(userRepo,hashPassword,otpGenerator,nodeMailer,jwttoken)

const UserController = new userController(userUsecases)
router.post('/signup',(req,res)=>UserController.signup(req,res))
router.post('/login',(req,res)=>UserController.login(req,res))
router.post('/otp',(req,res)=>UserController.otp(req,res))
router.post('/resendotp',(req,res)=>UserController.resendOtp(req,res))
router.get('/getuserdata',userAuth,(req,res)=>UserController.getUserdata(req,res))



export default router
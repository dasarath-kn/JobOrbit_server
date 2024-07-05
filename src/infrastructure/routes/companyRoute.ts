import express from 'express'
import CompanyController from '../../adaptors/controllers/companyController'
import CompanyUsecase from '../../useCases/companyUsecase'
import CompanyRepositories from '../repositories/companyRespositories'
import HashPassword from '../utils/hashedPassword'
import userRepository from '../repositories/userRepositories'
import NodeMailer from '../utils/nodeMailer'
import Otpgenerator from '../utils/otpGenerator'
import Jwt from '../utils/jwtToken'
const companyRoute =express.Router()
const companyRepo =new CompanyRepositories()
const hashedPassword =new HashPassword()
const userRepo = new userRepository()
const nodeMailer = new NodeMailer()
const generateOtp = new Otpgenerator()
const jwt = new Jwt()
const companyUsecase =new CompanyUsecase(companyRepo,hashedPassword,userRepo,generateOtp,nodeMailer,jwt)
const companyController =new CompanyController(companyUsecase)

companyRoute.post('/login',(req,res)=>companyController.login(req,res))
companyRoute.post('/signup',(req,res)=>companyController.signUp(req,res))
companyRoute.post('/otp',(req,res)=>companyController.verifyOtp(req,res))
companyRoute.post('/googlesignup',(req,res)=>companyController.googleSignup(req,res))


export default companyRoute
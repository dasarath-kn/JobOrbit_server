import express from 'express'
import CompanyController from '../../adaptors/controllers/companyController'
import CompanyUsecase from '../../useCases/companyUsecase'
import CompanyRepositories from '../repositories/companyRespositories'
import HashPassword from '../utils/hashedPassword'
import userRepository from '../repositories/userRepositories'
import NodeMailer from '../utils/nodeMailer'
import Otpgenerator from '../utils/otpGenerator'
const companyRoute =express.Router()
const companyRepo =new CompanyRepositories()
const hashedPassword =new HashPassword()
const userRepo = new userRepository()
const nodeMailer = new NodeMailer()
const generateOtp = new Otpgenerator()
const companyUsecase =new CompanyUsecase(companyRepo,hashedPassword,userRepo,generateOtp,nodeMailer)
const companyController =new CompanyController(companyUsecase)

companyRoute.post('/login',(req,res)=>companyController.login(req,res))
companyRoute.post('/signup',(req,res)=>companyController.signUp(req,res))
companyRoute.post('/otp',(req,res)=>companyController.verifyOtp(req,res))


export default companyRoute
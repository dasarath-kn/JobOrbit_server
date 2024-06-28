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
const companyUsecase =new CompanyUsecase(companyRepo,hashedPassword,userRepo,nodeMailer,generateOtp)
const companyController =new CompanyController(companyUsecase)

companyRoute.post('/login',(req,res)=>companyController)
companyRoute.post('/signup',(req,res)=>companyController.signUp(req,res))


export default companyRoute
import express from 'express'
import CompanyController from '../../adaptors/controllers/companyController'
import CompanyUsecase from '../../useCases/companyUsecase'
import CompanyRepositories from '../repositories/companyRespositories'
import HashPassword from '../utils/hashedPassword'
import userRepository from '../repositories/userRepositories'
import NodeMailer from '../utils/nodeMailer'
import Otpgenerator from '../utils/otpGenerator'
import Jwt from '../utils/jwtToken'
import Auth from '../middlewares/userAuth'
import upload from '../middlewares/Multer'
import Cloudinary from '../utils/cloudinary'
const companyRoute =express.Router()
const companyRepo =new CompanyRepositories()
const hashedPassword =new HashPassword()
const userRepo = new userRepository()
const nodeMailer = new NodeMailer()
const generateOtp = new Otpgenerator()
const jwt = new Jwt()
const cloudinary= new Cloudinary()
const companyUsecase =new CompanyUsecase(companyRepo,hashedPassword,userRepo,generateOtp,nodeMailer,jwt,cloudinary)
const companyController =new CompanyController(companyUsecase)

companyRoute.post('/login',(req,res)=>companyController.login(req,res))
companyRoute.post('/signup',(req,res)=>companyController.signUp(req,res))
companyRoute.post('/otp',(req,res)=>companyController.verifyOtp(req,res))
companyRoute.post('/googlesignup',(req,res)=>companyController.googleSignup(req,res))
companyRoute.get('/getcompanydata',Auth,(req,res)=>companyController.getCompanydata(req,res))
companyRoute.post('/verfiyuser',(req,res)=>companyController.verifyCompany(req,res))
companyRoute.patch('/resetpassword',(req,res)=>companyController.resetPassword(req,res))
companyRoute.post('/addjob',Auth,(req,res)=>companyController.addJobs(req,res))
companyRoute.get('/getjobdata',Auth,(req,res)=>companyController.getJobs(req,res))
companyRoute.delete('/deletejob',(req,res)=>companyController.deleteJob(req,res))
companyRoute.post('/addpost',Auth,upload.any(),(req,res)=>companyController.addPost(req,res))
companyRoute.get('/posts',Auth,upload.any(),(req,res)=>companyController.getPosts(req,res))


export default companyRoute
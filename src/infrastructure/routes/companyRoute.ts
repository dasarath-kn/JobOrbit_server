import express from 'express'
import CompanyController from '../../adaptors/controllers/companyController'
import CompanyUsecase from '../../useCases/companyUsecase'
import CompanyRepositories from '../repositories/companyRespositories'
import HashPassword from '../utils/hashedPassword'
import userRepository from '../repositories/userRepositories'
import NodeMailer from '../utils/nodeMailer'
import Otpgenerator from '../utils/otpGenerator'
import Jwt from '../utils/jwtToken'
import companyAuth from '../middlewares/companyAuth'
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
companyRoute.get('/getcompanydata',companyAuth,(req,res)=>companyController.getCompanydata(req,res))
companyRoute.post('/verfiyuser',(req,res)=>companyController.verifyCompany(req,res))
companyRoute.patch('/resetpassword',(req,res)=>companyController.resetPassword(req,res))
companyRoute.post('/addjob',companyAuth,(req,res)=>companyController.addJobs(req,res))
companyRoute.get('/getjobdata',companyAuth,(req,res)=>companyController.getJobs(req,res))
companyRoute.delete('/deletejob',(req,res)=>companyController.deleteJob(req,res))
companyRoute.post('/addpost',companyAuth,upload.any(),(req,res)=>companyController.addPost(req,res))
companyRoute.get('/posts',companyAuth,upload.any(),(req,res)=>companyController.getPosts(req,res))
companyRoute.post('/editprofile',companyAuth,upload.single("image"),(req,res)=>companyController.editProfile(req,res))
companyRoute.patch('/uploaddocument',companyAuth,upload.single("image"),(req,res)=>companyController.uploadDocument(req,res))
companyRoute.delete('/deletepost',companyAuth,(req,res)=>companyController.deletePost(req,res))
companyRoute.get('/applicants',companyAuth,(req,res)=>companyController.jobApplications(req,res))
companyRoute.route('/schedulejob')
.post(companyAuth,(req,res)=>companyController.saveScheduledJobs(req,res))
.get(companyAuth,(req,res)=>companyController.getScheduledJobs(req,res))


export default companyRoute
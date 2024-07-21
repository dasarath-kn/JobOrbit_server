import  express from "express";
import userController from '../../adaptors/controllers/userController'
import userUsecase from "../../useCases/userUsecase";
import userRepository from "../repositories/userRepositories";
import HashPassword from "../utils/hashedPassword";
import Otpgenerator from '../utils/otpGenerator'
import NodeMailer from "../utils/nodeMailer";
import Jwt from "../utils/jwtToken";
import Auth from "../middlewares/userAuth";
import Cloudinary from "../utils/cloudinary";
import upload from "../middlewares/Multer";
import StripePayment from "../utils/stripe";
const router = express.Router()
const userRepo =new userRepository()
const hashPassword = new HashPassword()
const otpGenerator =new Otpgenerator()
const nodeMailer = new NodeMailer()
const jwttoken = new Jwt()
const cloudinary = new Cloudinary()
const stripe =new StripePayment()
const userUsecases =new userUsecase(userRepo,hashPassword,otpGenerator,nodeMailer,jwttoken,cloudinary,stripe)

const UserController = new userController(userUsecases,cloudinary)
router.post('/signup',(req,res)=>UserController.signup(req,res))
router.post('/login',(req,res)=>UserController.login(req,res))
router.post('/otp',(req,res)=>UserController.otp(req,res))
router.post('/resendotp',(req,res)=>UserController.resendOtp(req,res))
router.post('/googlesignup',(req,res)=>UserController.googleSignup(req,res))
router.get('/getuserdata',Auth,(req,res)=>UserController.getUserdata(req,res))
router.post('/verfiyuser',(req,res)=>UserController.verifyUser(req,res))
router.patch('/resetpassword',(req,res)=>UserController.resetPassword(req,res))
router.post('/editprofile',Auth,upload.single("image"),(req,res)=>UserController.editProfile(req,res))
router.patch('/addskills',Auth,(req,res)=>UserController.addSkills(req,res))
router.post('/addexperience',Auth,(req,res)=>UserController.addexperience(req,res))
router.get('/jobs',(req,res)=>UserController.getjobs(req,res))
router.get('/viewjobdetails',(req,res)=>UserController.viewJobdetails(req,res))
router.get('/posts',(req,res)=>UserController.getPosts(req,res))
router.patch('/likeunlike',Auth,(req,res)=>UserController.likeUnlike(req,res))
router.post('/savepost',Auth,(req,res)=>UserController.savePost(req,res))
router.get('/getsavedpost',Auth,(req,res)=>UserController.getsavedPost(req,res))
router.post('/comment',Auth,(req,res)=>UserController.postComment(req,res))
router.get('/getcomment',Auth,(req,res)=>UserController.getcomments(req,res))
router.patch('/jobapply',Auth,(req,res)=>UserController.applyJob(req,res))
router.get('/getsubscriptionplan',Auth,(req,res)=>UserController.getSubscriptionPlans(req,res))
router.post('/paysubscriptionplan',Auth,(req,res)=>UserController.paysubscriptionplan(req,res))
router.post('/webhook',(req,res)=>UserController.webhook(req,res))
router.get('/subscribeduserdetails',Auth,(req,res)=>UserController.findSubscribedUser(req,res))




export default router
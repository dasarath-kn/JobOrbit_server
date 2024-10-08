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
router.patch('/uploadresume',Auth,upload.single("image"),(req,res)=>UserController.uploadResume(req,res))
router.get('/jobs',(req,res)=>UserController.getjobs(req,res))
router.get('/viewjobdetails',Auth,(req,res)=>UserController.viewJobdetails(req,res))
router.get('/posts',(req,res)=>UserController.getPosts(req,res))
router.post('/likeunlike',Auth,(req,res)=>UserController.likeUnlike(req,res))
router.post('/savepost',Auth,(req,res)=>UserController.savePost(req,res))
router.get('/getsavedpost',Auth,(req,res)=>UserController.getsavedPost(req,res))
router.post('/comment',Auth,(req,res)=>UserController.postComment(req,res))
router.get('/getcomment',Auth,(req,res)=>UserController.getcomments(req,res))
router.patch('/jobapply',Auth,(req,res)=>UserController.applyJob(req,res))
router.get('/getsubscriptionplan',Auth,(req,res)=>UserController.getSubscriptionPlans(req,res))
router.post('/paysubscriptionplan',Auth,(req,res)=>UserController.paysubscriptionplan(req,res))
router.post('/webhook',(req,res)=>UserController.webhook(req,res))
router.get('/subscribeduserdetails',Auth,(req,res)=>UserController.findSubscribedUser(req,res))
router.post('/reportpost',Auth,(req,res)=>UserController.reportPost(req,res))
router.get('/appliedjobs',Auth,(req,res)=>UserController.appliedJobs(req,res))
router.get('/getusers',Auth,(req,res)=>UserController.getUsers(req,res))
router.get('/getcompanies',(req,res)=>UserController.getComapnies(req,res))
router.get('/getcompany',Auth,(req,res)=>UserController.getCompany(req,res))
router.get('/getuser',Auth,(req,res)=>UserController.findUser(req,res))
router.get('/getreviews',Auth,(req,res)=>UserController.getReviews(req,res))
router.post('/savereviews',Auth,(req,res)=>UserController.postReview(req,res))
router.patch('/connectuser',Auth,(req,res)=>UserController.newConnection(req,res))
router.patch('/connectcompany',Auth,(req,res)=>UserController.newCompanyConnection(req,res))
router.get('/messages',Auth,(req,res)=>UserController.getMessages(req,res))
router.get('/connection',Auth,(req,res)=>UserController.connectRequests(req,res))
router.patch('/manageconnection',Auth,(req,res)=>UserController.manageConnection(req,res))
router.post('/inbox',Auth,(req,res)=>UserController.saveInbox(req,res))
router.get('/conversation',Auth,(req,res)=>UserController.conversationData(req,res))
router.delete('/removeskill',Auth,(req,res)=>UserController.removeSkill(req,res))
router.delete('/removeexperience',Auth,(req,res)=>UserController.removeExperience(req,res))
router.patch('/rewards',Auth,upload.single("image"),(req,res)=>UserController.addReward(req,res))
router.post('/sharedocument',Auth,upload.single("image"),(req,res)=>UserController.addDocument(req,res))
router.get('/likedposts',Auth,(req,res)=>UserController.likedPost(req,res))



export default router
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = __importDefault(require("../../adaptors/controllers/companyController"));
const companyUsecase_1 = __importDefault(require("../../useCases/companyUsecase"));
const companyRespositories_1 = __importDefault(require("../repositories/companyRespositories"));
const hashedPassword_1 = __importDefault(require("../utils/hashedPassword"));
const userRepositories_1 = __importDefault(require("../repositories/userRepositories"));
const nodeMailer_1 = __importDefault(require("../utils/nodeMailer"));
const otpGenerator_1 = __importDefault(require("../utils/otpGenerator"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const companyAuth_1 = __importDefault(require("../middlewares/companyAuth"));
const Multer_1 = __importDefault(require("../middlewares/Multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const companyRoute = express_1.default.Router();
const companyRepo = new companyRespositories_1.default();
const hashedPassword = new hashedPassword_1.default();
const userRepo = new userRepositories_1.default();
const nodeMailer = new nodeMailer_1.default();
const generateOtp = new otpGenerator_1.default();
const jwt = new jwtToken_1.default();
const cloudinary = new cloudinary_1.default();
const companyUsecase = new companyUsecase_1.default(companyRepo, hashedPassword, userRepo, generateOtp, nodeMailer, jwt, cloudinary);
const companyController = new companyController_1.default(companyUsecase);
companyRoute.post('/login', (req, res) => companyController.login(req, res));
companyRoute.post('/signup', (req, res) => companyController.signUp(req, res));
companyRoute.post('/otp', (req, res) => companyController.verifyOtp(req, res));
companyRoute.post('/googlesignup', (req, res) => companyController.googleSignup(req, res));
companyRoute.get('/getcompanydata', companyAuth_1.default, (req, res) => companyController.getCompanydata(req, res));
companyRoute.post('/verfiyuser', (req, res) => companyController.verifyCompany(req, res));
companyRoute.patch('/resetpassword', (req, res) => companyController.resetPassword(req, res));
companyRoute.post('/addjob', companyAuth_1.default, (req, res) => companyController.addJobs(req, res));
companyRoute.get('/getjobdata', companyAuth_1.default, (req, res) => companyController.getJobs(req, res));
companyRoute.delete('/deletejob', (req, res) => companyController.deleteJob(req, res));
companyRoute.post('/addpost', companyAuth_1.default, Multer_1.default.any(), (req, res) => companyController.addPost(req, res));
companyRoute.get('/posts', companyAuth_1.default, Multer_1.default.any(), (req, res) => companyController.getPosts(req, res));
companyRoute.get('/getcomment', companyAuth_1.default, (req, res) => companyController.getcomments(req, res));
companyRoute.post('/editprofile', companyAuth_1.default, Multer_1.default.single("image"), (req, res) => companyController.editProfile(req, res));
companyRoute.patch('/uploaddocument', companyAuth_1.default, Multer_1.default.single("image"), (req, res) => companyController.uploadDocument(req, res));
companyRoute.delete('/deletepost', companyAuth_1.default, (req, res) => companyController.deletePost(req, res));
companyRoute.get('/applicants', companyAuth_1.default, (req, res) => companyController.jobApplications(req, res));
companyRoute.route('/schedulejob')
    .post(companyAuth_1.default, (req, res) => companyController.saveScheduledJobs(req, res))
    .get(companyAuth_1.default, (req, res) => companyController.getScheduledJobs(req, res))
    .patch(companyAuth_1.default, (req, res) => companyController.deleteApplicant(req, res));
companyRoute.get('/findschedulejob', companyAuth_1.default, (req, res) => companyController.ScheduledJobs(req, res));
companyRoute.get('/getreviews', companyAuth_1.default, (req, res) => companyController.getReviews(req, res));
companyRoute.get('/messages', companyAuth_1.default, (req, res) => companyController.getMessages(req, res));
companyRoute.patch('/replycomment', companyAuth_1.default, (req, res) => companyController.replyComment(req, res));
companyRoute.get('/conversation', companyAuth_1.default, (req, res) => companyController.conversationData(req, res));
companyRoute.patch('/listjob', companyAuth_1.default, (req, res) => companyController.listJob(req, res));
exports.default = companyRoute;

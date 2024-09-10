"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../adaptors/controllers/userController"));
const userUsecase_1 = __importDefault(require("../../useCases/userUsecase"));
const userRepositories_1 = __importDefault(require("../repositories/userRepositories"));
const hashedPassword_1 = __importDefault(require("../utils/hashedPassword"));
const otpGenerator_1 = __importDefault(require("../utils/otpGenerator"));
const nodeMailer_1 = __importDefault(require("../utils/nodeMailer"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const Multer_1 = __importDefault(require("../middlewares/Multer"));
const stripe_1 = __importDefault(require("../utils/stripe"));
const router = express_1.default.Router();
const userRepo = new userRepositories_1.default();
const hashPassword = new hashedPassword_1.default();
const otpGenerator = new otpGenerator_1.default();
const nodeMailer = new nodeMailer_1.default();
const jwttoken = new jwtToken_1.default();
const cloudinary = new cloudinary_1.default();
const stripe = new stripe_1.default();
const userUsecases = new userUsecase_1.default(userRepo, hashPassword, otpGenerator, nodeMailer, jwttoken, cloudinary, stripe);
const UserController = new userController_1.default(userUsecases, cloudinary);
router.post('/signup', (req, res) => UserController.signup(req, res));
router.post('/login', (req, res) => UserController.login(req, res));
router.post('/otp', (req, res) => UserController.otp(req, res));
router.post('/resendotp', (req, res) => UserController.resendOtp(req, res));
router.post('/googlesignup', (req, res) => UserController.googleSignup(req, res));
router.get('/getuserdata', userAuth_1.default, (req, res) => UserController.getUserdata(req, res));
router.post('/verfiyuser', (req, res) => UserController.verifyUser(req, res));
router.patch('/resetpassword', (req, res) => UserController.resetPassword(req, res));
router.post('/editprofile', userAuth_1.default, Multer_1.default.single("image"), (req, res) => UserController.editProfile(req, res));
router.patch('/addskills', userAuth_1.default, (req, res) => UserController.addSkills(req, res));
router.post('/addexperience', userAuth_1.default, (req, res) => UserController.addexperience(req, res));
router.patch('/uploadresume', userAuth_1.default, Multer_1.default.single("image"), (req, res) => UserController.uploadResume(req, res));
router.get('/jobs', (req, res) => UserController.getjobs(req, res));
router.get('/viewjobdetails', userAuth_1.default, (req, res) => UserController.viewJobdetails(req, res));
router.get('/posts', (req, res) => UserController.getPosts(req, res));
router.patch('/likeunlike', userAuth_1.default, (req, res) => UserController.likeUnlike(req, res));
router.post('/savepost', userAuth_1.default, (req, res) => UserController.savePost(req, res));
router.get('/getsavedpost', userAuth_1.default, (req, res) => UserController.getsavedPost(req, res));
router.post('/comment', userAuth_1.default, (req, res) => UserController.postComment(req, res));
router.get('/getcomment', userAuth_1.default, (req, res) => UserController.getcomments(req, res));
router.patch('/jobapply', userAuth_1.default, (req, res) => UserController.applyJob(req, res));
router.get('/getsubscriptionplan', userAuth_1.default, (req, res) => UserController.getSubscriptionPlans(req, res));
router.post('/paysubscriptionplan', userAuth_1.default, (req, res) => UserController.paysubscriptionplan(req, res));
router.post('/webhook', (req, res) => UserController.webhook(req, res));
router.get('/subscribeduserdetails', userAuth_1.default, (req, res) => UserController.findSubscribedUser(req, res));
router.post('/reportpost', userAuth_1.default, (req, res) => UserController.reportPost(req, res));
router.get('/appliedjobs', userAuth_1.default, (req, res) => UserController.appliedJobs(req, res));
router.get('/getusers', userAuth_1.default, (req, res) => UserController.getUsers(req, res));
router.get('/getcompanies', (req, res) => UserController.getComapnies(req, res));
router.get('/getcompany', userAuth_1.default, (req, res) => UserController.getCompany(req, res));
router.get('/getuser', userAuth_1.default, (req, res) => UserController.findUser(req, res));
router.get('/getreviews', userAuth_1.default, (req, res) => UserController.getReviews(req, res));
router.post('/savereviews', userAuth_1.default, (req, res) => UserController.postReview(req, res));
router.patch('/connectuser', userAuth_1.default, (req, res) => UserController.newConnection(req, res));
router.patch('/connectcompany', userAuth_1.default, (req, res) => UserController.newCompanyConnection(req, res));
router.get('/messages', userAuth_1.default, (req, res) => UserController.getMessages(req, res));
router.get('/connection', userAuth_1.default, (req, res) => UserController.connectRequests(req, res));
router.patch('/manageconnection', userAuth_1.default, (req, res) => UserController.manageConnection(req, res));
router.post('/inbox', userAuth_1.default, (req, res) => UserController.saveInbox(req, res));
router.get('/conversation', userAuth_1.default, (req, res) => UserController.conversationData(req, res));
router.delete('/removeskill', userAuth_1.default, (req, res) => UserController.removeSkill(req, res));
router.delete('/removeexperience', userAuth_1.default, (req, res) => UserController.removeExperience(req, res));
router.patch('/rewards', userAuth_1.default, (req, res) => UserController.addReward(req, res));
exports.default = router;

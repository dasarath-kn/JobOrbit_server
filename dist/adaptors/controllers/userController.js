"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expiryDate_1 = __importDefault(require("../../infrastructure/utils/expiryDate"));
class userController {
    constructor(userUsecases, cloud) {
        this.userUsecases = userUsecases;
        this.Cloudinary = cloud;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, email, password, phonenumber, field, location } = req.body;
                const userData = { firstname, lastname, email, password, phonenumber, field, location };
                const exists = yield this.userUsecases.findUser(userData);
                console.log(exists);
                if (!exists.data) {
                    const { userSaved } = exists;
                    res.status(200).json({ success: true, message: "saved user", userSaved });
                }
                else {
                    console.log("Email already exist");
                    res.status(400).json({ success: false, message: 'Email already exist' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userExist = yield this.userUsecases.login(email, password);
                if (userExist.success) {
                    const { userExistdata } = userExist;
                    console.log(userExistdata);
                    const { token } = userExist;
                    res.status(200).json({ message: userExist.message, userExistdata, token });
                }
                else {
                    res.status(400).json({ message: userExist.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                const verifiedOtp = yield this.userUsecases.verfiyOtp(otp);
                const { token } = verifiedOtp;
                if (verifiedOtp.success) {
                    res.status(200).json({ message: verifiedOtp.message, token });
                }
                else {
                    res.status(400).json({ message: verifiedOtp.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log(email);
                const resendOtp = yield this.userUsecases.resendOtp(email);
                if (resendOtp.success) {
                    res.status(200).json({ success: true, message: resendOtp.message });
                }
                else {
                    res.status(200).json({ success: false, message: "Failed to sent otp" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    getUserdata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const data = yield this.userUsecases.userData(id);
                if (data.success) {
                    const { userData } = data;
                    res.status(200).json({ success: true, message: data.message, userData });
                }
                else {
                    res.status(400).json({ success: false, message: data.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    googleSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, isGoogle } = req.body;
                const firstname = name;
                const is_google = isGoogle;
                const userdata = { firstname, email, is_google, is_verified: true };
                const userSaveddata = yield this.userUsecases.googleSaveuser(userdata);
                if (userSaveddata === null || userSaveddata === void 0 ? void 0 : userSaveddata.success) {
                    const { token } = userSaveddata;
                    res.status(200).json({ success: true, message: userSaveddata.message, token });
                }
                else {
                    res.status(400).json({ success: false, message: userSaveddata === null || userSaveddata === void 0 ? void 0 : userSaveddata.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log(req.body);
                const userData = yield this.userUsecases.userExist(email);
                if (userData.success) {
                    const { Userdata } = userData;
                    res.status(200).json({ success: true, message: userData.message, Userdata });
                }
                else {
                    res.status(400).json({ success: false, message: userData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userdata = { email, password };
                const resetpassword = yield this.userUsecases.passwordReset(userdata);
                if (resetpassword.success) {
                    res.status(200).json({ success: true, message: resetpassword.message });
                }
                else {
                    res.status(400).json({ success: false, message: resetpassword.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editProfile(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { firstname, lastname, field, location, github_url, portfolio_url, about, qualification, img_url, percentage } = req.body;
                const percentages = Number(percentage);
                const userData = { firstname, lastname, field, location, github_url, portfolio_url, about, qualification, img_url };
                console.log(req.body);
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                const editProfile = yield this.userUsecases.updateProfile(id, userData, file, percentages);
                if (editProfile.success) {
                    const { userData } = editProfile;
                    res.status(200).json({ success: true, message: editProfile.message, userData });
                }
                else {
                    res.status(400).json({ success: false, message: editProfile.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skill, percentage } = req.body;
                const { id } = req;
                const addskills = yield this.userUsecases.manageSkill(skill, id, percentage);
                if (addskills.success) {
                    res.status(200).json({ success: true, message: addskills.message });
                }
                else {
                    res.status(400).json({ success: false, message: addskills.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getjobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, type, location, date, user_id } = req.query;
                const findJobs = yield this.userUsecases.jobs(page, type, location, date, user_id);
                if (findJobs.success) {
                    const { jobs, count } = findJobs;
                    res.status(200).json({ success: true, message: findJobs.message, jobs, count });
                }
                else {
                    res.status(400).json({ success: false, message: findJobs.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page } = req.query;
                const getPosts = yield this.userUsecases.posts(page);
                if (getPosts.success) {
                    const { posts } = getPosts;
                    res.status(200).json({ success: true, messge: getPosts.message, posts });
                }
                else {
                    res.status(400).json({ success: false, message: getPosts.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    likeUnlike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post_id, status } = req.query;
                const { id } = req;
                const userid = id;
                const manageLikeUnlike = yield this.userUsecases.manageLikeUnlike(post_id, userid, status);
                if (manageLikeUnlike.success) {
                    res.status(200).json({ success: true, message: manageLikeUnlike.message });
                }
                else {
                    res.status(400).json({ success: false, message: manageLikeUnlike.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { post_id, message, company_id } = req.body;
                const postData = { user_id: id, post_id, company_id };
                const savedPost = yield this.userUsecases.postSave(postData, message);
                if (savedPost.success) {
                    res.status(200).json({ success: true, message: savedPost.message });
                }
                else {
                    res.status(400).json({ success: false, message: savedPost.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getsavedPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const getsavedPosts = yield this.userUsecases.savedPosts(id);
                if (getsavedPosts.success) {
                    const { savedPosts } = getsavedPosts;
                    res.status(200).json({ success: true, message: getsavedPosts.success, savedPosts });
                }
                else {
                    res.status(400).json({ success: false, message: getsavedPosts.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    postComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { post_id, message, company_id } = req.body;
                const commentData = { user_id: id, post_id, company_id, message };
                const comments = yield this.userUsecases.shareComment(commentData);
                if (comments.success) {
                    res.status(200).json({ success: true, message: comments.message });
                }
                else {
                    res.status(400).json({ success: false, message: comments.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getcomments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post_id } = req.query;
                const comment = yield this.userUsecases.comments(post_id);
                if (comment.message) {
                    const { comments } = comment;
                    res.status(200).json({ success: true, message: comment.message, comments });
                }
                else {
                    res.status(400).json({ success: false, message: comment.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    viewJobdetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id } = req.query;
                const { id } = req;
                const details = yield this.userUsecases.jobDetails(job_id, id);
                if (details.success) {
                    const { jobDetails, plan_id } = details;
                    res.status(200).json({ success: true, message: details.message, jobDetails, plan_id });
                }
                else {
                    res.status(400).json({ success: false, message: details.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addexperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { experiencefield, mode, start_date, end_date, responsibilities, percentage } = req.body;
                const experienceData = { experiencefield, mode, start_date, end_date, responsibilities };
                const percentages = Number(percentage);
                const addexperience = yield this.userUsecases.experience(experienceData, percentages, id);
                if (addexperience.success) {
                    res.status(200).json({ success: true, message: addexperience.message });
                }
                else {
                    res.status(400).json({ success: false, message: addexperience.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    uploadResume(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.file);
                const { id } = req;
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                const { percentage } = req.body;
                const percentages = Number(percentage);
                const upload = yield this.userUsecases.resume(id, file, percentages);
                if (upload.success) {
                    res.status(200).json({ success: true, message: upload.message });
                }
                else {
                    res.status(400).json({ success: false, message: upload.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    applyJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { job_id, company_id, resume_url } = req.body;
                const applyJob = yield this.userUsecases.jobApplication(job_id, id, company_id, resume_url);
                if (applyJob.success) {
                    res.status(200).json({ success: true, message: applyJob.message });
                }
                else {
                    res.status(400).json({ success: false, message: applyJob.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getSubscriptionPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionData = yield this.userUsecases.subscriptionPlans();
                if (subscriptionData.success) {
                    const { subscriptionplan } = subscriptionData;
                    res.status(200).json({ success: true, message: subscriptionData.message, subscriptionplan });
                }
                else {
                    res.status(400).json({ success: false, message: subscriptionData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    paysubscriptionplan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { plan_id, expiry_date } = req.body;
                const { id } = req;
                const date = yield (0, expiryDate_1.default)(expiry_date);
                const subscriptionData = { user_id: id, session_id: '', plan_id: plan_id, expiry_date: date };
                const payment = yield this.userUsecases.subscriptionPayment(plan_id, subscriptionData);
                if (payment.success) {
                    const { payment_id } = payment;
                    res.status(200).json({ success: true, payment_id });
                }
                else {
                    res.status(400).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const webhook = yield this.userUsecases.updateSubscribedUsers(data);
                if (webhook === null || webhook === void 0 ? void 0 : webhook.success) {
                    res.status(200).json({ success: true, message: webhook.message });
                }
                else {
                    res.status(400).json({ success: false, message: webhook === null || webhook === void 0 ? void 0 : webhook.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findSubscribedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const findSubscribedUser = yield this.userUsecases.subscribedUserdetails(id);
                if (findSubscribedUser.success) {
                    const { subscribedUser } = findSubscribedUser;
                    res.status(200).json({ success: true, message: findSubscribedUser.messsage, subscribedUser });
                }
                else {
                    res.status(400).json({ success: false, message: findSubscribedUser.messsage });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { post_id, report_message } = req.body;
                const date = Date.now();
                const postreportData = { user_id: id, report_message, date };
                console.log(postreportData, "ddlj");
                const report = yield this.userUsecases.postReportsave(post_id, postreportData);
                if (report.success) {
                    res.status(200).json({ success: true, message: report.message });
                }
                else {
                    res.status(400).json({ success: false, message: report.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    appliedJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { page } = req.query;
                const applied = yield this.userUsecases.findAppliedJobsByUserid(id, page);
                if (applied.success) {
                    const { jobs, count } = applied;
                    res.status(200).json({ success: true, message: applied.message, appliedJobs: jobs, count });
                }
                else {
                    res.status(400).json({ success: false, message: applied.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield this.userUsecases.findUsers();
                if (userDetails.success) {
                    const { userDatas } = userDetails;
                    res.status(200).json({ success: true, message: userDetails.message, userDatas });
                }
                else {
                    res.status(400).json({ success: false, message: userDetails === null || userDetails === void 0 ? void 0 : userDetails.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getComapnies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyDetails = yield this.userUsecases.findCompanies();
                if (companyDetails.success) {
                    const { companyDatas } = companyDetails;
                    res.status(200).json({ success: true, messsage: companyDetails.message, companyDatas });
                }
                else {
                    res.status(400).json({ success: true, message: companyDetails.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const company = yield this.userUsecases.viewCompany(id);
                if (company.success) {
                    const { companyData } = company;
                    res.status(200).json({ success: true, message: company.message, companyData });
                }
                else {
                    res.status(400).json({ success: true, message: company.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const user = yield this.userUsecases.findUserdetails(id);
                if (user === null || user === void 0 ? void 0 : user.success) {
                    const { userData } = user;
                    res.status(200).json({ success: true, message: user.message, userData });
                }
                else {
                    res.status(400).json({ success: false, message: user === null || user === void 0 ? void 0 : user.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    postReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rating_count, review, company_id } = req.body;
                const { id } = req;
                const reviewData = { rating_count, review, user_id: id, date: Date.now(), company_id };
                const reviews = yield this.userUsecases.addreviews(reviewData);
                if (reviews.success) {
                    res.status(200).json({ success: true, message: reviews.message });
                }
                else {
                    res.status(400).json({ success: false, message: reviews.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const reviewDatas = yield this.userUsecases.reviews(id);
                if (reviewDatas.success) {
                    const { reviews } = reviewDatas;
                    res.status(200).json({ success: true, message: reviewDatas.message, reviews });
                }
                else {
                    res.status(400).json({ success: false, messagwe: reviewDatas.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    connectUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    newConnection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { connection_id } = req.body;
                const connection = yield this.userUsecases.addConnection(id, connection_id);
                if (connection.success) {
                    res.status(200).json({ success: true, message: connection.message });
                }
                else {
                    res.status(400).json({ success: false, message: connection.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                const { id } = req;
                console.log();
                const reciever_id = _id;
                const sender_id = id;
                const messageData = yield this.userUsecases.message(reciever_id, sender_id);
                if (messageData.success) {
                    const { messages } = messageData;
                    res.status(200).json({ success: true, message: messageData.message, messages });
                }
                else {
                    res.status(400).json({ success: false, message: messageData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    newCompanyConnection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { company_id } = req.body;
                console.log(req.body);
                const connection = yield this.userUsecases.addCompanyConnection(id, company_id);
                if (connection.success) {
                    res.status(200).json({ success: true, message: connection.message });
                }
                else {
                    res.status(400).json({ success: false, message: connection.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    connectRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const connection = yield this.userUsecases.connections(id);
                if (connection.success) {
                    const { connectRequests } = connection;
                    res.status(200).json({ success: true, message: connection.message, connectRequests });
                }
                else {
                    res.status(400).json({ success: false, message: connection.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    manageConnection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const { connection_id, notification_id, message } = req.body;
                const manage = yield this.userUsecases.connectionManage(id, connection_id, notification_id, message);
                if (manage.success) {
                    res.status(200).json({ success: true, message: manage.message });
                }
                else {
                    res.status(400).json({ success: false, message: manage.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    saveInbox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reciever_id, role } = req.body;
                const { id } = req;
                const sender_id = id;
                const saveData = yield this.userUsecases.inbox(sender_id, reciever_id, role);
                if (saveData.success) {
                    res.status(200).json({ success: true, message: saveData.message });
                }
                else {
                    res.status(400).json({ success: false, message: saveData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    conversationData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const sender_id = id;
                const { role } = req.query;
                const data = yield this.userUsecases.conversation(sender_id, role);
                if (data.success) {
                    const { conversationData } = data;
                    res.status(200).json({ success: true, message: data.message, conversationData });
                }
                else {
                    res.status(400).json({ success: false, message: data.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    removeSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skill } = req.query;
                const { id } = req;
                const remove = yield this.userUsecases.deleteSkills(skill, id);
                if (remove.success) {
                    res.status(200).json({ success: true, message: remove.message });
                }
                else {
                    res.status(400).json({ success: false, message: remove.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    removeExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { field } = req.query;
                const { id } = req;
                const remove = yield this.userUsecases.deleteExperience(field, id);
                if (remove.success) {
                    res.status(200).json({ success: true, message: remove.message });
                }
                else {
                    res.status(400).json({ success: false, message: remove.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addReward(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { awardtitle, issuedby, details } = req.body;
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.default = userController;

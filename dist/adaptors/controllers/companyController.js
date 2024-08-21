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
const mongoose_1 = __importDefault(require("mongoose"));
class CompanyController {
    constructor(companyusecase) {
        this.companyusecase = companyusecase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                let companyDetails = yield this.companyusecase.login(email, password);
                let { companyData } = companyDetails;
                if (companyDetails.success) {
                    let { token } = companyDetails;
                    res.status(200).json({ success: true, message: companyDetails.message, companyData, token });
                }
                else {
                    res.status(400).json({ success: false, message: companyDetails.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyname, email, phonenumber, password, industry, state, city, address, about } = req.body;
                const companyData = { companyname, email, phonenumber, password, industry, state, city, address, about };
                const companyExist = yield this.companyusecase.signUp(companyData);
                let { companySaved } = companyExist;
                if (companyExist.success) {
                    res.status(200).json({ success: true, message: companyExist.message, companySaved });
                }
                else {
                    res.status(400).json({ success: false, message: companyExist.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { otp } = req.body;
                let verfiyOtp = yield this.companyusecase.verifyOtp(otp);
                if (verfiyOtp.success) {
                    const { token } = verfiyOtp;
                    res.status(200).json({ success: true, message: verfiyOtp.message, token });
                }
                else {
                    res.status(400).json({ success: false, message: verfiyOtp.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    googleSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, email, isGoogle } = req.body;
                let companyname = name;
                let is_google = isGoogle;
                let companydata = { companyname, email, is_google };
                let companySaveddata = yield this.companyusecase.googleSavecompany(companydata);
                if (companySaveddata.success) {
                    let { token } = companySaveddata;
                    res.status(200).json({ success: true, message: companySaveddata.message, token });
                }
                else {
                    res.status(400).json({ success: false, message: companySaveddata.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getCompanydata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req;
                let companyData = yield this.companyusecase.companData(id);
                if (companyData.success) {
                    let { companydata } = companyData;
                    res.status(200).json({ success: true, message: companyData.message, companydata });
                }
                else {
                    res.status(400).json({ success: false, message: companyData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    verifyCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                let companydata = yield this.companyusecase.companyExist(email);
                console.log(companydata);
                if (companydata.success) {
                    const { companyData } = companydata;
                    res.status(200).json({ success: true, message: companydata.message, companyData });
                }
                else {
                    res.status(400).json({ success: false, message: companydata.message });
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
                let { email, password } = req.body;
                const companydata = { email, password };
                console.log(req.body);
                let resetpassword = yield this.companyusecase.passwordReset(companydata);
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
    addJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const company_id = id;
                let { jobtitle, description, responsibilities, requirements, qualification, location, type, skills } = req.body;
                const jobData = { description, responsibilities, requirements, skills, qualification, jobtitle, location, type, company_id: new mongoose_1.default.Types.ObjectId(company_id) };
                let jobs = yield this.companyusecase.savingJobs(jobData);
                if (jobs.success) {
                    res.status(200).json({ success: true, message: jobs.message });
                }
                else {
                    res.status(400).json({ success: false, message: jobs.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req;
                const { page } = req.query;
                let jobData = yield this.companyusecase.jobs(id, page);
                if (jobData.success) {
                    const { jobs, count } = jobData;
                    res.status(200).json({ success: true, message: jobData.message, jobs, count });
                }
                else {
                    res.status(400).json({ success: false, message: jobData.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let removed = yield this.companyusecase.jobRemove(id);
                if (removed.success) {
                    res.status(200).json({ success: true, message: removed.message });
                }
                else {
                    res.status(400).json({ success: false, message: removed.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const company_id = id;
                const files = Array.isArray(req.files) ? req.files.map((val) => val.path) : [];
                const { description } = req.body;
                const postData = { company_id, description, images: [] };
                let post = yield this.companyusecase.savePost(postData, files);
                if (post.success) {
                    res.status(200).json({ success: true, message: post.message });
                }
                else {
                    res.status(400).json({ success: false, message: post.message });
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
                const { id } = req;
                let postDatas = yield this.companyusecase.Posts(id);
                if (postDatas.success) {
                    const { posts } = postDatas;
                    res.status(200).json({ success: true, message: postDatas, posts });
                }
                else {
                    res.status(400).json({ success: false, message: postDatas.message });
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
                const { companyname, city, industry, address, website_url, about } = req.body;
                const companyData = { companyname, city, industry, address, website_url, about, img_url: '' };
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                let editProfile = yield this.companyusecase.updateProfile(id, companyData, file);
                if (editProfile.success) {
                    const { companyData } = editProfile;
                    res.status(200).json({ success: true, message: editProfile.message, companyData });
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
    uploadDocument(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                const upload = yield this.companyusecase.documentUpload(id, file);
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
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                console.log(id);
                let removepost = yield this.companyusecase.removePost(id);
                if (removepost === null || removepost === void 0 ? void 0 : removepost.success) {
                    res.status(200).json({ success: true, message: removepost.message });
                }
                else {
                    res.status(400).json({ success: false, message: removepost === null || removepost === void 0 ? void 0 : removepost.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    jobApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id } = req.query;
                let appllications = yield this.companyusecase.userAppliedJobs(job_id);
                if (appllications.success) {
                    const { appliedUsers } = appllications;
                    res.status(200).json({ success: true, message: appllications.message, appliedUsers });
                }
                else {
                    res.status(400).json({ success: false, message: appllications.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    saveScheduledJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { time, date, message, user_id, job_id } = req.body;
                const { id } = req;
                console.log(req.body);
                const jobScheduleddata = { time, date, message, user_id, job_id, company_id: id, scheduled_time: Date.now() };
                let saveData = yield this.companyusecase.scheduledJobs(jobScheduleddata);
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
    getScheduledJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id } = req.query;
                let scheduledjob = yield this.companyusecase.scheduled(job_id);
                if (scheduledjob.success) {
                    const { scheduledJobdata } = scheduledjob;
                    res.status(200).json({ success: true, message: scheduledjob.message, scheduledJobdata });
                }
                else {
                    res.status(400).json({ success: false, message: scheduledjob.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    ScheduledJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                let scheduled = yield this.companyusecase.getScheduledJobs(id);
                if (scheduled.success) {
                    const { scheduledJobs } = scheduled;
                    console.log(scheduled, "d");
                    res.status(200).json({ success: true, message: scheduled.message, scheduledJobs });
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
                const { id } = req;
                const reviewDatas = yield this.companyusecase.reviews(id);
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
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.query;
                const { id } = req;
                const reciever_id = _id;
                const sender_id = id;
                const messageData = yield this.companyusecase.message(reciever_id, sender_id);
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
    getcomments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post_id } = req.query;
                const comment = yield this.companyusecase.comments(post_id);
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
    replyComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { comment_id, reply } = req.body;
                const commentReply = yield this.companyusecase.commentReply(comment_id, reply);
                if (commentReply.success) {
                    res.status(200).json({ success: true, message: commentReply.message });
                }
                else {
                    res.status(400).json({ success: false, message: commentReply.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    deleteApplicant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id, user_id } = req.body;
                const remove = yield this.companyusecase.removeApplicant(job_id, user_id);
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
    conversationData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req;
                const reciever_id = id;
                const data = yield this.companyusecase.conversation(reciever_id);
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
}
exports.default = CompanyController;
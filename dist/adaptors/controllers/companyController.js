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
const fs_1 = __importDefault(require("fs"));
class CompanyController {
    constructor(companyusecase) {
        this.companyusecase = companyusecase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const companyDetails = yield this.companyusecase.login(email, password);
                const { companyData } = companyDetails;
                if (companyDetails.success) {
                    const { token } = companyDetails;
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
                const { companySaved } = companyExist;
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
                const { otp } = req.body;
                const verfiyOtp = yield this.companyusecase.verifyOtp(otp);
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
                const { name, email, isGoogle } = req.body;
                const companyname = name;
                const is_google = isGoogle;
                const companydata = { companyname, email, is_google, is_verified: true };
                const companySaveddata = yield this.companyusecase.googleSavecompany(companydata);
                if (companySaveddata.success) {
                    const { token } = companySaveddata;
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
                const { id } = req;
                const companyData = yield this.companyusecase.companData(id);
                if (companyData.success) {
                    const { companydata } = companyData;
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
                const { email } = req.body;
                const companydata = yield this.companyusecase.companyExist(email);
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
                const { email, password } = req.body;
                const companydata = { email, password };
                console.log(req.body);
                const resetpassword = yield this.companyusecase.passwordReset(companydata);
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
                const { jobtitle, description, responsibilities, requirements, qualification, location, type, skills, closedate, _id } = req.body;
                const job_id = _id ? _id : "";
                const jobData = { description, responsibilities, requirements, skills, qualification, jobtitle, location, type, company_id: new mongoose_1.default.Types.ObjectId(company_id), unlistTime: closedate, closedate };
                const jobs = yield this.companyusecase.savingJobs(jobData, job_id);
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
                const { id } = req;
                const { page } = req.query;
                const jobData = yield this.companyusecase.jobs(id, page);
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
                const { id } = req.query;
                const removed = yield this.companyusecase.jobRemove(id);
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
                const post = yield this.companyusecase.savePost(postData, files);
                if (post.success) {
                    for (const filePath of files) {
                        fs_1.default.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error removing file ${filePath}:`, err);
                            }
                            else {
                                console.log(`Successfully removed file ${filePath}`);
                            }
                        });
                    }
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
                const postDatas = yield this.companyusecase.Posts(id);
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
                const editProfile = yield this.companyusecase.updateProfile(id, companyData, file);
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
                const { id } = req.query;
                console.log(id);
                const removepost = yield this.companyusecase.removePost(id);
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
                const appllications = yield this.companyusecase.userAppliedJobs(job_id);
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
                const saveData = yield this.companyusecase.scheduledJobs(jobScheduleddata);
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
                const scheduledjob = yield this.companyusecase.scheduled(job_id);
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
                const scheduled = yield this.companyusecase.getScheduledJobs(id);
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
    listJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id, status } = req.body;
                console.log(req.body);
                const handleListJob = yield this.companyusecase.jobList(job_id, status);
                if (handleListJob.success) {
                    res.status(200).json({ success: true, message: handleListJob.message });
                }
                else {
                    res.status(400).json({ success: false, message: handleListJob.message });
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

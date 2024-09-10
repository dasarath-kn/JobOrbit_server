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
const commentModel_1 = __importDefault(require("../database/commentModel"));
const companyModel_1 = __importDefault(require("../database/companyModel"));
const inboxModel_1 = __importDefault(require("../database/inboxModel"));
const jobModel_1 = __importDefault(require("../database/jobModel"));
const jobSheduled_1 = __importDefault(require("../database/jobSheduled"));
const messageModel_1 = __importDefault(require("../database/messageModel"));
const otpModel_1 = __importDefault(require("../database/otpModel"));
const postModel_1 = __importDefault(require("../database/postModel"));
const reviewRatingModel_1 = __importDefault(require("../database/reviewRatingModel"));
const mongodb_1 = require("mongodb");
class CompanyRepositories {
    saveCompany(companyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCompany = new companyModel_1.default(companyData);
                yield newCompany.save();
                return companyData ? companyData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save new company");
            }
        });
    }
    findCompanyByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyData = yield companyModel_1.default.findOne({ email: email });
                return companyData ? companyData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find company");
            }
        });
    }
    checkOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkedOtp = yield otpModel_1.default.findOne({ otp: otp });
                return checkedOtp ? checkedOtp.email : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find otp");
            }
        });
    }
    verifyCompany(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyCompany = yield companyModel_1.default.updateOne({ email: email }, { $set: { is_verified: true } }, { upsert: true });
                return verifyCompany.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to verfiy company");
            }
        });
    }
    saveCompanydata(companydata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCompany = yield companyModel_1.default.findOne({ email: companydata.email });
                if (findCompany) {
                    return findCompany;
                }
                else {
                    const saveCompany = new companyModel_1.default(companydata);
                    yield saveCompany.save();
                    if (saveCompany) {
                        const data = yield companyModel_1.default.findOne({ email: saveCompany.email });
                        return data;
                    }
                    else {
                        return null;
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save companydata");
            }
        });
    }
    getCompanydata(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companData = yield companyModel_1.default.findOne({ _id: id }).populate("users.user_id");
                return companData ? companData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get companydata");
            }
        });
    }
    resetPassword(company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = company;
                const reset = yield companyModel_1.default.updateOne({ email: email }, { $set: { password: password } });
                if (reset) {
                    return reset.acknowledged;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to reset password");
            }
        });
    }
    saveJobs(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedjob = new jobModel_1.default(jobData);
                yield savedjob.save();
                if (savedjob) {
                    return true;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to reset password");
            }
        });
    }
    getJobs(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = Number(page) * 6;
                const jobCount = yield jobModel_1.default.find({ company_id: id }).countDocuments();
                const jobs = yield jobModel_1.default.find({ company_id: id }).sort({ time: -1 }).skip(pages).limit(6).populate('company_id');
                if (jobs.length === 0) {
                    return null;
                }
                return {
                    count: Math.ceil(jobCount / 6),
                    jobs
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find jobs");
            }
        });
    }
    removeJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removed = yield jobModel_1.default.deleteOne({ _id: id });
                return removed.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to remove job");
            }
        });
    }
    savePosts(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPost = new postModel_1.default(postData);
                yield savedPost.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save post");
            }
        });
    }
    getPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postModel_1.default.find({ company_id: id }).sort({ time: -1 }).populate('company_id');
                return posts ? posts : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find post");
            }
        });
    }
    updateProfile(id, company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield companyModel_1.default.updateOne({ _id: id }, company, { new: true });
                return updated.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update companydata");
            }
        });
    }
    uploadDocument(id, document_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const upload = yield companyModel_1.default.updateOne({ _id: id }, { $set: { document_url: document_url } });
                return upload.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to upload document");
            }
        });
    }
    deletePost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield postModel_1.default.deleteOne({ _id: post_id });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to delete post");
            }
        });
    }
    jobApplications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield jobModel_1.default.find({ _id: id }).populate('applicants_id.user_id');
                return job ? job : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get jobapplications");
            }
        });
    }
    saveScheduledJobs(jobScheduleddata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduled = new jobSheduled_1.default(jobScheduleddata);
                yield scheduled.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save Schedule jobs");
            }
        });
    }
    getScheduledJobs(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduled = yield jobSheduled_1.default.find({ job_id: job_id });
                return scheduled ? scheduled : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get Schedule jobs");
            }
        });
    }
    findScheduledJobs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduled = yield jobSheduled_1.default.find({ job_id: id }).populate('user_id');
                return scheduled ? scheduled : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find Schedule jobs");
            }
        });
    }
    getReviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongodb_1.ObjectId(id);
                const reviewdata = yield reviewRatingModel_1.default.find({ company_id: id }).populate('user_id');
                const count = [];
                for (let i = 5; i >= 1; i--) {
                    const averageStar = yield reviewRatingModel_1.default.aggregate([{ $match: { company_id: objectId, rating_count: i } }, { $group: { _id: null, average: { $avg: "$rating_count" } } }]);
                    if (averageStar.length == 0) {
                        count.push(0);
                    }
                    else {
                        count.push(averageStar[0].average);
                    }
                }
                const data = {
                    review: reviewdata, counts: count
                };
                return data ? data : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get Reviews");
            }
        });
    }
    saveMessages(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveMessages = new messageModel_1.default(messageData);
                yield saveMessages.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save message");
            }
        });
    }
    getMessages(reciever_id, sender_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sender = yield messageModel_1.default.find({ reciever_id: reciever_id, sender_id: sender_id });
                const reciever = yield messageModel_1.default.find({ reciever_id: sender_id, sender_id: reciever_id });
                const messages = {
                    sender: sender,
                    reciever: reciever
                };
                return messages ? messages : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get message");
            }
        });
    }
    getcomment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield commentModel_1.default.find({ post_id: id }).populate('user_id').populate('company_id');
                return comments ? comments : null;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to find comments`);
            }
        });
    }
    replycomment(comment_id, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commmentReply = yield commentModel_1.default.updateOne({ _id: comment_id }, { $set: { reply: reply, replied: true } });
                return commmentReply.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to reply comments`);
            }
        });
    }
    deleteApplicant(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield jobModel_1.default.updateOne({ _id: job_id }, { $pull: { applicants_id: user_id } });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to delete applicant`);
            }
        });
    }
    findInbox(reciever_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inbox = yield inboxModel_1.default.find({ reciever_id: reciever_id, role: 'company' }).sort({ time: -1 }).populate('sender_id');
                return inbox ? inbox : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find inboxData ");
            }
        });
    }
    listJob(job_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status == "block") {
                    const jobListing = yield jobModel_1.default.updateOne({ _id: job_id }, { $set: { list: false } });
                    return jobListing.acknowledged ? "Job unlisted from user" : "";
                }
                else {
                    const jobListing = yield jobModel_1.default.updateOne({ _id: job_id }, { $set: { list: true } });
                    return jobListing.acknowledged ? "Job listed to user" : "";
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to listjob ");
            }
        });
    }
    findJobById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield jobModel_1.default.findOne({ _id: job_id });
                return job ? job : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to findJob ");
            }
        });
    }
    editJob(job_id, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(jobData);
                const job = yield jobModel_1.default.updateOne({ _id: job_id }, { $set: jobData });
                return job.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to editjob ");
            }
        });
    }
}
exports.default = CompanyRepositories;

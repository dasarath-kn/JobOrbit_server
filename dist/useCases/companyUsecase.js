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
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyUsecase {
    constructor(companyRepo, hashPassword, userRepo, otpGenerator, nodeMailer, jwttoken, cloudinary) {
        this.companyRepo = companyRepo;
        this.hashPassword = hashPassword;
        this.otpGenerator = otpGenerator;
        this.userRepo = userRepo;
        this.nodeMailer = nodeMailer;
        this.jwttoken = jwttoken;
        this.cloudinary = cloudinary;
    }
    signUp(companyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companyExist = yield this.companyRepo.findCompanyByEmail(companyData.email);
                if (companyExist) {
                    if (!companyExist.is_verified) {
                        const otp = yield this.otpGenerator.otpgenerate();
                        yield this.nodeMailer.sendEmail(companyData.email, otp);
                        yield this.userRepo.saveOtp(companyExist.email, otp);
                        return { success: true, message: "company is not verified" };
                    }
                    else {
                        return { success: false, message: "Email alreadyexist" };
                    }
                }
                else {
                    const hashedPassword = yield this.hashPassword.hashPassword(companyData.password);
                    companyData.password = hashedPassword;
                    const companySaved = yield this.companyRepo.saveCompany(companyData);
                    const otp = yield this.otpGenerator.otpgenerate();
                    yield this.nodeMailer.sendEmail(companyData.email, otp);
                    yield this.userRepo.saveOtp(companySaved === null || companySaved === void 0 ? void 0 : companySaved.email, otp);
                    if (companySaved) {
                        return { success: true, message: "New company saved sucessfully", companySaved };
                    }
                    else {
                        return { success: false, message: "New company is not saved" };
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companyData = yield this.companyRepo.findCompanyByEmail(email);
                if (companyData) {
                    let checkPassword = yield this.hashPassword.comparePassword(password, companyData.password);
                    if (checkPassword) {
                        if (companyData.is_blocked) {
                            return { success: false, message: "You've been blocked by admin" };
                        }
                        else {
                            let token = yield this.jwttoken.generateToken(companyData._id, "company");
                            return { success: true, message: "Company logined successfully", companyData, token };
                        }
                    }
                    else {
                        return { success: false, message: "Invalid Password" };
                    }
                }
                else {
                    return { success: false, message: "Invalid Email" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    verifyOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findOtp = yield this.companyRepo.checkOtp(otp);
                if (findOtp) {
                    yield this.companyRepo.verifyCompany(findOtp);
                    const companyData = yield this.companyRepo.findCompanyByEmail(findOtp);
                    const token = yield this.jwttoken.generateToken(companyData === null || companyData === void 0 ? void 0 : companyData._id, "company");
                    return { success: true, message: "Company verified successfully", token };
                }
                else {
                    return { success: false, message: "Incorrect otp" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    googleSavecompany(companydata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield this.companyRepo.saveCompanydata(companydata);
                if (saved) {
                    if (saved.is_blocked) {
                        return { success: false, message: "You've been blocked admin" };
                    }
                    let token = this.jwttoken.generateToken(saved._id, "company");
                    return { success: true, message: "Logined successfully", token };
                }
                else {
                    return { success: false, message: "Logined failed" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    companData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companydata = yield this.companyRepo.getCompanydata(id);
                if (companydata) {
                    return { success: true, message: "Companydata sent successfully", companydata };
                }
                else {
                    return { success: false, message: "Failed to sent companydata" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    companyExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companyData = yield this.companyRepo.findCompanyByEmail(email);
                if (companyData) {
                    let otp = this.otpGenerator.otpgenerate();
                    yield this.nodeMailer.sendEmail(email, otp);
                    yield this.userRepo.saveOtp(email, otp);
                    return { success: true, message: "Otp sent sucessfully", companyData };
                }
                else {
                    return { success: false, message: "Email not found " };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    passwordReset(companydata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password } = companydata;
                let hashed = yield this.hashPassword.hashPassword(password);
                console.log(hashed);
                companydata.password = hashed;
                let data = yield this.companyRepo.resetPassword(companydata);
                if (data) {
                    return { success: true, message: "Password reset successfully" };
                }
                else {
                    return { success: false, message: "Failed to reset password" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    savingJobs(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let savedJob = yield this.companyRepo.saveJobs(jobData);
                if (savedJob) {
                    return { success: true, message: "Job created successfully" };
                }
                else {
                    return { success: false, message: "Failed to create job" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    jobs(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobData = yield this.companyRepo.getJobs(id, page);
                if (jobData) {
                    const { jobs, count } = jobData;
                    return { success: true, message: "Jobs sent successfully", jobs, count };
                }
                else {
                    return { success: false, message: "Failed to sent jobs" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    jobRemove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let removedJob = yield this.companyRepo.removeJob(id);
                if (removedJob) {
                    return { success: true, message: "Job removed successfully" };
                }
                else {
                    return { success: false, message: "Failed to remove job" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    savePost(postData, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (files) {
                    let cloudinary = yield this.cloudinary.uploadMultipleimages(files, "Post");
                    postData.images = cloudinary;
                }
                let savedPost = yield this.companyRepo.savePosts(postData);
                if (savedPost) {
                    return { success: true, message: 'Post saved successfully' };
                }
                else {
                    return { success: files, message: 'Failed to save post' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    Posts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let posts = yield this.companyRepo.getPosts(id);
                if (posts) {
                    return { success: true, message: "Posts sent successfully", posts };
                }
                else {
                    return { success: false, message: "Unable to sent posts" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updateProfile(id, company, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (file) {
                    let cloudinary = yield this.cloudinary.uploadImage(file, "User Profile");
                    company.img_url = cloudinary;
                }
                let updatedData = yield this.companyRepo.updateProfile(id, company);
                if (updatedData) {
                    let companyData = yield this.companyRepo.getCompanydata(id);
                    return { success: true, message: "Company profile updated successfully", companyData };
                }
                else {
                    return { success: false, message: "Failed to update company profile" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    documentUpload(id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cloudinary = '';
                if (file) {
                    cloudinary = yield this.cloudinary.uploaddocuments(file, "Documents");
                }
                let upload = yield this.companyRepo.uploadDocument(id, cloudinary);
                if (upload) {
                    return { success: true, message: "Document uploaded successfully" };
                }
                else {
                    return { success: false, message: "Failed to upload documents" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    removePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let remove = yield this.companyRepo.deletePost(id);
                if (remove) {
                    return { success: true, message: "Post deleted successfully" };
                }
                else {
                    return { success: false, message: "Unable to delete post " };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    userAppliedJobs(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let appliedUsers = yield this.companyRepo.jobApplications(job_id);
                if (appliedUsers) {
                    return { success: true, message: "Applied Users sent successfully", appliedUsers };
                }
                else {
                    return { success: false, message: "Failed to sent userapplications" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    scheduledJobs(jobScheduleddata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { company_id, user_id } = jobScheduleddata;
                let scheduled = yield this.companyRepo.saveScheduledJobs(jobScheduleddata);
                if (scheduled) {
                    const companData = yield this.companyRepo.getCompanydata(company_id);
                    const userData = yield this.userRepo.findUserById(user_id);
                    const sendInterviewEmail = yield this.nodeMailer.interviewEmail(jobScheduleddata, companData === null || companData === void 0 ? void 0 : companData.companyname, userData === null || userData === void 0 ? void 0 : userData.firstname, userData === null || userData === void 0 ? void 0 : userData.email);
                    return { success: true, message: "Schedule job sent successfully" };
                }
                else {
                    return { success: false, message: "Failed to save scheduled job" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    scheduled(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let scheduledJobdata = yield this.companyRepo.getScheduledJobs(job_id);
                if (scheduledJobdata) {
                    return { success: true, message: "Scheduled job data sent successfully", scheduledJobdata };
                }
                else {
                    return { success: false, message: "Failed to sent scheduled data" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getScheduledJobs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let scheduledJobs = yield this.companyRepo.findScheduledJobs(id);
                if (scheduledJobs) {
                    return { success: true, message: "Scheduled jobs sent successfully", scheduledJobs };
                }
                else {
                    return { success: false, message: "Failed to sent scheduled jobs" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    reviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield this.companyRepo.getReviews(id);
                if (reviews) {
                    console.log(reviews, "rrrrr ");
                    return { success: true, message: "Reviews sent successfully", reviews };
                }
                else {
                    return { success: false, message: "Failed to sent reviews" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    message(reciever_id, sender_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.companyRepo.getMessages(reciever_id, sender_id);
                if (messages) {
                    return { success: true, message: "Messages sent successfully", messages };
                }
                else {
                    return { success: false, message: "Failed to sent message" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    comments(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.companyRepo.getcomment(post_id);
                if (comments) {
                    return { success: true, message: "Comments sent successfully", comments };
                }
                else {
                    return { success: false, message: "Failed to sent comments" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    commentReply(comment_id, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.companyRepo.replycomment(comment_id, reply);
                if (comment) {
                    return { success: true, message: "Comment replied successfully" };
                }
                else {
                    return { success: false, message: "Failed to reply comment" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    removeApplicant(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield this.companyRepo.deleteApplicant(job_id, user_id);
                if (remove) {
                    return { success: true, message: "Applicant removed successfully" };
                }
                else {
                    return { success: false, message: "Failed to remove applicant" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    conversation(sender_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationData = yield this.companyRepo.findInbox(sender_id);
                if (conversationData) {
                    return { success: true, message: "Conversation list sent successfully", conversationData };
                }
                else {
                    return { success: false, messsage: "Failed to sent conversation data" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = CompanyUsecase;

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
class userUsecase {
    constructor(userRepo, hashPassword, otpGenerator, nodeMailer, jwttoken, cloudinary, stripe) {
        this.userRepo = userRepo;
        this.hashPassword = hashPassword;
        this.otpGenerator = otpGenerator;
        this.nodeMailer = nodeMailer;
        this.jwttoken = jwttoken;
        this.cloundinary = cloudinary;
        this.stripe = stripe;
    }
    findUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExist = yield this.userRepo.findUserByEmail(userData.email);
                if (userExist) {
                    return { data: true };
                }
                else {
                    let hashed = yield this.hashPassword.hashPassword(userData.password);
                    userData.password = hashed;
                    let userSaved = yield this.userRepo.saveUser(userData);
                    let otp = yield this.otpGenerator.otpgenerate();
                    yield this.nodeMailer.sendEmail(userData.email, otp);
                    yield this.userRepo.saveOtp(userSaved === null || userSaved === void 0 ? void 0 : userSaved.email, otp);
                    let token = yield this.jwttoken.generateToken(userData._id, "user");
                    return { data: false, userSaved };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExistdata = yield this.userRepo.findUserByEmail(email);
                if (userExistdata) {
                    let checkPassword = yield this.hashPassword.comparePassword(password, userExistdata.password);
                    if (checkPassword) {
                        if (userExistdata.is_blocked) {
                            return { success: false, message: "You've been blocked admin" };
                        }
                        else if (!userExistdata.is_verified) {
                            let otp = this.otpGenerator.otpgenerate();
                            yield this.nodeMailer.sendEmail(email, otp);
                            yield this.userRepo.saveOtp(email, otp);
                            return { success: true, message: "User not verified", userExistdata };
                        }
                        else {
                            let token = yield this.jwttoken.generateToken(userExistdata._id, "user");
                            let refreshtoken = yield this.jwttoken.generateRefreshtoken(userExistdata._id, "user");
                            return { success: true, userExistdata, message: "User logined successfully", token, refreshtoken };
                        }
                    }
                    else {
                        return { success: false, message: "Invalid Password" };
                    }
                }
                else {
                    return { success: false, message: 'Invalid Email' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    verfiyOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let verifiedOtp = yield this.userRepo.checkOtp(otp);
                if (verifiedOtp) {
                    yield this.userRepo.verifyUser(verifiedOtp);
                    let userData = yield this.userRepo.findUserByEmail(verifiedOtp);
                    let token = yield this.jwttoken.generateToken(userData === null || userData === void 0 ? void 0 : userData._id, "user");
                    return { success: true, message: 'User verified successfully', token };
                }
                else {
                    return { success: false, message: 'Incorrect otp' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let otp = this.otpGenerator.otpgenerate();
                yield this.nodeMailer.sendEmail(email, otp);
                yield this.userRepo.saveOtp(email, otp);
                return { success: true, message: "Otp send successfully" };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    userData(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield this.userRepo.getUserdata(user_id);
                if (userData) {
                    return { success: true, message: "Userdata sent successfully", userData };
                }
                else {
                    return { success: false, message: "Failed to sent userdata" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    googleSaveuser(userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield this.userRepo.saveUserdata(userdata);
                if (saved) {
                    if (saved.is_blocked) {
                        return { success: false, message: "You've been blocked admin" };
                    }
                    else {
                        let token = this.jwttoken.generateToken(saved._id, "user");
                        return { success: true, message: " Logined successfully", token };
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    userExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Userdata = yield this.userRepo.findUserByEmail(email);
                console.log(Userdata);
                if (Userdata) {
                    let otp = this.otpGenerator.otpgenerate();
                    yield this.nodeMailer.sendEmail(email, otp);
                    yield this.userRepo.saveOtp(email, otp);
                    return { success: true, message: "Otp sent sucessfully", Userdata };
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
    passwordReset(userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password } = userdata;
                let hashed = yield this.hashPassword.hashPassword(password);
                console.log(hashed);
                userdata.password = hashed;
                let data = yield this.userRepo.resetPassword(userdata);
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
    updateProfile(id, user, file, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (file) {
                    let cloudinary = yield this.cloundinary.uploadImage(file, "User Profile");
                    user.img_url = cloudinary;
                }
                let updatedData = yield this.userRepo.updateProfile(id, user, percentage);
                if (updatedData) {
                    let userData = yield this.userRepo.getUserdata(id);
                    return { success: true, message: "User profile updated successfully", userData };
                }
                else {
                    return { success: false, message: "Failed to update user profile" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    manageSkill(skill, id, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updateSkill = yield this.userRepo.updateSkill(skill, id, percentage);
                if (updateSkill) {
                    return { success: true, message: "Skill added successfully" };
                }
                else {
                    return { success: false, message: "Failed to add skill" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    jobs(page, type, location, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobData = yield this.userRepo.viewjobs(page, type, location, date);
                if (jobData) {
                    const { jobs, count } = jobData;
                    return { success: true, message: "Jobs sent successfully", jobs, count };
                }
                else {
                    return { success: false, message: "Failed to sent job" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    posts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let posts = yield this.userRepo.getPosts();
                if (posts) {
                    return { success: true, message: "Posts sent sucessfully", posts };
                }
                else {
                    return { success: false, message: "Failed to sent posts" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    manageLikeUnlike(post_id, user_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status == "Like") {
                    let liked = yield this.userRepo.likePost(post_id, user_id);
                    if (liked) {
                        return { success: true, message: " Post linked successfully" };
                    }
                    else {
                        return { success: false, message: " Failed to like post" };
                    }
                }
                else {
                    let unliked = yield this.userRepo.unlikePost(post_id, user_id);
                    if (unliked) {
                        return { success: true, message: " Post unlinked successfully" };
                    }
                    else {
                        return { success: false, message: " Failed to unlike post" };
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    postSave(postData, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let savePost = yield this.userRepo.savePost(postData, message);
                if (savePost) {
                    return { success: true, message: `Post ${message}` };
                }
                else {
                    return { success: false, message: "Failed to save post" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    savedPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let savedPosts = yield this.userRepo.getSavedpost(id);
                if (savedPosts) {
                    return { success: true, message: "Saved posts sent succcessfully", savedPosts };
                }
                else {
                    return { success: false, message: "Failed to sent savedpost " };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    shareComment(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.userRepo.postcomment(commentData);
                if (comment) {
                    return { success: true, message: "Comment added successfully" };
                }
                else {
                    return { success: false, message: "Failed to add comment" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    comments(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.userRepo.getcomment(post_id);
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
    jobDetails(job_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobDetails = yield this.userRepo.findJobdetails(job_id);
                if (jobDetails) {
                    let userData = yield this.userRepo.findUserById(id);
                    if (userData) {
                        const { plan_id } = userData;
                        return { success: true, message: "Jobdetails sent successfully", jobDetails, plan_id };
                    }
                    else {
                        return { success: false };
                    }
                }
                else {
                    return { success: false, message: "Failed to send jobdetails" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    experience(experienceData, percentage, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let experience = yield this.userRepo.addExperience(experienceData, percentage, id);
                if (experience) {
                    return { success: true, message: 'User experience added successfully' };
                }
                else {
                    return { success: false, message: 'Failed to add user experience' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    resume(id, file, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resume_url = '';
                if (file) {
                    let cloudinary = yield this.cloundinary.uploaddocuments(file, "Resume");
                    resume_url = cloudinary;
                }
                let upload = yield this.userRepo.updateResume(id, resume_url, percentage);
                if (upload) {
                    return { success: true, message: "Resume uploaded successfully" };
                }
                else {
                    return { success: false, message: "Failed to upload resume" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    jobApplication(job_id, user_id, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let job = yield this.userRepo.applyJob(job_id, user_id, company_id);
                if (job) {
                    return { success: true, message: "Job applied successfully" };
                }
                else {
                    return { success: false, message: 'Failed to apply job' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    subscriptionPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let subscriptionplan = yield this.userRepo.getsubscriptionplan();
                if (subscriptionplan) {
                    return { success: true, message: "Subscription plans sent successfully", subscriptionplan };
                }
                else {
                    return { success: false, message: "Failed to sent subscription" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    subscriptionPayment(price, subscribedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(price);
                let payment_id = yield this.stripe.createCheckoutSession(price);
                if (payment_id) {
                    subscribedData.session_id = payment_id;
                    let save = yield this.userRepo.savesubscribedUsers(subscribedData);
                    if (save) {
                        return { success: true, message: "Payment id sent successfully", payment_id };
                    }
                    else {
                        return { success: false, message: "Failed to sent payment id" };
                    }
                }
                else {
                    return { success: false, message: 'Failed to complete transaction' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updateSubscribedUsers(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (datas.type) {
                    case 'checkout.session.completed':
                        const session = datas.data.object;
                        const id = session.id;
                        const message = "success";
                        const update = yield this.userRepo.updatesubscribedUsers(id, message);
                        if (update) {
                            return { success: true, message: 'Updated successfully' };
                        }
                        else {
                            return { success: false, message: "Failed to update" };
                        }
                    case 'checkout.session.async_payment_failed':
                        console.log("Payment Failed");
                        return { success: false, message: "Payment failed" }; // Provide a response for this case
                    default:
                        console.log(`Unhandled event type: ${datas.type}`);
                        return { success: false, message: `Unhandled event type: ${datas.type}` }; // Provide a response for unhandled event types
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Error updating subscribed users"); // Provide a clearer error message
            }
        });
    }
    subscribedUserdetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let subscribedUser = yield this.userRepo.findSubscribedUserById(id);
                if (subscribedUser) {
                    return { success: true, messsage: 'Subscribed User details sent successfully', subscribedUser };
                }
                else {
                    return { success: false, messsage: 'Subscribed User details sent failed' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    postReportsave(post_id, postreportData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reportPost = yield this.userRepo.savePostReport(post_id, postreportData);
                if (reportPost) {
                    return { success: true, message: "Post reported successfully" };
                }
                else {
                    return { success: false, message: "Failed to report post" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findAppliedJobsByUserid(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedJobs = yield this.userRepo.findAppliedJobs(user_id);
                if (appliedJobs) {
                    return { success: true, message: "User Applied jobs sent successfully", appliedJobs };
                }
                else {
                    return { success: false, message: "Failed to sent user applied jobs" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userDatas = yield this.userRepo.getUserdatas();
                if (userDatas) {
                    return { success: true, message: "Userdatas sent suceessfully", userDatas };
                }
                else {
                    return { success: false, message: "Failed to send userdata" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companyDatas = yield this.userRepo.getCompanydatas();
                if (companyDatas) {
                    return { success: true, message: "Companydatas sent successfully", companyDatas };
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
    viewCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyData = yield this.userRepo.findCompanyById(id);
                if (companyData) {
                    return { success: true, message: "Companydata sent successfully", companyData };
                }
                else {
                    return { success: false, message: "Unable to sent companydata" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findUserdetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield this.userRepo.findUserById(id);
                if (userData) {
                    return { success: true, message: "Userdata sent successfully", userData };
                }
                else {
                    return { success: false, message: "Failed to sent userdata" };
                }
            }
            catch (error) {
            }
        });
    }
    addreviews(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveReview = yield this.userRepo.saveReviews(reviewData);
                if (saveReview) {
                    return { success: true, message: "Review added successfully", };
                }
                else {
                    return { success: false, message: "Failed to save review" };
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
                const reviews = yield this.userRepo.getReviews(id);
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
    addConnection(user_id, connection_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.userRepo.connectUser(user_id, connection_id);
                if (connection) {
                    return { success: true, message: "Connection request sent successfully" };
                }
                else {
                    return { success: false, message: "Failed to sent  connection" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    message(reciever_id, sender_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.userRepo.getMessages(reciever_id, sender_id);
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
    addCompanyConnection(user_id, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.userRepo.connectCompany(user_id, company_id);
                if (connection) {
                    return { success: true, message: "Connection request sent successfully" };
                }
                else {
                    return { success: false, message: "Failed to sent  connection" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    connections(reciever_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connectRequests = yield this.userRepo.findConnectionRequest(reciever_id);
                if (connectRequests) {
                    return { success: true, message: "Connect Request data sent successfully", connectRequests };
                }
                else {
                    return { success: false, message: "Failed to sent connect request data" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    connectionManage(user_id, connection_id, notification_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connect = yield this.userRepo.manageConnection(user_id, connection_id, notification_id, message);
                if (connect) {
                    return { success: true, message: "Connection updated" };
                }
                else {
                    return { success: false, message: "Failed to update  connection" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    inbox(sender_id, reciever_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveData = yield this.userRepo.saveInbox(sender_id, reciever_id, role);
                if (saveData) {
                    return { success: true, message: "Inbox saved" };
                }
                else {
                    return { success: false, message: "Failed to save" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    conversation(sender_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationData = yield this.userRepo.findInbox(sender_id, role);
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
exports.default = userUsecase;

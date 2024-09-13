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
const fs_1 = __importDefault(require("fs"));
class userUsecase {
    constructor(userRepo, hashPassword, otpGenerator, nodeMailer, jwttoken, cloudinary, stripe) {
        this.userRepo = userRepo;
        this.hashPassword = hashPassword;
        this.otpGenerator = otpGenerator;
        this.nodeMailer = nodeMailer;
        this.jwttoken = jwttoken;
        this.cloudinary = cloudinary;
        this.stripe = stripe;
    }
    findUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExist = yield this.userRepo.findUserByEmail(userData.email);
                if (userExist) {
                    return { data: true };
                }
                else {
                    const hashed = yield this.hashPassword.hashPassword(userData.password);
                    userData.password = hashed;
                    const userSaved = yield this.userRepo.saveUser(userData);
                    const otp = yield this.otpGenerator.otpgenerate();
                    yield this.nodeMailer.sendEmail(userData.email, otp);
                    yield this.userRepo.saveOtp(userSaved === null || userSaved === void 0 ? void 0 : userSaved.email, otp);
                    const token = yield this.jwttoken.generateToken(userData._id, "user");
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
                const userExistdata = yield this.userRepo.findUserByEmail(email);
                if (userExistdata) {
                    const checkPassword = yield this.hashPassword.comparePassword(password, userExistdata.password);
                    if (checkPassword) {
                        if (userExistdata.is_blocked) {
                            return { success: false, message: "You've been blocked admin" };
                        }
                        else if (!userExistdata.is_verified) {
                            const otp = this.otpGenerator.otpgenerate();
                            yield this.nodeMailer.sendEmail(email, otp);
                            yield this.userRepo.saveOtp(email, otp);
                            return { success: true, message: "User not verified", userExistdata };
                        }
                        else {
                            const token = yield this.jwttoken.generateToken(userExistdata._id, "user");
                            const refreshtoken = yield this.jwttoken.generateRefreshtoken(userExistdata._id, "user");
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
                const verifiedOtp = yield this.userRepo.checkOtp(otp);
                if (verifiedOtp) {
                    yield this.userRepo.verifyUser(verifiedOtp);
                    const userData = yield this.userRepo.findUserByEmail(verifiedOtp);
                    const token = yield this.jwttoken.generateToken(userData === null || userData === void 0 ? void 0 : userData._id, "user");
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
                const otp = this.otpGenerator.otpgenerate();
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
                const userData = yield this.userRepo.getUserdata(user_id);
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
                const saved = yield this.userRepo.saveUserdata(userdata);
                if (saved) {
                    if (saved.is_blocked) {
                        return { success: false, message: "You've been blocked admin" };
                    }
                    else {
                        const token = this.jwttoken.generateToken(saved._id, "user");
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
                const Userdata = yield this.userRepo.findUserByEmail(email);
                console.log(Userdata);
                if (Userdata) {
                    const otp = this.otpGenerator.otpgenerate();
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
                const { password } = userdata;
                const hashed = yield this.hashPassword.hashPassword(password);
                console.log(hashed);
                userdata.password = hashed;
                const data = yield this.userRepo.resetPassword(userdata);
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
                    const cloudinary = yield this.cloudinary.uploadImage(file, "User Profile");
                    user.img_url = cloudinary;
                }
                const updatedData = yield this.userRepo.updateProfile(id, user, percentage);
                if (updatedData) {
                    const userData = yield this.userRepo.getUserdata(id);
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
                const updateSkill = yield this.userRepo.updateSkill(skill, id, percentage);
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
    jobs(page, type, location, date, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = yield this.userRepo.viewjobs(page, type, location, date, user_id);
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
    posts(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.userRepo.getPosts(page);
                if (postData) {
                    const { posts, count } = postData;
                    return { success: true, message: "Posts sent sucessfully", posts, count };
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
    manageLikeUnlike(post_id, user_id, status, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likedData = { post_id, user_id, company_id };
                if (status == "Like") {
                    const liked = yield this.userRepo.likePost(likedData);
                    if (liked) {
                        return { success: true, message: " Post linked successfully" };
                    }
                    else {
                        return { success: false, message: " Failed to like post" };
                    }
                }
                else {
                    const unliked = yield this.userRepo.unlikePost(post_id, user_id);
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
    getLikedPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likedPosts = yield this.userRepo.likedPosts(user_id);
                if (likedPosts) {
                    return { success: true, message: "Post sent successfully", likedPosts };
                }
                else {
                    return { success: false, message: "Failed to sent post" };
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
                const savePost = yield this.userRepo.savePost(postData, message);
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
    savedPosts(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPosts = yield this.userRepo.getSavedpost(post_id);
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
    jobDetails(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield this.userRepo.findJobdetails(job_id);
                if (jobDetails) {
                    const userData = yield this.userRepo.findUserById(user_id);
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
    experience(experienceData, percentage, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experience = yield this.userRepo.addExperience(experienceData, percentage, user_id);
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
    resume(user_id, file, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resume_url = '';
                if (file) {
                    const cloudinary = yield this.cloudinary.uploaddocuments(file, "Resume");
                    resume_url = cloudinary;
                }
                const upload = yield this.userRepo.updateResume(user_id, resume_url, percentage);
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
    jobApplication(job_id, user_id, company_id, resume_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield this.userRepo.applyJob(job_id, user_id, company_id, resume_url);
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
                const subscriptionplan = yield this.userRepo.getsubscriptionplan();
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
                const payment_id = yield this.stripe.createCheckoutSession(price);
                if (payment_id) {
                    subscribedData.session_id = payment_id;
                    const save = yield this.userRepo.savesubscribedUsers(subscribedData);
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
    subscribedUserdetails(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscribedUser = yield this.userRepo.findSubscribedUserById(user_id);
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
                const reportPost = yield this.userRepo.savePostReport(post_id, postreportData);
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
    findAppliedJobsByUserid(user_id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedJobs = yield this.userRepo.findAppliedJobs(user_id, page);
                if (appliedJobs) {
                    const { jobs, count } = appliedJobs;
                    return { success: true, message: "User Applied jobs sent successfully", jobs, count };
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
                const userDatas = yield this.userRepo.getUserdatas();
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
                const companyDatas = yield this.userRepo.getCompanydatas();
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
    viewCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyData = yield this.userRepo.findCompanyById(company_id);
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
    findUserdetails(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.userRepo.findUserById(user_id);
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
    reviews(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield this.userRepo.getReviews(company_id);
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
    deleteExperience(field, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removeExperience = yield this.userRepo.removeExperience(field, user_id);
                if (removeExperience) {
                    return { success: true, message: "Experience deleted" };
                }
                else {
                    return { success: false, message: "Failed to delete experience" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteSkills(val, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield this.userRepo.removeSkills(val, id);
                if (remove) {
                    return { success: true, message: "Skill removed" };
                }
                else {
                    return { success: false, message: "Failed to remove skill" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    rewards(user_id, rewardData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (file) {
                    const cloudinary = yield this.cloudinary.uploadImage(file, "Image");
                    rewardData.img_url = cloudinary;
                }
                const reward = yield this.userRepo.addRewards(user_id, rewardData);
                if (reward) {
                    fs_1.default.unlink(file, (err) => {
                        if (err) {
                            console.error(`Error removing file ${file}:`, err);
                        }
                        else {
                            console.log(`Successfully removed file ${file}`);
                        }
                    });
                    return { success: true, message: "Reward added" };
                }
                else {
                    return { success: false, message: "Failed to add reward" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveDocuments(messageData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (file) {
                    const cloudinary = yield this.cloudinary.uploadImage(file, "Image");
                    messageData.url = cloudinary;
                }
                const addDocument = yield this.userRepo.addDocuments(messageData);
                if (addDocument) {
                    fs_1.default.unlink(file, (err) => {
                        if (err) {
                            console.error(`Error removing file ${file}:`, err);
                        }
                        else {
                            console.log(`Successfully removed file ${file}`);
                        }
                    });
                    return { success: true, message: "document saved successfully" };
                }
                else {
                    return { success: false, message: "Failed to save document" };
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

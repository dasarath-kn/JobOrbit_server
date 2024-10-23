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
const jobApplied_1 = __importDefault(require("../database/jobApplied"));
const jobModel_1 = __importDefault(require("../database/jobModel"));
const likedPostModel_1 = __importDefault(require("../database/likedPostModel"));
const messageModel_1 = __importDefault(require("../database/messageModel"));
const notification_1 = __importDefault(require("../database/notification"));
const otpModel_1 = __importDefault(require("../database/otpModel"));
const postModel_1 = __importDefault(require("../database/postModel"));
const postReportModel_1 = __importDefault(require("../database/postReportModel"));
const reviewRatingModel_1 = __importDefault(require("../database/reviewRatingModel"));
const savedPostModel_1 = __importDefault(require("../database/savedPostModel"));
const subscribedUsersModel_1 = __importDefault(require("../database/subscribedUsersModel"));
const subscription_1 = __importDefault(require("../database/subscription"));
const userModel_1 = __importDefault(require("../database/userModel"));
const mongodb_1 = require("mongodb");
class userRepository {
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findOne({ _id: id }).populate('plan_id');
                return userData ? userData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("unable to find userdata");
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findOne({ email: email });
                return userData ? userData.toObject() : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("unable to find userdata");
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                yield newUser.save();
                return newUser ? newUser : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("unable to save newuser");
            }
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedUser = yield userModel_1.default.updateOne({ email: email }, { $set: { is_verified: true } });
                console.log(verifiedUser);
                return verifiedUser.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to verifyuser");
            }
        });
    }
    saveOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveOtp = yield otpModel_1.default.updateOne({ email: email }, { $set: { otp: otp } }, { upsert: true });
                return saveOtp.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to saveotp");
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
                throw new Error("Unable to find the otp");
            }
        });
    }
    getUserdata(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userdata = yield userModel_1.default.findOne({ _id: user_id }).populate("connections.connection_id").populate("companies.company_id");
                return userdata ? userdata : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find userdata");
            }
        });
    }
    saveUserdata(userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const finduser = yield userModel_1.default.findOne({ email: userdata.email });
                if (finduser) {
                    return finduser;
                }
                else {
                    const saveUser = new userModel_1.default(userdata);
                    yield saveUser.save();
                    if (saveUser) {
                        const data = yield userModel_1.default.findOne({ email: userdata.email });
                        return data;
                    }
                    else {
                        return null;
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save userdata");
            }
        });
    }
    resetPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = user;
                const reset = yield userModel_1.default.updateOne({ email: email }, { $set: { password: password } });
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
    updateProfile(id, user, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (percentage == 15) {
                    const updated = yield userModel_1.default.updateOne({ _id: id }, user, { new: true });
                    const percentageupdate = yield userModel_1.default.updateOne({ _id: id }, { $inc: { percentage: percentage } });
                    return updated.acknowledged;
                }
                else {
                    const updated = yield userModel_1.default.updateOne({ _id: id }, user, { new: true });
                    const percentageupdate = yield userModel_1.default.updateOne({ _id: id }, { $set: { percentage: percentage } });
                    return updated.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update userdata");
            }
        });
    }
    viewjobs(page, type, location, date, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = Number(page) * 8;
                const filter = {};
                if (type) {
                    filter.type = type;
                }
                if (location) {
                    filter.location = location;
                }
                if (date) {
                    const now = new Date();
                    let dateFilter;
                    if (date === 'last-week') {
                        dateFilter = new Date(now.setDate(now.getDate() - 7));
                    }
                    else if (date === 'last-month') {
                        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
                    }
                    filter.time = { $gte: dateFilter };
                }
                if (user_id) {
                    filter["applicants_id.user_id"] = { $nin: [user_id] };
                    filter.list = true;
                }
                const jobCount = yield jobModel_1.default.find(filter).countDocuments();
                const jobs = yield jobModel_1.default.find(filter)
                    .sort({ time: -1 })
                    .skip(pages)
                    .limit(8)
                    .populate('company_id');
                if (jobs.length === 0) {
                    return null;
                }
                return {
                    count: Math.ceil(jobCount / 8),
                    jobs
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find jobs");
            }
        });
    }
    getPosts(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skipCount = Number(page) * 2;
                const count = yield postModel_1.default.find().countDocuments();
                const posts = yield postModel_1.default.find({}).skip(skipCount).limit(2).sort({ time: -1 }).populate('company_id').populate('like');
                if (posts.length == 0) {
                    return null;
                }
                return {
                    count: Math.ceil(count / 2),
                    posts: posts
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get posts");
            }
        });
    }
    likePost(likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post_id, user_id } = likeData;
                const liked = new likedPostModel_1.default(likeData);
                yield liked.save();
                const like = yield postModel_1.default.updateOne({ _id: post_id }, { $addToSet: { like: user_id } });
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to like post`);
            }
        });
    }
    unlikePost(post_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unLiked = yield likedPostModel_1.default.deleteOne({ post_id: post_id });
                const unLike = yield postModel_1.default.updateOne({ _id: post_id }, { $pull: { like: user_id } });
                return unLiked.acknowledged ? unLiked.acknowledged : null;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to unlike post`);
            }
        });
    }
    savePost(postData, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (message == "saved") {
                    const saved = new savedPostModel_1.default(postData);
                    yield saved.save();
                    return true;
                }
                else {
                    const { post_id } = postData;
                    const remove = yield savedPostModel_1.default.deleteOne({ post_id: post_id });
                    return remove.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to save post`);
            }
        });
    }
    likedPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield likedPostModel_1.default.find({ user_id: user_id });
                return postData ? postData : null;
                console.log("s;sksk;");
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to get liked post`);
            }
        });
    }
    getSavedpost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPost = yield savedPostModel_1.default.find({ user_id: id }).populate('post_id').populate('company_id');
                return savedPost ? savedPost : null;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to get savedpost`);
            }
        });
    }
    postcomment(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postcomment = new commentModel_1.default(commentData);
                yield postcomment.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to post comment`);
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
    findJobdetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel_1.default.findOne({ _id: id }).populate('company_id');
                return jobs ? jobs : null;
            }
            catch (error) {
                console.error(error);
                throw new Error('Unable to find job');
            }
        });
    }
    addExperience(experienceData, percentage, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (percentage === 15) {
                    const experience = yield userModel_1.default.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $inc: { percentage: percentage } });
                    return experience.acknowledged;
                }
                else {
                    const experience = yield userModel_1.default.updateOne({ _id: id }, { $addToSet: { experience: experienceData }, $set: { percentage: percentage } });
                    return experience.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error('Unable to save user experience');
            }
        });
    }
    updateResume(id, resumeurl, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resumeUrlsArray = Array.isArray(resumeurl) ? resumeurl : [resumeurl];
                if (percentage === 15) {
                    const update = yield userModel_1.default.updateOne({ _id: id }, {
                        $addToSet: { resume_url: { $each: resumeUrlsArray } },
                        $inc: { percentage: percentage }
                    });
                    return update.acknowledged;
                }
                else {
                    // const update = await userModel.updateOne({ _id: id }, { $set: { resume_url: resume_url, percentage: percentage } })
                    const update = yield userModel_1.default.updateOne({ _id: id }, {
                        $addToSet: { resume_url: { $each: resumeUrlsArray } },
                        $set: { percentage: percentage }
                    });
                    return update.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error('Unable to update user resume');
            }
        });
    }
    applyJob(job_id, user_id, company_id, resume_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = { job_id: job_id, user_id: user_id, company_id: company_id };
                const jobData = { user_id: user_id, resume_url: resume_url };
                const job = yield jobModel_1.default.updateOne({ _id: job_id }, { $addToSet: { applicants_id: jobData } });
                const jobCount = yield userModel_1.default.updateOne({ _id: user_id }, { $inc: { jobapplied_Count: 1 } });
                const saveApplied = new jobApplied_1.default(data);
                yield saveApplied.save();
                return job.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error('Unable to apply user for job');
            }
        });
    }
    getsubscriptionplan() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plans = yield subscription_1.default.find({ unlist: false });
                return plans ? plans : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get subscriptiondetails");
            }
        });
    }
    findPlanbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionData = yield subscription_1.default.findOne({ _id: id });
                return subscriptionData ? subscriptionData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get subscriptiondetails");
            }
        });
    }
    savesubscribedUsers(subscribedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = new subscribedUsersModel_1.default(subscribedData);
                yield saved.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save subscribed users");
            }
        });
    }
    updatesubscribedUsers(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status === 'success') {
                    const updated = yield subscribedUsersModel_1.default.updateOne({ session_id: id }, { $set: { payment_status: true } });
                    const plan = yield subscribedUsersModel_1.default.findOne({ session_id: id });
                    const subscriptionPlan = yield subscription_1.default.findOne({ _id: plan === null || plan === void 0 ? void 0 : plan.plan_id });
                    const userUpdate = yield userModel_1.default.updateOne({ _id: plan === null || plan === void 0 ? void 0 : plan.user_id }, { $set: { plan_id: subscriptionPlan === null || subscriptionPlan === void 0 ? void 0 : subscriptionPlan._id } });
                    return updated.acknowledged;
                }
                else {
                    const updated = yield subscribedUsersModel_1.default.deleteOne({ session_id: id });
                    return updated.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update subscribed users");
            }
        });
    }
    findSubscribedUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield subscribedUsersModel_1.default.findOne({ user_id: id, payment_status: true }).populate('user_id').populate('plan_id');
                return user ? user : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find subscribed user");
            }
        });
    }
    updateSkill(skill, id, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updateResult;
                if (percentage === 15) {
                    updateResult = yield userModel_1.default.updateOne({ _id: id }, { $addToSet: { skills: { $each: skill } }, $inc: { percentage: percentage } });
                }
                else {
                    updateResult = yield userModel_1.default.updateOne({ _id: id }, { $addToSet: { skills: { $each: skill } }, $set: { percentage: percentage } });
                }
                return updateResult.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update user skill");
            }
        });
    }
    savePostReport(post_id, postreportData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield postReportModel_1.default.findOne({ post_id: post_id });
                if (!report) {
                    const data = { post_id: post_id, user_datas: postreportData };
                    const saved = new postReportModel_1.default(data);
                    yield saved.save();
                    return true;
                }
                else {
                    const update = yield postReportModel_1.default.updateOne({ post_id: post_id }, { $addToSet: { user_datas: postreportData } });
                    return update.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save postreport");
            }
        });
    }
    findAppliedJobs(user_id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = Number(page) * 8;
                const jobCount = yield jobApplied_1.default.find().countDocuments();
                const jobs = yield jobApplied_1.default.find({ user_id: user_id }).skip(pages).limit(8).populate("job_id").populate('company_id').populate("job_id.company_id");
                if (jobs.length === 0) {
                    return null;
                }
                return {
                    count: Math.ceil(jobCount / 8),
                    jobs
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find applied jobs");
            }
        });
    }
    getUserdatas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.find({
                    is_blocked: false, is_verified: true, is_admin: false
                });
                return userData ? userData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find userdatas");
            }
        });
    }
    getCompanydatas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyData = yield companyModel_1.default.find({
                    is_verified: true, admin_verified: true, is_blocked: false
                });
                return companyData ? companyData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find companydatas");
            }
        });
    }
    findCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield companyModel_1.default.findOne({ _id: id });
                return company ? company : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find companydatas");
            }
        });
    }
    saveReviews(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewdata = new reviewRatingModel_1.default(reviewData);
                yield reviewdata.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save Reviews");
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
                const datas = {
                    review: reviewdata, counts: count
                };
                return datas ? datas : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get Reviews");
            }
        });
    }
    connectUser(id, connection_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connect = { connection_id };
                const user = { connection_id: id };
                const updaterUser = yield userModel_1.default.updateOne({ _id: id }, { $addToSet: { connections: connect } });
                const updateConnection = yield userModel_1.default.updateOne({ _id: connection_id }, { $addToSet: { connections: user } });
                if (updaterUser && updateConnection) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to connect user");
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
    connectCompany(user_id, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connect = { company_id };
                const user = { user_id: user_id };
                const updaterUser = yield userModel_1.default.updateOne({ _id: user_id }, { $addToSet: { companies: connect } });
                const updateConnection = yield companyModel_1.default.updateOne({ _id: company_id }, { $addToSet: { users: user } });
                if (updaterUser && updateConnection) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to connect company");
            }
        });
    }
    saveNotification(sender_id, reciever_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = { sender_id, reciever_id, message };
                const notification = new notification_1.default(data);
                yield notification.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save notification");
            }
        });
    }
    findNotification(sender_id, reciever_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notification_1.default.find({ sender_id: sender_id, reciever_id: reciever_id }).populate('sender_id');
                return notification ? notification : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find notification");
            }
        });
    }
    findConnectionRequest(reciever_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connections = yield notification_1.default.find({ reciever_id: reciever_id }).sort({ date: -1 }).populate("sender_id");
                return connections ? connections : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find connection");
            }
        });
    }
    manageConnection(user_id, connection_id, notification_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (message == "accept") {
                    const users = yield userModel_1.default.updateOne({ _id: user_id, 'connections.connection_id': connection_id }, { $set: { 'connections.$.status': true } });
                    const connection = yield userModel_1.default.updateOne({ _id: connection_id, 'connections.connection_id': user_id }, { $set: { 'connections.$.status': true } });
                    const notification = yield notification_1.default.deleteOne({ _id: notification_id });
                    return true;
                }
                else {
                    const users = yield userModel_1.default.updateOne({ _id: user_id }, { $pull: { connections: { connection_id: connection_id } } });
                    const connection = yield userModel_1.default.updateOne({ _id: connection_id }, { $pull: { connections: { connection_id: user_id } } });
                    const notification = yield notification_1.default.deleteOne({ _id: notification_id });
                    return true;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update connection");
            }
        });
    }
    saveInbox(sender_id, reciever_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data1 = { sender_id: sender_id, reciever_id: reciever_id, role: role };
                const data2 = { sender_id: reciever_id, reciever_id: sender_id, role: role };
                const exist = yield inboxModel_1.default.findOne({ sender_id: sender_id, reciever_id: reciever_id });
                if (!exist) {
                    const inbox = new inboxModel_1.default(data1);
                    yield inbox.save();
                    const inboxsave = new inboxModel_1.default(data2);
                    yield inboxsave.save();
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save ");
            }
        });
    }
    findInbox(sender_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inbox = yield inboxModel_1.default.find({
                    sender_id: sender_id, role: role
                })
                    .sort({ time: -1 })
                    .populate('reciever_id');
                return inbox ? inbox : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find inboxData ");
            }
        });
    }
    updateInbox(sender_id, reciever_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senderUpdate = yield inboxModel_1.default.updateOne({ sender_id: sender_id, reciever_id: reciever_id }, { message: message, time: Date.now() });
                const recieverUpdate = yield inboxModel_1.default.updateOne({ sender_id: reciever_id, reciever_id: sender_id }, { message: message, time: Date.now() });
                if (senderUpdate && recieverUpdate) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find inboxData ");
            }
        });
    }
    updateOnlineStatus(user_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const onlineStatus = yield userModel_1.default.updateOne({ _id: user_id }, { $set: { online: status } });
                return onlineStatus.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to update user online status ");
            }
        });
    }
    removeExperience(field, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield userModel_1.default.updateOne({ _id: id }, { $pull: { experience: { experiencefield: field } } });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to delete user experience ");
            }
        });
    }
    removeSkills(val, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield userModel_1.default.updateOne({ _id: id }, { $pull: { skills: val } });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to removeskills ");
            }
        });
    }
    addRewards(user_id, rewardData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reward = yield userModel_1.default.updateOne({ _id: user_id }, { $addToSet: { rewards: rewardData } });
                return reward.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to addRewards ");
            }
        });
    }
    addDocuments(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new messageModel_1.default(messageData);
                yield document.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to addDocuments");
            }
        });
    }
}
exports.default = userRepository;

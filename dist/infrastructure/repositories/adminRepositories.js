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
const companyModel_1 = __importDefault(require("../database/companyModel"));
const postModel_1 = __importDefault(require("../database/postModel"));
const postReportModel_1 = __importDefault(require("../database/postReportModel"));
const subscribedUsersModel_1 = __importDefault(require("../database/subscribedUsersModel"));
const subscription_1 = __importDefault(require("../database/subscription"));
const userModel_1 = __importDefault(require("../database/userModel"));
class AdminRespositories {
    findAdminbyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield userModel_1.default.findOne({ email: email });
                return adminData ? adminData : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find admindata");
            }
        });
    }
    getUserdatas(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skipCount = Number(page) * 3;
                const Count = yield userModel_1.default.find({ is_admin: false }).countDocuments();
                const userData = yield userModel_1.default.find({ is_admin: false }).skip(skipCount).limit(3);
                if (userData.length === 0) {
                    return null;
                }
                return {
                    count: Math.ceil(Count / 3),
                    userDatas: userData
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find userdatas");
            }
        });
    }
    getCompanydatas(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skipCount = Number(page) * 3;
                const Count = yield companyModel_1.default.find().countDocuments();
                console.log(Count);
                const companyData = yield companyModel_1.default.find().skip(skipCount).limit(3);
                if (companyData.length === 0) {
                    return null;
                }
                return {
                    count: Math.ceil(Count / 3),
                    companyDatas: companyData
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to find companydatas");
            }
        });
    }
    blockUnblockUsers(user_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status == "block") {
                    const updatedStatus = yield userModel_1.default.updateOne({ _id: user_id }, { $set: { is_blocked: true } });
                    return updatedStatus.acknowledged ? "User Blocked successfully" : "";
                }
                else {
                    const updatedStatus = yield userModel_1.default.updateOne({ _id: user_id }, { $set: { is_blocked: false } });
                    return updatedStatus.acknowledged ? "User UnBlocked successfully" : "";
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to block or unblock");
            }
        });
    }
    ;
    blockUnblockCompanies(company_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status == "verify") {
                    const updatedStatus = yield companyModel_1.default.updateOne({ _id: company_id }, { $set: { admin_verified: true } });
                    return updatedStatus.acknowledged ? "Company Verified Successfully" : "";
                }
                else if (status == "block") {
                    const updatedStatus = yield companyModel_1.default.updateOne({ _id: company_id }, { $set: { is_blocked: true } });
                    return updatedStatus.acknowledged ? "Company blocked Successfully" : "";
                }
                else if (status == "reject") {
                    const updatedStatus = yield companyModel_1.default.deleteOne({ _id: company_id });
                    return updatedStatus.acknowledged ? "Company rejected Successfully" : "";
                }
                else {
                    const updatedStatus = yield companyModel_1.default.updateOne({ _id: company_id }, { $set: { is_blocked: false } });
                    return updatedStatus.acknowledged ? "Company unblocked Successfully" : "";
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to block or unblock");
            }
        });
    }
    subscription(subscriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = new subscription_1.default(subscriptionData);
                yield subscription.save();
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to save subscriptiondetails");
            }
        });
    }
    getsubscriptionplan() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plans = yield subscription_1.default.find();
                return plans ? plans : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get subscriptiondetails");
            }
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePlan = yield subscription_1.default.deleteOne({ _id: id });
                return deletePlan.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to delete subscriptiondetails");
            }
        });
    }
    listUnlistPlans(id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (message == 'list') {
                    const listplan = yield subscription_1.default.updateOne({ _id: id }, { $set: { unlist: false } });
                    return listplan.acknowledged;
                }
                else {
                    const unListplan = yield subscription_1.default.updateOne({ _id: id }, { $set: { unlist: true } });
                    return unListplan.acknowledged;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(`Unable to ${message} subscriptionplan`);
            }
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCount = yield userModel_1.default.find().countDocuments();
                const companyCount = yield companyModel_1.default.find().countDocuments();
                const subscribedUsersCount = yield subscribedUsersModel_1.default.find().countDocuments();
                const dashboardData = { userCount, companyCount, subscribedUsersCount };
                return dashboardData;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get dashboard data");
            }
        });
    }
    getPostreportdata() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postReportdata = yield postReportModel_1.default.find().populate('post_id').populate('user_datas.user_id');
                return postReportdata ? postReportdata : null;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to get reportedpostdata data");
            }
        });
    }
    removePost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield postModel_1.default.deleteOne({ _id: post_id });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to  delete post");
            }
        });
    }
    deleteReportPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield postReportModel_1.default.deleteOne({ post_id: post_id });
                return remove.acknowledged;
            }
            catch (error) {
                console.error(error);
                throw new Error("Unable to delete reportpostdata");
            }
        });
    }
}
exports.default = AdminRespositories;

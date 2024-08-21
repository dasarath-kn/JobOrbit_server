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
class AdminUsecase {
    constructor(adminRepo, hashPassword, jwttoken) {
        this.adminRepo = adminRepo;
        this.hashPassword = hashPassword;
        this.jwttoken = jwttoken;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminExistdata = yield this.adminRepo.findAdminbyEmail(email);
                if (adminExistdata) {
                    let checkPassword = yield this.hashPassword.comparePassword(password, adminExistdata.password);
                    if (checkPassword) {
                        if (adminExistdata.is_admin) {
                            let id = adminExistdata._id.toString();
                            let token = yield this.jwttoken.generateToken(id, "admin");
                            return { success: true, adminExistdata, message: 'Admin logined successfully', token };
                        }
                        else {
                            return { success: false, message: 'Invalid admin ' };
                        }
                    }
                    else {
                        return { success: false, message: 'Invalid Password' };
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
    findUsers(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield this.adminRepo.getUserdatas(page);
                if (userData) {
                    const { count, userDatas } = userData;
                    return { success: true, message: "Userdatas sent suceessfully", userDatas, count };
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
    findCompanies(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let companyData = yield this.adminRepo.getCompanydatas(page);
                if (companyData) {
                    const { count, companyDatas } = companyData;
                    return { success: true, message: "Companydatas sent successfully", count, companyDatas };
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
    blockUnblockUsers(user_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let changeStatus = yield this.adminRepo.blockUnblockUsers(user_id, status);
                if (changeStatus) {
                    return { success: true, message: changeStatus };
                }
                else {
                    return { success: false, message: "Failed to block or unblock" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    blockUnblockCompanies(company_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let changeStatus = yield this.adminRepo.blockUnblockCompanies(company_id, status);
                if (changeStatus) {
                    return { success: true, message: changeStatus };
                }
                else {
                    return { success: false, message: changeStatus };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    savesubscriptionPlan(subscriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let savedSubscription = yield this.adminRepo.subscription(subscriptionData);
                if (savedSubscription) {
                    return { Success: true, message: "Subscription plan saved successfully" };
                }
                else {
                    return { Success: false, message: "Failed to save subscription plan" };
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
                let subscriptionplan = yield this.adminRepo.getsubscriptionplan();
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
    removePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let remove = yield this.adminRepo.deletePlan(id);
                if (remove) {
                    return { success: true, message: "Plan removed successfully" };
                }
                else {
                    return { success: false, message: "Failed to remove" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    managePlans(id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let manage = yield this.adminRepo.listUnlistPlans(id, message);
                if (manage) {
                    return { success: true, message: `Plan ${message} successfully` };
                }
                else {
                    return { success: false, message: `Failed to ${message} plan` };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dashboardData = yield this.adminRepo.getDashboard();
                if (dashboardData) {
                    return { success: true, message: 'Dashboard data sent successfully', dashboardData };
                }
                else {
                    return { success: false, message: 'Failed to sent dashboard data' };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    postreport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postReportData = yield this.adminRepo.getPostreportdata();
                if (postReportData) {
                    return { success: true, message: "Post report data sent successfully", postReportData };
                }
                else {
                    return { success: false, message: "Failed to sent post report data" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    deletePost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield this.adminRepo.removePost(post_id);
                if (remove) {
                    const removeReportPost = yield this.adminRepo.deleteReportPost(post_id);
                    if (removeReportPost) {
                        return { success: true, message: "Post deleted successfully" };
                    }
                    else {
                        return { success: false, message: "Failed to delete post" };
                    }
                }
                else {
                    return { success: false, message: "Failed to delete post" };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = AdminUsecase;

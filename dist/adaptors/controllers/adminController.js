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
class adminController {
    constructor(adminUsecases) {
        this.adminUsecases = adminUsecases;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                let adminExist = yield this.adminUsecases.login(email, password);
                if (adminExist === null || adminExist === void 0 ? void 0 : adminExist.success) {
                    let { token } = adminExist;
                    res.status(200).json({ success: true, message: adminExist.message, token });
                }
                else {
                    res.status(400).json({ success: false, message: adminExist === null || adminExist === void 0 ? void 0 : adminExist.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    userBlockUnblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { user_id, status } = req.query;
                console.log(req.query);
                let blockUnblockUser = yield this.adminUsecases.blockUnblockUsers(user_id, status);
                console.log(blockUnblockUser);
                if (blockUnblockUser.success) {
                    res.status(200).json({ success: true, message: blockUnblockUser.message });
                }
                else {
                    res.status(400).json({ success: false, message: blockUnblockUser.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    companyBlockUnblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { company_id, status } = req.query;
            let blockUnblockCompany = yield this.adminUsecases.blockUnblockCompanies(company_id, status);
            if (blockUnblockCompany.success) {
                res.status(200).json({ success: true, message: blockUnblockCompany.message });
            }
            else {
                res.status(400).json({ success: false, message: blockUnblockCompany.message });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page } = req.query;
                let userDetails = yield this.adminUsecases.findUsers(page);
                if (userDetails.success) {
                    let { userDatas, count } = userDetails;
                    res.status(200).json({ success: true, message: userDetails.message, userDatas, count });
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
                const { page } = req.query;
                let companyDetails = yield this.adminUsecases.findCompanies(page);
                if (companyDetails.success) {
                    const { companyDatas, count } = companyDetails;
                    res.status(200).json({ success: true, messsage: companyDetails.message, companyDatas, count });
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
    subscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { subscriptiontype, limit, month, price } = req.body;
                let subscriptionData = { subscriptiontype, limit, month, price };
                console.log(subscriptionData);
                let save = yield this.adminUsecases.savesubscriptionPlan(subscriptionData);
                if (save.Success) {
                    res.status(200).json({ success: true, message: save.message });
                }
                else {
                    res.status(400).json({ success: false, message: save.message });
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
                let subscriptionData = yield this.adminUsecases.subscriptionPlans();
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
    deletePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let removed = yield this.adminUsecases.removePlan(id);
                if (removed === null || removed === void 0 ? void 0 : removed.success) {
                    res.status(200).json({ success: true, message: removed.message });
                }
                else {
                    res.status(400).json({ success: false, message: removed === null || removed === void 0 ? void 0 : removed.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    listUnlistPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, message } = req.body;
                let manage = yield this.adminUsecases.managePlans(id, message);
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
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminUsecases.dashboard();
                if (data.success) {
                    const { dashboardData } = data;
                    res.status(200).json({ success: true, message: data.message, dashboardData });
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
    getPostreportdata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportdata = yield this.adminUsecases.postreport();
                if (reportdata.message) {
                    const { postReportData } = reportdata;
                    res.status(200).json({ success: true, message: reportdata.message, postReportData });
                }
                else {
                    res.status(400).json({ success: false, message: reportdata.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    removePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                console.log(id);
                const remove = yield this.adminUsecases.deletePost(id);
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
}
exports.default = adminController;

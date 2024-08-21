"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../adaptors/controllers/adminController"));
const adminUsecase_1 = __importDefault(require("../../useCases/adminUsecase"));
const adminRepositories_1 = __importDefault(require("../repositories/adminRepositories"));
const hashedPassword_1 = __importDefault(require("../utils/hashedPassword"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const adminRoute = express_1.default.Router();
const adminRepo = new adminRepositories_1.default();
const hashPassword = new hashedPassword_1.default();
const jwt = new jwtToken_1.default();
const adminUsecase = new adminUsecase_1.default(adminRepo, hashPassword, jwt);
const AdminController = new adminController_1.default(adminUsecase);
adminRoute.post('/login', (req, res) => AdminController.login(req, res));
adminRoute.get('/userdata', adminAuth_1.default, (req, res) => AdminController.getUsers(req, res));
adminRoute.get('/companydata', adminAuth_1.default, (req, res) => AdminController.getComapnies(req, res));
adminRoute.patch('/userblockunblock', (req, res) => AdminController.userBlockUnblock(req, res));
adminRoute.patch('/companyblockunblock', (req, res) => AdminController.companyBlockUnblock(req, res));
adminRoute.post('/subscription', adminAuth_1.default, (req, res) => AdminController.subscription(req, res));
adminRoute.
    route('/getsubscriptionplan')
    .all(adminAuth_1.default)
    .get((req, res) => AdminController.getSubscriptionPlans(req, res))
    .delete((req, res) => AdminController.deletePlan(req, res))
    .patch((req, res) => AdminController.listUnlistPlan(req, res));
adminRoute.get('/dashboarddata', adminAuth_1.default, (req, res) => AdminController.getDashboard(req, res));
adminRoute.get('/getpostdata', adminAuth_1.default, (req, res) => AdminController.getPostreportdata(req, res));
adminRoute.delete('/removepost', adminAuth_1.default, (req, res) => AdminController.removePost(req, res));
exports.default = adminRoute;

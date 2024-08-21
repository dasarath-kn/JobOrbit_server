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
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const adminRepositories_1 = __importDefault(require("../repositories/adminRepositories"));
const adminRepo = new adminRepositories_1.default();
const jwt = new jwtToken_1.default();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(400).json({ success: false, message: "Unauthorised Access " });
        }
        const verify = jwt.verifyJwttoken(authHeader);
        if (!verify || verify.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Unauthorised Access -Invalid token" });
        }
        // const company =await adminRepo.getCompanydata(verify.id)
        // if(company?.is_blocked){
        //     return res.status(401).json({ success: false, message: "Company is blocked by admin", blocked: true });
        // }
        req.id = verify.id;
        return next();
    }
    catch (error) {
        if (error.message === 'Token has expired') {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
    }
});
exports.default = adminAuth;

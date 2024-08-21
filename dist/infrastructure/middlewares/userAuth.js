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
const userRepositories_1 = __importDefault(require("../repositories/userRepositories"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const userRepo = new userRepositories_1.default();
const jwt = new jwtToken_1.default();
const Auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(400).json({ success: false, message: "Unauthorised Access " });
        }
        const verify = jwt.verifyJwttoken(authHeader);
        if (!verify || verify.role !== 'user') {
            return res.status(401).json({ success: false, message: "Unauthorised Access -Invalid token", blocked: true });
        }
        const user = yield userRepo.findUserById(verify.id);
        if (user === null || user === void 0 ? void 0 : user.is_blocked) {
            return res.status(401).json({ success: false, message: "User is blocked by admin", blocked: true });
        }
        req.id = verify.id;
        return next();
    }
    catch (error) {
        if (error.message === "Token has expired") {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
        // const refreshtoken =req.headers['refresh-token'];
        // if(refreshtoken){
        //     const refreshtokenPayload =jwt.verifyRefreshToken(refreshtoken as string)
        //     const newaccesstoken =jwt.generateToken(refreshtokenPayload?.id,'user')
        //     const newRefreshtoken =jwt.generateRefreshtoken(refreshtokenPayload?.id,'user')
        //     return res.status(200).json({success:true,newaccesstoken,newRefreshtoken})
        // }
        // if (error.name === 'TokenExpiredError') {
        //     console.log("slfsldfjljfl");
        //     return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        // }
        // return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token",blocked:true });
    }
});
exports.default = Auth;

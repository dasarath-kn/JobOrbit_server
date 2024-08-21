"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Jwt {
    constructor() {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
        }
        this.jwtsecretkey = process.env.JWT_SECRET_KEY;
    }
    generateToken(id, role) {
        try {
            const payload = { id, role };
            const token = jsonwebtoken_1.default.sign(payload, this.jwtsecretkey, { expiresIn: "1d" });
            return token;
        }
        catch (error) {
            console.error(error);
        }
    }
    generateRefreshtoken(id, role) {
        try {
            const payload = { id, role };
            const refreshtoken = jsonwebtoken_1.default.sign(payload, this.jwtsecretkey, { expiresIn: "6d" });
            return refreshtoken;
        }
        catch (error) {
            console.error(error);
        }
    }
    verifyJwttoken(token) {
        try {
            const verify = jsonwebtoken_1.default.verify(token, this.jwtsecretkey);
            return verify;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                console.error('Token has expired:', error);
                throw new Error('Token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.error('Invalid token:', error);
                throw new Error('Invalid token');
            }
            else {
                console.error('Error while verifying token:', error);
                throw new Error('Failed to verify token');
            }
        }
    }
}
exports.default = Jwt;

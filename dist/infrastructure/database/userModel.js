"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const ExperienceSchema = new mongoose_1.Schema({
    experiencefield: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date
    },
    responsibilities: {
        type: String,
        required: true
    }
});
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    phonenumber: {
        type: Number,
    },
    field: {
        type: String,
    },
    location: {
        type: String,
    },
    about: {
        type: String
    },
    img_url: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_google: {
        type: Boolean
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    github_url: {
        type: String
    },
    portfolio_url: {
        type: String
    },
    resume_url: {
        type: [String],
        default: []
    },
    skills: {
        type: [String]
    },
    percentage: {
        type: Number,
        default: 40,
        max: 100
    },
    qualification: {
        type: String
    },
    experience: {
        type: [ExperienceSchema],
        default: []
    },
    jobapplied_Count: {
        type: Number,
        default: 0
    },
    jobapplied_LastReset: {
        type: Date,
        default: Date.now
    },
    plan_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'subscription'
    },
    online: {
        type: Boolean,
        default: false
    },
    connections: [{
            connection_id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'user'
            },
            status: {
                type: Boolean,
                default: false
            }
        }],
    companies: [{
            company_id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'company'
            }
        }],
    rewards: [{
            awardTitle: { type: String },
            issuedBy: { type: String },
            details: { type: String },
            img_url: {
                type: String
            }
        }]
});
const userModel = (0, mongoose_1.model)('user', userSchema);
exports.default = userModel;
node_cron_1.default.schedule('1 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        const users = yield userModel.find({ jobapplied_LastReset: { $lte: oneDayAgo } });
        for (const user of users) {
            user.jobapplied_Count = 0;
            user.jobapplied_LastReset = new Date();
            yield user.save();
        }
        console.log(`Reset jobapplied_Count for ${users.length} users.`);
    }
    catch (error) {
        console.error('Error resetting jobapplied_Count:', error);
    }
}));

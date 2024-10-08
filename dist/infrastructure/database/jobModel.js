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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const jobSchema = new mongoose_1.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, responsibilities: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    company_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'company'
    },
    applicants_id: [{
            user_id: { type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'user' },
            resume_url: {
                type: String
            }
        }],
    time: {
        type: Date,
        default: Date.now
    },
    list: {
        type: Boolean,
        default: true
    },
    closedate: {
        type: String,
        required: true
    },
    unlistTime: {
        type: Date,
        required: true
    }
});
const jobModel = (0, mongoose_1.model)('job', jobSchema);
exports.default = jobModel;

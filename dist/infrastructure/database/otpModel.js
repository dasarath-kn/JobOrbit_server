"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }, createdAt: {
        type: Date,
        default: Date.now,
        expires: 180
    }
});
const otpModel = (0, mongoose_1.model)('otp', otpSchema);
exports.default = otpModel;

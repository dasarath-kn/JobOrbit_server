"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    subscriptiontype: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    unlist: {
        type: Boolean,
        default: false
    }
});
const subscriptionModel = (0, mongoose_1.model)('subscription', subscriptionSchema);
exports.default = subscriptionModel;

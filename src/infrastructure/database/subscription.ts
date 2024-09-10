import mongoose, { model, Schema } from "mongoose";
import subscriptions from "../../entities/subscriptions";

const subscriptionSchema: Schema<subscriptions> = new Schema({
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
    unlist:{
        type:Boolean,
        default:false
    }
    




})

const subscriptionModel = model<subscriptions>('subscription',subscriptionSchema)
export default subscriptionModel
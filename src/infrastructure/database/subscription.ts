import mongoose, { model, Schema } from "mongoose";
import subscriptions from "../../entities/subscriptions";
// const userdetailsSchema = new Schema({
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId
//     },
//     transaction_id: {
//         type: String
//     },
//     activated_date: {
//         type: Date
//     },
//     expiry_date: {
//         type: Date
//     }

// })
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
    // userdetails: {
    //     type: [userdetailsSchema],
    //     default: []
    // }




})

const subscriptionModel = model<subscriptions>('subscription',subscriptionSchema)
export default subscriptionModel
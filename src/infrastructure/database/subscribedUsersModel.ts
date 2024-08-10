import mongoose, { model, Schema } from "mongoose";
import subscriptedUser from "../../entities/subscribedUser";

const subscribedSchema:Schema<subscriptedUser> = new Schema({
    session_id:{
        type:String,
        required:true
    },
    plan_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subscription'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    activation_date:{
        type:Date,
        default:Date.now()
        
    },
    expiry_date:{
        type:Date
        
    },
    payment_status:{
        type:Boolean,
        default:false
    }
})

const subscribedModel = model<subscriptedUser>('subscripteduser',subscribedSchema)
export default subscribedModel
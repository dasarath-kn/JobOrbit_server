import mongoose from "mongoose"

interface subscriptions{
    subscriptiontype:string,
    price:number,
    limit:number,
    month:number,
    unlist:boolean
    // userdetails:[{
    //     user_id:mongoose.Schema.Types.ObjectId,
    //     transaction_id:string,
    //     activated_date:Date,
    //     expiry_date:Date
    // }]
}
export default subscriptions
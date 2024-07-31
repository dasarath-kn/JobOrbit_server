import mongoose from "mongoose";

 interface postreport {
    post_id:mongoose.Schema.Types.ObjectId,
    user_datas:[{
    user_id:mongoose.Schema.Types.ObjectId,
    report_message:String,
    date:Date
    
    }]

}
export default postreport
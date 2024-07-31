import mongoose, { model, Schema } from "mongoose";
import postreport from "../../entities/postreport";

const postReportSchema: Schema<postreport> = new Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    user_datas: [ {user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
        },
        report_message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }}]
})

const postReportModel = model<postreport>('postreport', postReportSchema)
export default postReportModel
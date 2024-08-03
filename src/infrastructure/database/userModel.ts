
import mongoose, {Mongoose, Schema,model} from "mongoose";
import user from "../../entities/user";
import cron from 'node-cron';
const ExperienceSchema = new Schema({
    experiencefield: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    start_date:{
      type:Date,
      required:true
    },
    end_date:{
      type:Date

    },
    responsibilities: {
      type: String,
      required: true
    }
  });
const userSchema:Schema<user> =new Schema({
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
        type: String
      },
      skills: {
        type: [String]
      },
      percentage:{
        type:Number,
        default:25

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
      plan_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subscription'
      },
      connections:[{
            connection_id:{
              type:mongoose.Schema.Types.ObjectId,
              ref:'user'
            },
            status:{
              type:Boolean,
              default:false
            }
      }]
    


})
const userModel = model<user>('user',userSchema)
export default userModel

cron.schedule('0 0 * * *', async () => { 
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const users = await userModel.find({ jobapplied_LastReset: { $lte: oneDayAgo } });

    for (const user of users) {
      user.jobapplied_Count = 0;
      user.jobapplied_LastReset = new Date();
      await user.save();
    }

    console.log(`Reset jobapplied_Count for ${users.length} users.`);
  } catch (error) {
    console.error('Error resetting jobapplied_Count:', error);
  }
});

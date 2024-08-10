import { comment } from "../../entities/comment";
import company from "../../entities/company";
import jobs from "../../entities/jobs";
import jobShedule from "../../entities/jobScheduled";
import message from "../../entities/message";
import { Post } from "../../entities/posts";
import ICompanyInterface from "../../useCases/interfaces/ICompanyInterface";
import commentModel from "../database/commentModel";
import companyModel from "../database/companyModel";
import jobModel from "../database/jobModel";
import JobScheduledModel from "../database/jobSheduled";
import messageModel from "../database/messageModel";
import otpModel from "../database/otpModel";
import postModel from "../database/postModel";
import reviewandRatingModel from "../database/reviewRatingModel";
import { ObjectId } from 'mongodb';

class CompanyRepositories implements ICompanyInterface {

   async saveCompany(companyData: company): Promise<company | null> {
      try {
         let newCompany = new companyModel(companyData)
         await newCompany.save()
         return companyData ? companyData : null
      } catch (error) {
         console.error(error);
         throw new Error("Unable to save new company")

      }
   }

   async findCompanyByEmail(email: string): Promise<company | null> {
      try {
         let companyData = await companyModel.findOne({ email: email })
         return companyData ? companyData : null

      } catch (error) {
         console.error(error);
         throw new Error("Unable to find company");

      }
   }
   async checkOtp(otp: string): Promise<string | null> {
      try {
         let checkedOtp = await otpModel.findOne({ otp: otp })
         return checkedOtp ? checkedOtp.email : null

      } catch (error) {
         console.error(error);
         throw new Error("Unable to find otp")

      }
   }

   async verifyCompany(email: string): Promise<boolean> {
      try {
         let verifyCompany = await companyModel.updateOne({ email: email }, { $set: { is_verified: true } }, { upsert: true })
         return verifyCompany.acknowledged

      } catch (error) {
         console.error(error);
         throw new Error("Unable to verfiy company")

      }
   }

   async saveCompanydata(companydata: company): Promise<company | null> {
      try {
         let findCompany = await companyModel.findOne({ email: companydata.email })
         if (findCompany) {
            return findCompany
         } else {
            let saveCompany = new companyModel(companydata)
            await saveCompany.save()
            if (saveCompany) {
               let data = await companyModel.findOne({ email: saveCompany.email })
               return data
            } else {
               return null
            }
         }
      } catch (error) {
         console.error(error);
         throw new Error("Unable to save companydata")

      }
   }

   async getCompanydata(id: string): Promise<company | null> {
      try {
         let companData = await companyModel.findOne({ _id: id }).populate("users.user_id")
         return companData ? companData : null

      } catch (error) {
         console.error(error);
         throw new Error("Unable to get companydata")

      }
   }
   async resetPassword(company: company): Promise<boolean | null> {
      try {
         let { email, password } = company
         let reset = await companyModel.updateOne({ email: email }, { $set: { password: password } })
         if (reset) {
            return reset.acknowledged
         } else {
            return null
         }
      } catch (error) {
         console.error(error);
         throw new Error("Unable to reset password")

      }
   }
   async saveJobs(jobData: jobs): Promise<boolean | null> {
      try {
         const savedjob = new jobModel(jobData)
         await savedjob.save()
         if (savedjob) {
            return true
         } else {
            return null
         }
      } catch (error) {
         console.error(error);
         throw new Error("Unable to reset password")

      }
   }
   async getJobs(id: string): Promise<jobs[] | null> {
      try {
         let jobs = await jobModel.find({ company_id: id }).sort({ time: -1 }).populate('company_id')
         return jobs ? jobs : null
      } catch (error) {
         console.error(error);
         throw new Error("Unable to find jobs")
      }
   }
   async removeJob(id: string): Promise<boolean> {
      try {
         let removed = await jobModel.deleteOne({ _id: id })
         return removed.acknowledged
      } catch (error) {
         console.error(error);
         throw new Error("Unable to remove job")

      }
   }
   async savePosts(postData: Post): Promise<boolean> {
      try {
         let savedPost = new postModel(postData)
         await savedPost.save()
         return true

      } catch (error) {
         console.error(error);
         throw new Error("Unable to save post")
      }
   }
   async getPosts(id: string): Promise<Post[] | null> {
     try {
      let posts = await postModel.find({ company_id:id }).sort({time:-1}).populate('company_id')
      return posts ? posts : null
     } catch (error) {
      console.error(error);
      throw new Error("Unable to find post")
     }
   }
   async updateProfile(id: string, company: company): Promise<boolean> {
      try {
          let updated = await companyModel.updateOne({ _id: id }, company, { new: true })
          return updated.acknowledged

      } catch (error) {
          console.error(error);
          throw new Error("Unable to update companydata")
      }
  }
  async uploadDocument(id: string, document_url: string): Promise<boolean> {
     try {
      let upload = await companyModel.updateOne({_id:id},{$set:{document_url:document_url}})
      return upload.acknowledged
     } catch (error) {
      console.error(error);
      throw new Error("Unable to upload document")
     }
  }
 async deletePost(post_id: string): Promise<boolean> {
     try {
      let remove = await postModel.deleteOne({_id:post_id})
      return remove.acknowledged
     } catch (error) {
      console.error(error);
      throw new Error("Unable to delete post")
     }
  }
 async jobApplications(id: string): Promise<jobs[] | null> {
     try {
         let job = await jobModel.find({_id:id}).populate('applicants_id')
         return job ?job :null
     } catch (error) {
      console.error(error);
      throw new Error("Unable to get jobapplications")
     }
  }

 async saveScheduledJobs(jobScheduleddata: jobShedule): Promise<boolean> {
     try {
       let scheduled = new JobScheduledModel(jobScheduleddata)
       await scheduled.save()
       return true
     } catch (error) {
      console.error(error);
      throw new Error("Unable to save Schedule jobs")
     }
  }
 async getScheduledJobs(job_id: string): Promise<jobShedule[] | null> {
     try {
      const scheduled = await JobScheduledModel.find({job_id:job_id})
      return scheduled ?scheduled : null
      
     } catch (error) {
      console.error(error);
      throw new Error("Unable to get Schedule jobs")
     }
  }
  async findScheduledJobs(id:string): Promise<jobShedule[] | null> {
     try {
      let scheduled = await JobScheduledModel.find({job_id:id}).populate('user_id')
      return scheduled ?scheduled :null
     } catch (error) {
      console.error(error);
      throw new Error("Unable to find Schedule jobs")
     }
  }
  async getReviews(id: string): Promise<data | null> {
   try {
       const objectId = new ObjectId(id);
       const reviewdata = await reviewandRatingModel.find({ company_id: id }).populate('user_id')
       const count = []
       for (let i = 5; i >= 1; i--) {
           const averageStar = await reviewandRatingModel.aggregate([{ $match: { company_id: objectId, rating_count: i } }, { $group: { _id: null, average: { $avg: "$rating_count" } } }])

           if (averageStar.length == 0) {
               count.push(0)

           } else {
               count.push(averageStar[0].average)

           }
       }
       const data = {
           review: reviewdata, counts: count
       }

       return data ? data : null

   } catch (error) {
       console.error(error);
       throw new Error("Unable to get Reviews")

   }

}
async saveMessages(messageData: message): Promise<boolean> {
   try {
       const saveMessages = new messageModel(messageData)
       await saveMessages.save()
       return true
   } catch (error) {
       console.error(error);
       throw new Error("Unable to save message") 
   }
}
async getMessages(reciever_id: string,sender_id:string): Promise<messages | null> {
   try {
    const sender = await messageModel.find({reciever_id:reciever_id,sender_id:sender_id})
    const reciever = await messageModel.find({reciever_id:sender_id,sender_id:reciever_id})
    const messages ={
        sender:sender,
        reciever:reciever
    }
    
    return messages ? messages : null
   } catch (error) {
    console.error(error);
    throw new Error("Unable to get message") 
   }
}
 
async getcomment(id: string): Promise<comment[] | null> {
   try {
       const comments = await commentModel.find({ post_id: id }).populate('user_id').populate('company_id')
       return comments ? comments : null
   } catch (error) {
       console.error(error);
       throw new Error(`Unable to find comments`)
   }
}

async replycomment(comment_id: string, reply: string): Promise<boolean> {
   try {
      const commmentReply = await commentModel.updateOne({_id:comment_id},{$set:{reply:reply,replied:true}})
      return commmentReply.acknowledged
   } catch (error) {
      console.error(error);
      throw new Error(`Unable to reply comments`)
  }
   
}
async deleteApplicant(job_id: string, user_id: string): Promise<boolean> {
   try {
      const remove = await jobModel.updateOne({_id:job_id},{$pull:{applicants_id:user_id}})
      return remove.acknowledged
   } catch (error) {
      console.error(error);
      throw new Error(`Unable to delete applicant`)
  }
}
}


export default CompanyRepositories
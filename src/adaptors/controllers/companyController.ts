import mongoose from "mongoose"
import company from "../../entities/company"
import CompanyUsecase from "../../useCases/companyUsecase"
import { Response, Request } from "express"
import jobs from "../../entities/jobs"
import jobShedule from "../../entities/jobScheduled"
class CompanyController {
    private companyusecase: CompanyUsecase
    constructor(companyusecase: CompanyUsecase) {
        this.companyusecase = companyusecase
    }

    async login(req: Request, res: Response) {
        try {
            let { email, password } = req.body
            let companyDetails = await this.companyusecase.login(email, password)
            let { companyData } = companyDetails
            if (companyDetails.success) {
                let { token } = companyDetails
                res.status(200).json({ success: true, message: companyDetails.message, companyData, token })
            } else {
                res.status(400).json({ success: false, message: companyDetails.message })
            }


        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async signUp(req: Request, res: Response) {
        try {
            const { companyname, email, phonenumber, password, industry, state, city, address, about } = req.body
            const companyData = { companyname, email, phonenumber, password, industry, state, city, address, about }
            const companyExist = await this.companyusecase.signUp(companyData as company)
            let { companySaved } = companyExist
            if (companyExist.success) {
                res.status(200).json({ success: true, message: companyExist.message, companySaved })
            } else {
                res.status(400).json({ success: false, message: companyExist.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })


        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            let { otp } = req.body

            let verfiyOtp = await this.companyusecase.verifyOtp(otp)
            if (verfiyOtp.success) {
                const { token } = verfiyOtp
                res.status(200).json({ success: true, message: verfiyOtp.message, token })
            } else {
                res.status(400).json({ success: false, message: verfiyOtp.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async googleSignup(req: Request, res: Response) {
        try {
            let { name, email, isGoogle } = req.body
            let companyname = name
            let is_google = isGoogle
            let companydata = { companyname, email, is_google }

            let companySaveddata = await this.companyusecase.googleSavecompany(companydata as company)
            if (companySaveddata.success) {
                let { token } = companySaveddata
                res.status(200).json({ success: true, message: companySaveddata.message, token })
            } else {
                res.status(400).json({ success: false, message: companySaveddata.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async getCompanydata(req: Request, res: Response) {
        try {
            let { id } = req
            let companyData = await this.companyusecase.companData(id as string)
            if (companyData.success) {
                let { companydata } = companyData
                res.status(200).json({ success: true, message: companyData.message, companydata })
            } else {
                res.status(400).json({ success: false, message: companyData.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async verifyCompany(req: Request, res: Response) {
        try {
            let { email } = req.body
            let companydata = await this.companyusecase.companyExist(email)
            console.log(companydata);

            if (companydata.success) {
                const { companyData } = companydata
                res.status(200).json({ success: true, message: companydata.message, companyData })
            } else {
                res.status(400).json({ success: false, message: companydata.message })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            let { email, password } = req.body
            const companydata = { email, password }
            console.log(req.body);

            let resetpassword = await this.companyusecase.passwordReset(companydata as company)
            if (resetpassword.success) {
                res.status(200).json({ success: true, message: resetpassword.message })
            } else {
                res.status(400).json({ success: false, message: resetpassword.message })

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }
    async addJobs(req: Request, res: Response) {
        try {
            const { id } = req
            const company_id = id
            let { jobtitle, description, responsibilities, requirements, qualification, location, type,skills } = req.body
            const jobData = { description, responsibilities, requirements,skills, qualification, jobtitle, location, type, company_id: new mongoose.Types.ObjectId(company_id) }
            let jobs = await this.companyusecase.savingJobs(jobData as jobs)
            if (jobs.success) {
                res.status(200).json({ success: true, message: jobs.message })
            } else {
                res.status(400).json({ success: false, message: jobs.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })

        }
    }

    async getJobs(req: Request, res: Response) {
        try {
            let { id } = req
            let jobs = await this.companyusecase.jobs(id as string)
            if (jobs.success) {
                const { jobData } = jobs
                res.status(200).json({ success: true, message: jobs.message, jobData })
            } else {
                res.status(400).json({ success: false, message: jobs.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async deleteJob(req: Request, res: Response) {
        try {
            let { id } = req.query
            let removed = await this.companyusecase.jobRemove(id as string)
            if (removed.success) {
                res.status(200).json({ success: true, message: removed.message })
            } else {
                res.status(400).json({ success: false, message: removed.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async addPost(req: Request, res: Response) {
        try {
            const { id } = req
            const company_id=id
            const files = req.files?.map((val) => val.path)
            const { description } = req.body
            const postData = {company_id,description, images: [] }
            let post = await this.companyusecase.savePost(postData, files)
            if (post.success) {
                res.status(200).json({ success: true, message: post.message })
            } else {
                res.status(400).json({ success: false, message: post.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async getPosts(req:Request,res:Response){
        try {
            const {id} =req
            let postDatas = await this.companyusecase.Posts(id as string)
            if(postDatas.success){
                const {posts}=postDatas
                res.status(200).json({success:true,message:postDatas,posts})
            }else{
                res.status(400).json({success:false,message:postDatas.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
        }
        async editProfile(req:Request,res:Response){
            try {
                const {id}=req
                const {companyname,city,industry,address,website_url,about}=req.body
                const companyData ={companyname,city,industry,address,website_url,about,img_url:''}
                 const file =req.file?.path
                let editProfile =await this.companyusecase.updateProfile(id as string,companyData as company,file as string)
                if(editProfile.success){
                    const {companyData}=editProfile
                    res.status(200).json({success:true,message:editProfile.message,companyData})
                }else{
                    res.status(400).json({success:false,message:editProfile.message})
                    
                }            
                
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})
                
            }
        }
        async uploadDocument(req:Request,res:Response){
            try {
                const {id}=req
                const file = req.file?.path
                const upload = await this.companyusecase.documentUpload(id as string,file as string)
                if(upload.success){
                    res.status(200).json({success:true,message:upload.message})
                }else{
                    res.status(400).json({success:false,message:upload.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})  
            }
        }

        async deletePost(req:Request,res:Response){
            try {
                let {id} =req.query
                console.log(id);
                
                let removepost = await this.companyusecase.removePost(id as string)
                if(removepost?.success){
                    res.status(200).json({success:true,message:removepost.message})
                }else{
                    res.status(400).json({success:false,message:removepost?.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})  
            }
        }

        async jobApplications(req:Request,res:Response){
            try {
                const {job_id} =req.query
                let appllications = await this.companyusecase.userAppliedJobs(job_id as string)
                if(appllications.success){
                    const {appliedUsers} =appllications
                    res.status(200).json({success:true,message:appllications.message,appliedUsers})
                }else{
                    res.status(400).json({success:false,message:appllications.message})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({success:false,message:"Internal server error"})  
            } 
            }

            async saveScheduledJobs(req:Request,res:Response){
                try {
                    const {time,date,message,user_id,job_id} =req.body
                    const {id} =req
                    console.log(req.body);
                    
                    const jobScheduleddata ={time,date,message,user_id,job_id,company_id:id,scheduled_time:Date.now()}
                    console.log(jobScheduleddata,"sdf");
                    
                    let saveData = await this.companyusecase.scheduledJobs(jobScheduleddata)
                    if(saveData.success){
                        res.status(200).json({success:true,message:saveData.message})
                    }else{
                        res.status(400).json({success:false,message:saveData.message})
                    }
                    
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success:false,message:"Internal server error"})  
                }
            }

            async getScheduledJobs(req:Request,res:Response){
                try {
                    const {job_id} =req.query
                    let scheduledjob = await this.companyusecase.scheduled(job_id as string)
                    if(scheduledjob.success){
                        const {scheduledJobdata} =scheduledjob
                        res.status(200).json({success:true,message:scheduledjob.message,scheduledJobdata})
                    }else{
                        res.status(400).json({success:false,message:scheduledjob.message})
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success:false,message:"Internal server error"})     
                }
            }

            async ScheduledJobs(req:Request,res:Response){
                try {
                    let scheduled = await this.companyusecase.getScheduledJobs()
                    if(scheduled.success){
                        const {scheduledJobs} =scheduled
                        console.log(scheduled,"d");
                        
                        res.status(200).json({success:true,message:scheduled.message,scheduledJobs})
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success:false,message:"Internal server error"})     
                }
            }

            async getReviews(req:Request,res:Response){
                try {
                    const {id} =req
                    const reviewDatas = await this.companyusecase.reviews(id as string)
                    if(reviewDatas.success){
                        const {reviews} =reviewDatas
                        
                        res.status(200).json({success:true,message:reviewDatas.message,reviews})
                    }else{
                        res.status(400).json({success:false,messagwe:reviewDatas.message})
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success:false,message:"Internal server error"})
                    
                }
            }
            async getMessages(req:Request,res:Response){
                try {
                    
                    const {_id} = req.query
                    const {id} =req
                    const reciever_id =_id
                    const sender_id =id
                    
                    const messageData = await this.companyusecase.message(reciever_id as string,sender_id as string)
                    if(messageData.success){
                        const {messages}=messageData
                        res.status(200).json({success:true,message:messageData.message,messages})
                    }else{
                        res.status(400).json({success:false,message:messageData.message})
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({success:false,message:"Internal server error"}) 
                }
            }
            async getcomments(req: Request, res: Response) {
                try {
                    
                    const { post_id } = req.query
                    
                    const comment = await this.companyusecase.comments(post_id as string)
                    if (comment.message) {
                        const { comments } = comment
                        res.status(200).json({ success: true, message: comment.message, comments })
                    } else {
                        res.status(400).json({ success: false, message: comment.message })
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Internal server error" })
                }
        
            }
            async replyComment(req:Request,res:Response){
                try {
                    const {comment_id,reply}=req.body
                    
                    const commentReply = await this.companyusecase.commentReply(comment_id,reply)
                    if(commentReply.success){
                        res.status(200).json({success:true,message:commentReply.message})
                    }else{
                        res.status(400).json({success:false,message:commentReply.message})
                    }
                    
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Internal server error" })
                }
            }
       
}


export default CompanyController
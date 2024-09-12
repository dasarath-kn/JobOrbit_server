import cron from 'node-cron';
import jobModel from '../database/jobModel';
import NodeMailer from './nodeMailer';
import companyModel from '../database/companyModel';
const nodeMailer = new NodeMailer()
export class CronJobService {
    constructor() {
        this.scheduleJobs();
    }

    private scheduleJobs() {
        cron.schedule('*/1 * * * *', async () => {
            try {
                
                 
                const now = new Date();
                const jobsToUnlist = await jobModel.find({
                    unlistTime: {
                      $lte: now
                    },
                    list: true
                  }).populate('company_id');
                
                for (const job of jobsToUnlist) {
                    job.list = false; 
                    await job.save(); 
                    const companyid =job.company_id
                    console.log(companyid,"companyid");
                    
                    const companyDetails = await companyModel.findOne({_id:companyid})
                    console.log(companyDetails,"details");
                    const date = new Date(job.unlistTime.toString())
                    const unlistdate =date.toLocaleDateString('en-Us')
                    await nodeMailer.jobUnlistedEmail(companyDetails?.companyname as string,companyDetails?.email as string,job.jobtitle,unlistdate)
                    console.log(`Unlisted job with ID: ${job._id}`);
                }
            } catch (error) {
                console.error('Error in cron job:', error);
            }
        });
    }
}

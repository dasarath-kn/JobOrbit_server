"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const jobModel_1 = __importDefault(require("../database/jobModel"));
const nodeMailer_1 = __importDefault(require("./nodeMailer"));
const companyModel_1 = __importDefault(require("../database/companyModel"));
const nodeMailer = new nodeMailer_1.default();
class CronJobService {
    constructor() {
        this.scheduleJobs();
    }
    scheduleJobs() {
        node_cron_1.default.schedule('*/1 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Cron job working");
                const now = new Date();
                const jobsToUnlist = yield jobModel_1.default.find({
                    unlistTime: {
                        $lte: now
                    },
                    list: true
                }).populate('company_id');
                for (const job of jobsToUnlist) {
                    job.list = false;
                    yield job.save();
                    const companyid = job.company_id;
                    console.log(companyid, "companyid");
                    const companyDetails = yield companyModel_1.default.findOne({ _id: companyid });
                    console.log(companyDetails, "details");
                    const date = new Date(job.unlistTime.toString());
                    const unlistdate = date.toLocaleDateString('en-Us');
                    yield nodeMailer.jobUnlistedEmail(companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.companyname, companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.email, job.jobtitle, unlistdate);
                    console.log(`Unlisted job with ID: ${job._id}`);
                }
            }
            catch (error) {
                console.error('Error in cron job:', error);
            }
        }));
    }
}
exports.CronJobService = CronJobService;

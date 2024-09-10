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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class NodeMailer {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS,
            }
        });
    }
    sendEmail(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: process.env.NODEMAILER_EMAIL,
                    to: id,
                    subject: 'Otp verification',
                    html: `<p>Hi, your OTP is <strong>${otp}</strong></p>`
                };
                this.transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log('Error sending email', error);
                    }
                    else {
                        console.log(`Email sent:${id}`);
                    }
                });
            }
            catch (error) {
                console.error('Error in sendEmail', error);
            }
        });
    }
    interviewEmail(jobScheduleddata, company_name, user_name, user_email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date, time } = jobScheduleddata;
                const mailOptions = {
                    from: process.env.NODEMAILER_EMAIL,
                    to: user_email,
                    subject: 'Your Interview is Scheduled!',
                    html: `
                <h2>Interview Scheduled</h2>
                <p>Dear ${user_name},</p>
                <p>You have been scheduled for an interview with <strong>${company_name}</strong>.</p>
                <p>Details:</p>
                <ul>
                  <li><strong>Date:</strong> ${date}</li>
                  <li><strong>Time:</strong> ${time}</li>
                </ul>
                <p>Please be prepared for the interview. Good luck!</p>
                <p>Best regards,</p>
                <p>JobOrbit Team</p>
              `
                };
                this.transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log('Error sending email', error);
                    }
                    else {
                        console.log(`Email sent`);
                    }
                });
            }
            catch (error) {
                console.error('Error in sendEmail', error);
            }
        });
    }
    jobUnlistedEmail(company_name, company_email, job_title, unlist_date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: process.env.NODEMAILER_EMAIL,
                    to: company_email,
                    subject: 'Important Update: Your Job Listing Has Been Unlisted',
                    html: `
                  <html>
                    <head>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #dddddd; }
                        .header { text-align: center; padding: 10px; border-bottom: 2px solid #dddddd; }
                        .header h2 { margin: 0; color: #333333; }
                        .content { padding: 20px; }
                        .content p { margin: 0 0 15px; color: #555555; }
                        .content ul { padding: 0; list-style: none; margin: 0; }
                        .content ul li { padding: 8px 0; border-bottom: 1px solid #eeeeee; }
                        .footer { padding: 10px; text-align: center; border-top: 2px solid #dddddd; }
                        .footer p { margin: 0; color: #777777; }
                        .footer a { color: #007bff; text-decoration: none; }
                        .footer a:hover { text-decoration: underline; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">
                          <h2>JobOrbit Notification</h2>
                        </div>
                        <div class="content">
                          <p>Dear <strong>${company_name}</strong>,</p>
                          <p>We want to inform you that the job listing for the position of <strong>${job_title}</strong> has been unlisted from the people</p>
                          <p><strong>Details:</strong></p>
                          <ul>
                            <li><strong>Job Title:</strong> ${job_title}</li>
                            <li><strong>Date of Unlisting:</strong> ${unlist_date}</li>
                          </ul>
                          <p>If you have any questions or need further assistance, please feel free to <a href="mailto:support@joborbit.com">contact us</a>. We're here to help!</p>
                        </div>
                        <div class="footer">
                          <p>Thank you for using JobOrbit. We appreciate your continued partnership.</p>
                          <p>Best regards,</p>
                          <p>The JobOrbit Team</p>
                        </div>
                      </div>
                    </body>
                  </html>
                `
                };
                this.transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log('Error sending email', error);
                    }
                    else {
                        console.log(`Email sent`);
                    }
                });
            }
            catch (error) {
                console.error('Error in sendEmail', error);
            }
        });
    }
}
exports.default = NodeMailer;

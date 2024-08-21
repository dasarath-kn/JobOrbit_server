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
}
exports.default = NodeMailer;

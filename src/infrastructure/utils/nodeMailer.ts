import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import NodeMailerIterface from '../../useCases/interfaces/INodeMailerInterface';
import jobShedule from '../../entities/jobScheduled';
dotenv.config()

class NodeMailer implements NodeMailerIterface {
    private transporter;

    constructor() {        
        this.transporter = nodemailer.createTransport({
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
    async sendEmail(id: string, otp: string): Promise<any> {
        try {        
            const mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: id,
                subject: 'Otp verification',
                html: `<p>Hi, your OTP is <strong>${otp}</strong></p>`
            };

            this.transporter.sendMail(mailOptions,(error:any) =>  {
                if (error) {
                    console.log('Error sending email',error);
                } else {
                    console.log(`Email sent:${id}`);
                }
            });


        } catch (error) {
            console.error('Error in sendEmail',error);

        }
    }
    async interviewEmail(jobScheduleddata:jobShedule,company_name:string,user_name:string,user_email:string): Promise<any> {
        try {   
            const {date,time}=jobScheduleddata     
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

            this.transporter.sendMail(mailOptions,(error:any) =>  {
                if (error) {
                    console.log('Error sending email',error);
                } else {
                    console.log(`Email sent:${id}`);
                }
            });


        } catch (error) {
            console.error('Error in sendEmail',error);

        }
    }

}
export default NodeMailer
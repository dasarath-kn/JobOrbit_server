import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import NodeMailerIterface from '../../useCases/interfaces/INodeMailerInterface';
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
        console.log(id,otp);
        
            const mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: id,
                subject: 'Otp verification',
                text: `<p>Hi,Your otp is <strong>${otp}</strong></p>`
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
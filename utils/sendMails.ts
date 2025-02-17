import dotenv from 'dotenv'
dotenv.config()
import nodemailer, { Transporter } from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
interface emailOptions {
    email: string;
    subject: string;
    template: string
    data: { [key: string]: any }
}
const sendMail = async (options: emailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
        }
    })
    const { email, subject, template, data } = options
    // get the path to the email template file
    const templatePath = path.join(__dirname, "../mails", template)
    try {
        // Render the email template with ejs
        const html: string = await ejs.renderFile(templatePath, data);
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };
        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
export default sendMail
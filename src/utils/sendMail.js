import { createTransport } from 'nodemailer';
/**
 * Send Email Module
 * @param emailTo Email Address to which mail has to be send.
 * @param email Email text that need to be send.
 * @param emailSubject Subject of email to be  send.
 * @returns messageId
 */
const sendEmail = async (emailTo, email, emailSubject, Attachment = null,) => {
    try {
        const host = process.env.emailhost
        const port = process.env.emailport
        const transporter = createTransport({
            host: host,
            port: port,
            secure: false,
            auth: {
                user: process.env.email_from,
                pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 10 * 60 * 1000,
        });
        const info = await transporter.sendMail({
            from: process.env.adminemail,
            to: emailTo,
            subject: emailSubject,
            text: email,
            html: `${email}`,
        });

        return info;
    } catch (error) {
        console.log(error, "error")
        return {
            status: 'Error',
            data: []
        }
    }

};
export default sendEmail;

import nodemailer from "nodemailer";

console.log({  
    user: process.env.SenderEmail, // generated ethereal user
    pass: process.env.SENDEREMAILPASSWORD, // generated ethereal password
 });
async function sendEmail(dest, subject, message , attachments=[]) {
    try {
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SenderEmail, // generated ethereal user
                pass: process.env.SENDEREMAILPASSWORD, // generated ethereal password
            },
        }); 
        let info = await transporter.sendMail({
            from: `"Route" <${process.env.SENDEREMAIL}>`,
            to: dest,
            subject,
            html: message,
            attachments
        });
        console.log({info});
        return info
    } catch (error) {
        console.log('Email Catch error ');
        console.log(error);

    }
}


export  default sendEmail

 
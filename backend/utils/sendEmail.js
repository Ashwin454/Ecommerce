const nodeMailer=require("nodemailer");

const sendEmail= async(options)=>{
    const transporter=nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        service:process.env.SMPT_service,
        auth:{
            user:process.env.SMPT_mail,
            pass:process.env.SMPT_password
        }
    })
    const mailOptions={
        from:process.env.SMPT_mail,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;
const nodemailer=require('nodemailer');
const sendEmail=async options=>{

    //create a Transporter

    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASS
        }
    });

    //Define an email options
    const mailOption={
        from:'Chhotwant Saw <chhotwantsaww@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    //Actually sending mail
    
    await transporter.sendMail(mailOption);
};

module.exports=sendEmail;
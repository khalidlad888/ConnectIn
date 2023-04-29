const { info } = require('node-sass');
const nodeMailer = require('../config/nodemailer');


//this is the another method of exporting
exports.newComment =(comment) => {
    console.log("Inside a newComment mailer", comment.user.email);

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'khalidlad888@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    }, (err, info)=> {
        if (err){console.log('Error in sending email', err); return;}
        console.log('Message sent', info);
        return;
    });
};
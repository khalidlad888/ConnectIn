const { info } = require('node-sass');
const nodeMailer = require('../config/nodemailer');


//this is the another method of exporting
exports.newPost =(post) => {
    console.log("Inside a newPosts mailer", post.user.email);

    let htmlString = nodeMailer.renderTemplate({post: post}, '/posts/new_post.ejs');

    nodeMailer.transporter.sendMail({
        from: 'khalidlad888@gmail.com',
        to: post.user.email,
        subject: 'New Post Published',
        html: htmlString
    }, (err, info)=> {
        if (err){console.log('Error in sending email', err); return;}
        console.log('Message sent', info);
        return;
    });
};
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMagicLinkEmail = async ({ email, token }) => {
    const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Finish logging in",
        text: 'test',
        html: `<a href="http://localhost:8888/.netlify/functions/api/verify?token=${token}">Log In</a>`
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
}

module.exports = {
    sendMagicLinkEmail
}
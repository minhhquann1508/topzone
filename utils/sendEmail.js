const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: '"Topzone Viet Nam" <topzone@gmail.com>',
        to: email,
        subject: "Forgot password",
        html
    });
    return info;
});

module.exports = sendEmail;


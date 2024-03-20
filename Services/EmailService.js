// In a new file, e.g., emailService.js, or at the top of UserService.js
const e = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendResetEmail(email, token) {
    // Create a transporter for nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_FROM, 
        to: email,
        subject: 'Password Reset Request',
        text: 'You requested a password reset.', 
        html: `
            <div style="text-align: center; margin: auto;">
                <p>You requested a password reset. Use this token in the application to reset the password:</p>
                <div style="border: 1px solid #000; padding: 10px; display: inline-block; margin: 10px auto; font-weight: bold;">
                    ${token}
                </div>
            </div>`,
    };
    

    // Send the email
    await transporter.sendMail(mailOptions);
}

exports.sendResetEmail = sendResetEmail;
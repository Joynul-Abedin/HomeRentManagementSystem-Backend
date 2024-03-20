// In a new file, e.g., emailService.js, or at the top of UserService.js
const e = require('express');
const nodemailer = require('nodemailer');

async function sendResetEmail(email, resetUrl) {
    // Create a transporter for nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'triadiots@gmail.com', // Your Gmail address
            pass: 'vwxq ydpf xpjl fuin', // Your Gmail password or App Password
        },
    });

    // Set up email data
    let mailOptions = {
        from: '"Home Rent Management System" <triadiots@gmail.com>', // Sender address
        to: email, // List of receivers
        subject: 'Password Reset Request', // Subject line
        text: 'You requested a password reset.', // Plain text body
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

exports.sendResetEmail = sendResetEmail;
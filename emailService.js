require('dotenv').config();
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const createTransporter = async () => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    console.log('Access token obtained:', accessToken);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });

    // Verify the transporter
    await transporter.verify();
    console.log('Transporter verified successfully');

    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
};

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


const sendAccountCreationEmail = async (to) => {
  const subject = 'Welcome to Our Service';
  const text = "Thank you for creating an account with us. We're excited to have you on board!";
  
  try {
    await sendEmail(to, subject, text);
    console.log('Account creation email sent successfully');
  } catch (error) {
    console.error('Error sending account creation email:', error);
    throw error;
  }
};

// Export your functions
module.exports = {
  sendEmail,
  sendAccountCreationEmail
};
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIEND_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});
const sendMail = async (to, subject, text, html) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_EMAIL,
        clientId: process.env.OAUTH_CLIEND_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `Metagram <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendMail;

const nodemailer = require("nodemailer");
const sendGmail = async (gmailId, otp, error) => {
  try {
    const mailSettings = {
      service: "gmail",
      auth: {
        user: process.env.Gmail,
        pass: process.env.GmailPassword,
      },
    };
    const transporter = nodemailer.createTransport(mailSettings);
    const htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
        <p>${otp ? otp : error}</p>
    </body>
    </html>`;
    const gmailResult = await transporter.sendMail({
      from: mailSettings.auth.user,
      to: gmailId,
      subject: `${otp ? `OTP` : `Server Error Message`}`,
      html: htmlTemplate,
    });
    if (!gmailResult.rejected.length) {
      return `OTP Sent To ${gmailId}`;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = sendGmail;

const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const sendEmail = asyncHandler(async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html,
  });
});

module.exports = sendEmail;

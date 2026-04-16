const nodemailer = require("nodemailer");

// 🔐 configure transporter (use Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gargsaniya192@gmail.com",        // 👈 replace
    pass: "ooyd hqeb jbkx kehz",           // 👈 use app password
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: '"Cal Clone" <gargsaniya192@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
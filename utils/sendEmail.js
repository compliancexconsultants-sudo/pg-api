const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (to, subject, html, pdfBuffer = null) => {
  const mailOptions = {
    from: `"PGHub" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  };

  // Attach PDF if exists
  if (pdfBuffer) {
    mailOptions.attachments = [
      {
        filename: "PG_Payment_Receipt.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];
  }

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;


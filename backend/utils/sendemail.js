const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Use real SMTP credentials from .env if available,
  // otherwise fall back to Ethereal (fake test inbox)
  let transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Dev fallback — creates a temporary test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Using Ethereal test email (no real email sent)");
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER || "nearnest@test.com",
    to,
    subject,
    text,
  });

  // In dev mode, log the preview URL so you can see the email
  if (!process.env.EMAIL_USER) {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = sendEmail;

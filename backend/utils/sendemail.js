const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // 1. If RESEND_API_KEY is provided in Render environment, use HTTPS port 443
  // (Render never blocks HTTPS, so real emails can be delivered on Free Tier)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "NearNest <onboarding@resend.dev>",
          to: [to],
          subject,
          text,
        }),
      });
      if (res.ok) {
        console.log(`[EMAIL SUCCESS] Sent via Resend HTTPS to ${to}`);
        return await res.json();
      }
    } catch (apiErr) {
      console.warn("Resend API warning:", apiErr.message);
    }
  }

  // 2. If Gmail SMTP credentials exist, attempt Nodemailer with 4s timeout
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 4000,
        family: 4,
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      console.log(`[EMAIL SUCCESS] Sent via Gmail SMTP to ${to}`);
      return info;
    } catch (smtpErr) {
      console.warn(`[SMTP NOTICE] ${smtpErr.message}`);
      console.warn("Render Free Tier blocks outbound SMTP ports (25, 465, 587). Logging code below.");
    }
  }

  // 3. Fallback: Log OTP to server logs so registration never hangs or crashes
  console.log("-----------------------------------------");
  console.log(`📬 [OTP BACKEND LOG]`);
  console.log(`To: ${to}`);
  console.log(`${text}`);
  console.log("-----------------------------------------");

  return { delivered: false, loggedToConsole: true };
};

module.exports = sendEmail;

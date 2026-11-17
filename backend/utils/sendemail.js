const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // 1. Brevo HTTPS API (300 free emails/day to ANY email address — NO custom domain required!)
  if (process.env.BREVO_API_KEY) {
    try {
      const apiKey = process.env.BREVO_API_KEY.trim();
      const senderEmail = (process.env.EMAIL_USER || "zerosworld61@gmail.com").trim();
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: "NearNest", email: senderEmail },
          to: [{ email: to }],
          subject,
          textContent: text,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log(`[BREVO SUCCESS] Real email delivered to ${to} (id: ${data.messageId || "ok"})`);
        return { delivered: true, id: data.messageId };
      } else {
        console.error(`[BREVO REJECTED] Status ${res.status}:`, JSON.stringify(data));
      }
    } catch (apiErr) {
      console.warn("Brevo API network warning:", apiErr.message);
    }
  }

  // 2. Resend HTTPS API (Port 443)
  if (process.env.RESEND_API_KEY) {
    try {
      const apiKey = process.env.RESEND_API_KEY.trim();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "NearNest <onboarding@resend.dev>",
          to: [to],
          subject,
          text,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log(`[RESEND SUCCESS] Email delivered via Resend to ${to} (id: ${data.id || "ok"})`);
        return { delivered: true, id: data.id };
      } else {
        console.error(`[RESEND REJECTED] Status ${res.status}:`, JSON.stringify(data));
      }
    } catch (apiErr) {
      console.warn("Resend API network warning:", apiErr.message);
    }
  }

  // 3. Gmail SMTP with 4s timeout (Works locally, blocked on Render Free Tier)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const cleanUser = process.env.EMAIL_USER.trim();
      const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, "");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 4000,
      });

      const info = await transporter.sendMail({
        from: cleanUser,
        to,
        subject,
        text,
      });

      console.log(`[SMTP SUCCESS] Sent via Gmail SMTP to ${to}`);
      return { delivered: true, info };
    } catch (smtpErr) {
      console.warn(`[SMTP NOTICE] ${smtpErr.message}`);
      console.warn("Notice: Render Free Tier blocks outbound SMTP (ports 25, 465, 587). Logging code below.");
    }
  }

  // 4. Server console logging fallback
  console.log("-----------------------------------------");
  console.log(`📬 [OTP CODE] For: ${to}`);
  console.log(`${text}`);
  console.log("-----------------------------------------");

  return { delivered: false, loggedToConsole: true };
};

module.exports = sendEmail;

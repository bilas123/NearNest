const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // 1. Resend HTTPS API (Port 443 — NEVER blocked by Render or cloud hosts)
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
        // Important hint for Resend sandbox testing
        if (res.status === 403 && data.message && data.message.includes("testing emails")) {
          console.warn("⚠️ NOTICE: Resend free sandbox can only send to your own Resend sign-up email address!");
        }
      }
    } catch (apiErr) {
      console.warn("Resend API network warning:", apiErr.message);
    }
  }

  // 2. Gmail SMTP with 4s timeout (Works locally, but blocked on Render Free Tier)
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

  // 3. Server console logging fallback
  console.log("-----------------------------------------");
  console.log(`📬 [OTP CODE] For: ${to}`);
  console.log(`${text}`);
  console.log("-----------------------------------------");

  return { delivered: false, loggedToConsole: true };
};

module.exports = sendEmail;

import nodemailer from "nodemailer";

/**
 * Utility to send emails using nodemailer.
 * Falls back to console logging if SMTP credentials are missing.
 */
export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.log("🟠 [Mail] SMTP credentials missing. Logging email instead:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text || html}`);
    return { success: true, message: "Logged to console" };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: SMTP_PORT === "465",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL || `"Genora AI" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("🟢 [Mail] Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("🔴 [Mail] Error sending email:", error);
    throw error;
  }
}

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  secure: process.env.SMTP_SECURE === "true", // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function testEmailConfiguration() {
  try {
    console.log("Testing email configuration...");
    console.log("SMTP Host:", process.env.SMTP_HOST);
    console.log("SMTP Port:", process.env.SMTP_PORT);
    console.log("SMTP Secure:", process.env.SMTP_SECURE);
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Recipient:", process.env.EMAIL_RECIPIENT);
    
    // Test the transporter connection
    await transporter.verify();
    console.log("Email configuration is valid and ready to send emails");
    return true;
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return false;
  }
}

export async function sendCompletionEmail(fullName = "") {
  try {
    // Use EMAIL_RECIPIENT instead of EMAIL_USER for the recipient
    const recipient = process.env.EMAIL_RECIPIENT || "Dawood.ahmed@collaborak.com";
    const sender = process.env.EMAIL_USER;
    
    if (!sender) {
      throw new Error("EMAIL_USER is not configured");
    }
    
    const subject = `1st Task Done - ${
      fullName || process.env.FULL_NAME || "Applicant"
    }`;
    const text = `The box scheduler has reached 16 boxes and stopped.\nTime: ${new Date().toISOString()}`;

    console.log(`Attempting to send email from ${sender} to ${recipient}`);

    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject,
      text,
    });

    console.log("Completion email sent successfully:", info.messageId);
    console.log("Email response:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send completion email:", error);
    throw error;
  }
}

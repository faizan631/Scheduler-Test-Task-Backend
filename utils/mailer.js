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

export async function sendCompletionEmail(fullName = "") {
  const recipient = process.env.EMAIL_USER || "Dawood.ahmed@collaborak.com";
  const subject = `1st Task Done - ${
    fullName || process.env.FULL_NAME || "Applicant"
  }`;
  const text = `The box scheduler has reached 16 boxes and stopped.\nTime: ${new Date().toISOString()}`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text,
  });

  console.log("Completetion email sent:", info.messageId);
  return info;
}

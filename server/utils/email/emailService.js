// server/utils/email/emailService.js
import nodemailer from "nodemailer";
import { emailVerificationTemplate, resetPasswordVerificationTemplate } from "./templates/emailTemplates.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables when in test mode
const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false,
  logger: true,
  debug: true
});


export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


export const sendVerificationEmail = async (user, verificationUrl) => {
  try {
    if (!user?.email) {
      throw new Error("No email address provided in user object");
    }

    const html = emailVerificationTemplate(user.username, verificationUrl);
    const text = `Please verify your email by clicking: ${verificationUrl}`;

    const mailOptions = {
      email: user.email,
      subject: "Email Verification",
      message: text,
      html: html,
    };

    const info = await sendEmail(mailOptions);
    console.log("Email sent successfully to:", user.email);
    return info;
  } catch (error) {
    console.error("Email sending failed to:", user?.email, "Error:", error);
    throw error;
  }
};


export const sendPasswordResetEmail = async (user, resetUrl) => {

  try {
   const html = resetPasswordVerificationTemplate(user.username, resetUrl)
  const text = `Please reset your password by clicking: ${resetUrl}`;

    const mailOptions = {
      email: user.email,
      message: text,
      subject: "Password Reset",
      html: html
    };
   
    const info = await sendEmail(mailOptions);
    console.log("Email sent successfully to:", user.email);
    return info;
  } catch (err) {
    console.error("Error sending password reset email:", err);
    throw new Error("Email could not be sent");
  }
};



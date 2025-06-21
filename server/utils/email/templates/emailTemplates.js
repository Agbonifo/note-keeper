// emailTemplates.js
import { capitalizeName } from "../stringUtils.js";
import { baseEmailTemplate } from "./baseEmailTemplate.js";

export const emailVerificationTemplate = (name, verificationUrl) => 
  baseEmailTemplate(
    "Verify Your Email",
    `
   
     <h2>Hello ${capitalizeName(name)},</h2>
    <p>To complete the creation of your Note Keeper account, we need to confirm that this email address belongs to you.</p>
    <p>Please click the button below to verify your email. This link is valid for 24 hours.</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <a href="${verificationUrl}" class="button">Verify Email</a>
        </td>
      </tr>
    </table>
    <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
    <p>${verificationUrl}</p>
    <p>If you didn't request this email, you can safely ignore it.</p>
    <p>This is an automated message; please DO NOT reply.</p><br>
    <p>With best regards,<br>The Note Keeper Team.</p>
    `
  );
  

export const resetPasswordVerificationTemplate = (name, resetUrl) => 
  baseEmailTemplate(
    "Reset Your Password",
    `
    <h2>Dear ${capitalizeName(name)},</h2>
    <p>You requested to reset your password. To create a new password, please click the button below. This link is valid for 10 minutes.</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </td>
      </tr>
    </table>
    <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
    <p>${resetUrl}</p>
    <p>If you didn't request this email, you can safely ignore it.</p>
    <p>This is an automated message; please DO NOT reply.</p><br>
    <p>With best regards,<br>The Note Keeper Team</p>
    `
  );


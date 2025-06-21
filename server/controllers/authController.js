// server/controllers/authController.js
import User from "../models/User.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email/emailService.js";
import { generateToken } from "../utils/auth/generateTokens.js";
import asyncHandler from "express-async-handler";
import { createHash } from "node:crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, email, password });

  try {
    const verificationToken = await user.createVerificationToken();

    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${
      process.env.CLIENT_URL
    }/verify-email/${encodeURIComponent(verificationToken)}`;

    await sendVerificationEmail(user, verificationUrl);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error(error.message || "Registration failed");
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const rawToken = decodeURIComponent(req.params.token);
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");

    const verifiedUser = await User.findOne({
      $or: [
        { emailVerificationToken: hashedToken },
        { email: req.query.email },
      ],
      isVerified: true,
    });

    if (verifiedUser) {
      return res.status(200).json({
        success: true,
        message: "Email has already been verified!",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
        isVerified: false,
      },
      {
        $set: { isVerified: true },
        $unset: {
          emailVerificationToken: "",
          emailVerificationExpires: "",
        },
        $push: {
          verificationHistory: {
            date: new Date(),
            method: "email",
          },
        },
      },
      { new: true }
    );

    if (!user) {
      const expiredUser = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $lte: Date.now() },
      });

      if (expiredUser) {
        return res.status(400).json({
          success: false,
          message: "Verification token has expired. Please request a new one.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "Invalid verification token. Please check the link or request a new verification email.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during verification",
    });
  }
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  const verificationToken = await user.createVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${
    process.env.CLIENT_URL
  }/verify-email/${encodeURIComponent(verificationToken)}`;

  await sendVerificationEmail(user, verificationUrl);

  res.status(200).json({
    success: true,
    message: "Verification email resent",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please check your inbox.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: `If an account exists for ${email}, a reset link has been sent.`,
    });
  }

  try {
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${
      process.env.CLIENT_URL
    }/reset-password/${encodeURIComponent(resetToken)}`;

    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: "Error sending email. Please try again.",
    });
  }
});

// server/controllers/authController.js
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const rawToken = decodeURIComponent(req.params.token);

  if (!rawToken || typeof rawToken !== "string") {
    res.status(400);
    throw new Error("Invalid token format");
  }

  const hashedToken = createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or has expired");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetHistory.push({
    date: new Date(),
    method: "email",
  });

  await user.save();

  const authToken = generateToken(user._id);

  res.status(200).json({
    success: true,
    token: authToken,
    message: "Password reset successfully",
  });
});

export const verifyPasswordResetToken = asyncHandler(async (req, res) => {
  const rawToken = decodeURIComponent(req.params.token);

  if (!rawToken || typeof rawToken !== "string") {
    res.status(400);
    throw new Error("Invalid token format");
  }

  const hashedToken = createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const expiredUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $lte: Date.now() },
    });

    if (expiredUser) {
      return res.status(400).json({
        success: false,
        message: "Reset password token has expired. Please request a new one.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid token. Please check the link or request a new one.",
    });
  }

  res.status(200).json({ success: true });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  console.log("Old password: ", oldPassword + " New password: ", newPassword);

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Old and new passwords are required");
  }

  if (oldPassword === newPassword) {
    res.status(400);
    throw new Error("New password must be different from the old one");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetHistory.push({
    date: new Date(),
    method: "old password",
  });

  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

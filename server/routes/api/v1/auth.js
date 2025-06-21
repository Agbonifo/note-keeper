// server/routes/api/v1/auth.js
import express from "express";
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyPasswordResetToken
} from "../../../controllers/authController.js";
import { 
  authLimiter, 
  verificationLimiter
} from "../../../middleware/rateLimiter.js";
import { protect } from "../../../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/create-account", authLimiter, register);
authRoutes.get("/verify-email/:token", verificationLimiter, verifyEmail);
authRoutes.post("/resend-verification", authLimiter, resendVerification);
authRoutes.post("/login", authLimiter, login);
authRoutes.get("/logout", logout);
authRoutes.post("/forgot-password", authLimiter, forgotPassword);
authRoutes.put("/reset-password/:token", authLimiter, resetPassword);
authRoutes.get("/reset-password/verify/:token", authLimiter, verifyPasswordResetToken);
authRoutes.put("/change-password", protect, changePassword);

export default authRoutes;



// server/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs:   60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false
});

export const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  keyGenerator: (req) => req.params.token,
  message: "Too many verification attempts",
  skipSuccessfulRequests: true
});
 //server/middleware/security

import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import { xss } from "express-xss-sanitizer";
import mongoSanitize from "express-mongo-sanitize";
import csrf from "csurf";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.use(hpp());

  app.use(mongoSanitize());

  app.use(xss());

  if (process.env.NODE_ENV === "production") {
    const csrfProtection = csrf({ cookie: true });

    app.use((req, res, next) => {
      if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
      }
      try {
        csrfProtection(req, res, next);
      } catch (err) {
        if (err.code === "EBADCSRFTOKEN") {
          return res.status(403).json({
            success: false,
            message: "Invalid CSRF token",
          });
        }
        throw err;
      }
    });
  }

  app.use((req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === "string") {
          req.body[key] = req.sanitize(req.body[key]);
        }
      });
    }
    next();
  });
};

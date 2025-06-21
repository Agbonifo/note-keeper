//server/server.js
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { securityMiddleware } from "./middleware/security.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { initializeSocket } from "./utils/socket/socketManager.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "./utils/jobs/cleanUpUnverifiedUsers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

await connectDB();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.set("io", io);

initializeSocket(io);

app.set("trust proxy", 1);

app.use(cookieParser());

securityMiddleware(app);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/", apiLimiter);

app.use("/", routes);

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }

  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

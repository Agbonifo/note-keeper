// server/routes/api/index.js
import express from "express";
import csrf from "csurf";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import authRoutes from "./v1/auth.js";
import noteRoutes from "./v1/notes.js";
import chatRoutes from "./v1/chat.js";
import userRoutes from "./v1/users.js";

const apiRoutes = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  },
});

apiRoutes.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/notes", noteRoutes);
apiRoutes.use("/chats", chatRoutes);
apiRoutes.use("/users", userRoutes);

export default apiRoutes;






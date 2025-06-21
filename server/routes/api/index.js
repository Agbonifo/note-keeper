// Registration, email verification and login worked 15/04/25 

import express from "express";
import authRoutes from "./v1/auth.js";
import noteRoutes from "./v1/notes.js";
import chatRoutes from "./v1/chat.js";
import userRoutes from "./v1/users.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/notes", noteRoutes);
apiRoutes.use("/chats", chatRoutes);
apiRoutes.use("/users", userRoutes);

export default apiRoutes;
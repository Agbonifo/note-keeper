// server/routes/api/inex.js
import express from "express";
import csrf from "csurf";

import authRoutes from "./v1/auth.js";
import noteRoutes from "./v1/notes.js";
import chatRoutes from "./v1/chat.js";
import userRoutes from "./v1/users.js";

const apiRoutes = express.Router();

const csrfProtection = csrf({ cookie: true });

apiRoutes.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/notes", noteRoutes);
apiRoutes.use("/chats", chatRoutes);
apiRoutes.use("/users", userRoutes);

export default apiRoutes;






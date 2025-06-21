// server/routes/api/v1/chat.js

import express from "express";
import { getMessages, sendMessage, deleteMessage, updateMessageStatus } from "../../../controllers/chatController.js";
import { protect } from "../../../middleware/auth.js";

const chatRoutes = express.Router();

chatRoutes.route("/").get(protect, getMessages).post(protect, sendMessage);
chatRoutes.route("/status").post(protect, updateMessageStatus);
chatRoutes.route("/:id").delete(protect, deleteMessage);

export default chatRoutes;


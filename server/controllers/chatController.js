// server/controllers/chatController.js
import Chat from "../models/Chat.js";
import asyncHandler from "express-async-handler";
import sanitizeHtml from "sanitize-html";

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Chat.find()
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 })
      .limit(1000);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const chat = await Chat.create({
      sender: req.user.id,
      message: sanitizeHtml(message.trim()),
      deliveredTo: [req.user.id],
    });

    const populatedChat = await chat.populate("sender", "username avatar");

    const io = req.app.get("io");
    if (io) {
      io.emit("newMessage", populatedChat);
    } else {
      console.warn("Socket.IO not available - message not broadcasted");
    }

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const deletedId = req.params.id;
  console.log("delete id: ", deletedId);

  const chat = await Chat.findById(deletedId);

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }
  try {
    if (req.user.username !== "danifo") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    await Chat.deleteOne({ _id: deletedId });

    const io = req.app.get("io");
    if (io) {
      io.emit("messageDeleted", deletedId);
    } else {
      console.warn("Socket.IO not available - message not deleted");
    }

    res.status(200).json({ message: "Deleted successfully", id: deletedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { messageId, userId, status } = req.body;
  if (!messageId || !userId || !status)
    return res.status(400).json({ error: "Invalid data" });

  const updateField = status === "read" ? "readBy" : "deliveredTo";
  await Chat.findByIdAndUpdate(
    { _id: messageId },
    {
      $addToSet: { [updateField]: userId },
    }
  );
  res.status(200).json({ success: true });
});

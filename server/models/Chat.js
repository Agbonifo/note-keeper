// server/models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { 
      type: String,
       required: true, trim: true, 
       maxlength: 1000 },
    deliveredTo: [
      { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" }
    ],
    readBy: [
      { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "User" }
      ],
  },
  { timestamps: true }
);


chatSchema.index({ createdAt: 1 });
chatSchema.index({ deliveredTo: 1 });
chatSchema.index({ readBy: 1 });
chatSchema.index({ sender: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
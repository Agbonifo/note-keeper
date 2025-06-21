// server/utils/socket/socketManager.js
import Chat from "../../models/Chat.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on(
      "newMessage",
      async (message) => {
        try {
          const savedMessage = await Chat.create(message);

          socket.broadcast.emit("newMessage", savedMessage);

          io.emit("newUnreadMessage");

          const messageCount = await Chat.countDocuments({});

          await Chat.find()
            .sort({ createdAt: 1 })
            .limit(Math.max(0, messageCount - 1000))
            .then((oldest) =>
              Chat.deleteMany({ _id: { $in: oldest.map((m) => m._id) } })
            );
        } catch (err) {
          console.error("Error handling message:", err);
        }
      },

      socket.on(
        "messageStatusUpdated",
        async ({ messageId, status, userId }) => {
          try {
            const updateField = status === "read" ? "readBy" : "deliveredTo";
            const updatedMessage = await Chat.findByIdAndUpdate(
              messageId,
              { $addToSet: { [updateField]: userId } },
              { new: true }
            );

            if (updatedMessage) {
              io.emit("messageStatusUpdated", {
                messageId,
                status,
                userId,
              });
            }
          } catch (err) {
            console.error("Error updating message status:", err);
          }
        }
      )
    );

    socket.on("requestUnreadCount", async (userId) => {
      try {
        const count = await Chat.countDocuments({
          "sender._id": { $ne: userId },
          $or: [{ readBy: { $nin: [userId] } }, { readBy: { $exists: false } }],
        });
        socket.emit("updateUnreadCount", { userId, count });
      } catch (err) {
        console.error("Error counting unread messages:", err);
      }
    });

    socket.on("markAllMessagesAsRead", async (userId) => {
      try {
        await Chat.updateMany(
          {
            "sender._id": { $ne: userId },
            $or: [
              { readBy: { $nin: [userId] } },
              { readBy: { $exists: false } },
            ],
          },
          { $addToSet: { readBy: userId } }
        );
        io.emit("updateUnreadCount", { userId, count: 0 });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// client/src/components/Chat/Chatbutton
import { useState, useEffect } from "react";
import { IconButton, Badge, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChatWindow from "./ChatWindow";
import useSocket from "../../hooks/useSocket";
import useAuth from "../../hooks/useAuth";

export default function ChatButton() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessagePulse, setNewMessagePulse] = useState(false);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleInitialUnreadCount = (count) => setUnreadCount(count);
    const handleUpdateUnreadCount = ({ userId, count }) => {
      if (userId === user._id) setUnreadCount(count);
    };

    const requestCount = () => {
      socket.emit("requestUnreadCount", user._id);
    };

    socket.on("initialUnreadCount", handleInitialUnreadCount);
    socket.on("updateUnreadCount", handleUpdateUnreadCount);
    requestCount();

    const interval = setInterval(requestCount, 30000);

    return () => {
      clearInterval(interval);
      socket.off("initialUnreadCount", handleInitialUnreadCount);
      socket.off("updateUnreadCount", handleUpdateUnreadCount);
    };
  }, [socket, user?._id]);

  useEffect(() => {
    if (unreadCount > 0 && !chatOpen) {
      setNewMessagePulse(true);
      const timer = setTimeout(() => setNewMessagePulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, chatOpen]);

  const handleOpenGroupChat = () => {
    setChatOpen(true);
    setUnreadCount(0);
    socket?.emit("markAllMessagesAsRead", user._id);
  };

  useEffect(() => {
    const cleanupLocalStorage = () => {
      const now = new Date();
      const localMessages = localStorage.getItem("lastMessages");
      if (localMessages) {
        const messages = JSON.parse(localMessages);
        const recentMessages = messages.filter((m) => {
          const msgDate = new Date(m.createdAt);
          return now - msgDate < 30 * 24 * 60 * 60 * 1000;
        });
        localStorage.setItem("lastMessages", JSON.stringify(recentMessages));
      }
    };

    cleanupLocalStorage();
    const dailyCleanup = setInterval(cleanupLocalStorage, 24 * 60 * 60 * 1000);

    return () => clearInterval(dailyCleanup);
  }, []);

  if (!user) return null; 

  return (
    <Box sx={{ position: "relative", height: 0 }}>
      <IconButton
        onClick={handleOpenGroupChat}
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          backgroundColor: "primary.main",
          color: "white",
          width: 56,
          height: 56,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          transform: newMessagePulse ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.3s ease",
          zIndex: 1200,
        }}
      >
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              right: unreadCount > 9 ? -8 : -4,
              top: 13,
              padding: unreadCount > 9 ? "0 4px" : "0",
              backgroundColor: "#ff4d4f",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 0 0 2px #fff",
            },
          }}
        >
          <ChatIcon />
        </Badge>
      </IconButton>

      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: { xs: "100%", sm: "400px", md: "500px" },
            zIndex: 1300,
            boxShadow: 3,
            backgroundColor: "background.paper",
          }}
        >
          <ChatWindow
            onClose={() => setChatOpen(false)}
            setUnreadCount={setUnreadCount}
            chatOpen={chatOpen}
          />
        </Box>
      )}
    </Box>
  );
}

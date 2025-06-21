// client/src/components/Chat/Message.jsx
import React, { useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { stringToColor, getContrastColor } from "../../utils/helpers";
import { deleteMessage } from "../../api/chat";
import useSocket from "../../hooks/useSocket";
import useStore from "../../store";
import ChatStatusIcon from "./ChatStatusIcon";

const Message = React.memo(function Message({ message, showAvatarAndUsername, onDelete }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { setChats, deleteChat } = useStore();

  const isCurrentUser = message.sender?._id === user._id;
  const username = message.sender?.username || "Unknown";
  const usernameColor = stringToColor(username);
  const textColor = getContrastColor(usernameColor);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 400;
  const isLong = message.message.length > maxLength;
  const displayText = expanded
    ? message.message
    : message.message.slice(0, maxLength);

  const isAdmin = user?.username === "danifo";
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
  try {
    await onDelete(message._id);

    deleteChat(message._id);

    const localMessages = localStorage.getItem("lastMessages");
    if (localMessages) {
      const messages = JSON.parse(localMessages);
      const updatedMessages = messages.filter((m) => m._id !== message._id);
      localStorage.setItem("lastMessages", JSON.stringify(updatedMessages));
    }

    await deleteMessage(message._id);

    socket.emit("messageDeleted", message._id);
  } catch (err) {
    console.error("Failed to delete message:", err);
    const localMessages = localStorage.getItem("lastMessages");
    if (localMessages) {
      setChats(JSON.parse(localMessages));
    }
  }
};


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        mb: 1,
        gap: 1,
        width: "100%",
        position: "relative",
      }}
      onMouseEnter={() => isAdmin && setShowDelete(true)}
      onMouseLeave={() => isAdmin && setShowDelete(false)}
    >

      {!isCurrentUser &&
        (showAvatarAndUsername ? (
          <Avatar
            sx={{ bgcolor: usernameColor, color: textColor }}
            src={message.sender?.avatar}
          >
            {message.sender?.username?.charAt(0).toUpperCase() || "?"}
          </Avatar>
        ) : (
          <Box sx={{ width: 40 }} />
        ))}
      <Box
        sx={{
          minWidth: "35%",
          maxWidth: "75%",
          px: 1,
          py: 0.5,
          borderRadius: 2,
          bgcolor: isCurrentUser ? "primary.main" : "grey.100",
          color: isCurrentUser ? "grey.300" : "text.primary",
          position: "relative",
        }}
      >
        {showDelete && (
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              position: "absolute",
              top: 0,
              right: isCurrentUser ? "100%" : "auto",
              left: isCurrentUser ? "auto" : "100%",
              color: "error.main",
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
        {!isCurrentUser && showAvatarAndUsername && (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              textTransform: "capitalize",
              color: usernameColor,
            }}
          >
            {username}
          </Typography>
        )}
        <Typography
          sx={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            lineHeight: "1.2",
          }}
        >
          {displayText}
          {isLong && !expanded && "... "}
          {isLong && (
            <Typography
              component="span"
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: isCurrentUser ? textColor : usernameColor,
                cursor: "pointer",
                fontWeight: 500,
                ml: 1,
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </Typography>
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.8,
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Typography>
           {isCurrentUser &&  <ChatStatusIcon message={message} userId={user._id} />}
        </Box>
      </Box>
      {isCurrentUser ? (
        showAvatarAndUsername ? (
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
            src={user.avatar}
          >
            {user?.username?.charAt(0).toUpperCase() ?? "U"}
          </Avatar>
        ) : (
          <Box sx={{ width: 40 }} />
        )
      ) : null}
    </Box>
  );
})


export default Message;
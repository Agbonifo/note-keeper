// client/src/components/Chat/MessageList.jsx
import { useMemo } from "react";
import { Box, Typography, CircularProgress, Divider } from "@mui/material";
import Message from "./Message";
import { groupMessagesByDate } from "../../utils/helpers";

export default function MessageList({
  messages,
  loading,
  onDeleteMessage,
  firstUnreadRef,
  currentUserId,
}) {
  const safeMessages = Array.isArray(messages) ? messages : [];

const groupedMessages = useMemo(() => 
  groupMessagesByDate(safeMessages), 
  [safeMessages]
);


 const dateGroups = Object.values(groupedMessages);

  const unreadMessages = useMemo(() => {
    return safeMessages.filter(
      (msg) =>
        msg.sender?._id !== currentUserId &&
        (!msg.readBy || !msg.readBy.includes(currentUserId))
    );
  }, [safeMessages, currentUserId]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        mb: 2,
        p: 1,
        bgcolor: "background.default",
        borderRadius: 1,
        backgroundImage: 'url("/assets/images/food.png")',
        backgroundPosition: "center",
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" p={2}>
          No messages yet. Start the conversation!
        </Typography>
      ) : (
        dateGroups.map((group, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  px: 1,
                  backgroundColor: "background.default",
                }}
              >
                {group.label}
              </Typography>
            </Divider>
            {group.messages.map((message, msgIndex) => {
              const prevMessage = group.messages[msgIndex - 1];
              const showAvatarAndUsername =
                !prevMessage || prevMessage.sender._id !== message.sender._id;
              const isUnread =
                message.sender?._id !== currentUserId &&
                (!message.readBy || !message.readBy.includes(currentUserId));

              const showUnreadIndicator =
                isUnread &&
                !group.messages
                  .slice(0, msgIndex)
                  .some(
                    (m) =>
                      m.sender?._id !== currentUserId &&
                      (!m.readBy || !m.readBy.includes(currentUserId))
                  );

              return (
                <div key={message._id}>
                  {showUnreadIndicator && (
                    <Box
                      ref={firstUnreadRef}
                      sx={{
                        textAlign: "center",
                        mb: 1,
                        px: 2,
                        py: 1,
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        borderRadius: 5,
                      }}
                    >
                      <Typography variant="caption" color="primary">
                        {unreadMessages.length} unread message
                        {unreadMessages.length !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  )}
                  <Message
                    message={message}
                    showAvatarAndUsername={showAvatarAndUsername}
                    onDelete={onDeleteMessage}
                  />
                </div>
              );
            })}
          </Box>
        ))
      )}
    </Box>
  );
}


// client/src/components/Chat/ChatWindow.jsx
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Fab,
  Tooltip,
} from "@mui/material";
import { debounce } from "lodash";
import { Close, Send } from "@mui/icons-material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import useSocket from "../../hooks/useSocket";
import useStore from "../../store";
import useAuth from "../../hooks/useAuth";
import { getMessages, sendMessage, updateMessageStatus } from "../../api/chat";
import MessageList from "./MessageList";
import { formatSentenceCase } from "../../utils/helpers";

export default function ChatWindow({ onClose, setUnreadCount, chatOpen }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, setChats, addChat, deleteChat, replaceChat } = useStore();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const [isAutoScrolled, setIsAutoScrolled] = useState(true);

  const chatContainerRef = useRef();
  const firstUnreadRef = useRef(null);
  const hasScrolledToFirstUnread = useRef(false);

  const [newMessageAlert, setNewMessageAlert] = useState(false);

  const safeChats = Array.isArray(chats) ? chats : [];

  const unreadMessages = safeChats.filter(
    (chat) =>
      chat.sender?._id !== user._id &&
      (!chat.readBy || !chat.readBy.includes(user._id))
  );

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsAutoScrolled(true);
  }, [messagesEndRef]);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const messages = await getMessages();
        setChats(messages);
        localStorage.setItem("lastMessages", JSON.stringify(messages));

        const hasUnread = messages.some(
          (msg) =>
            msg.sender?._id !== user._id &&
            (!msg.readBy || !msg.readBy.includes(user._id))
        );

        if (!hasUnread) {
          setTimeout(() => {
            scrollToBottom();
            hasScrolledToFirstUnread.current = true;
          }, 100);
        }
      } catch (err) {
        const localMessages = localStorage.getItem("lastMessages");
        if (localMessages) {
          setChats(JSON.parse(localMessages));
        }
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [setChats, user._id]);

  const handleScroll = useMemo(
    () =>
      debounce(() => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 100;
        setIsAutoScrolled(atBottom);
      }, 100),
    []
  );

  useEffect(() => {
    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useLayoutEffect(() => {
    if (!hasScrolledToFirstUnread.current && firstUnreadRef.current) {
      firstUnreadRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasScrolledToFirstUnread.current = true;
    }
  }, [chats]);


  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      addChat(newMessage);

    if (newMessage.sender._id !== user._id) {
  updateMessageStatus(newMessage._id, user._id, "delivered");
  socket.emit("messageStatusUpdated", {
    messageId: newMessage._id,
    status: "delivered",
    userId: user._id,
  });

  if (!chatOpen) {
    setUnreadCount((prev) => prev + 1);
  } else if (document.hasFocus()) {
    updateMessageStatus(newMessage._id, user._id, "read");
    socket.emit("messageStatusUpdated", {
      messageId: newMessage._id,
      status: "read",
      userId: user._id,
    });
  }
}
      if (newMessage.sender._id === user._id || isAutoScrolled) {
        scrollToBottom();
      } else {
        setNewMessageAlert(true);
      }
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, user._id, chatOpen, addChat, setUnreadCount]);


  useEffect(() => {
    const handleStatusUpdate = ({ messageId, status, userId }) => {
      setChats((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                [`${status}By`]: [
                  ...new Set([...(msg[`${status}By`] || []), userId]),
                ],
              }
            : msg
        )
      );

      if (status === "read" && userId === user._id) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    };

    socket?.on("messageStatusUpdated", handleStatusUpdate);
    return () => socket?.off("messageStatusUpdated", handleStatusUpdate);
  }, [socket, user._id, setChats, setUnreadCount]);


    useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!chatOpen) return;

      if (unreadMessages.length > 0) {
        try {
          await Promise.all(
            unreadMessages.map((chat) =>
              updateMessageStatus(chat._id, user._id, "read")
            )
          );
          socket?.emit("markAllMessagesAsRead", user._id);
          setUnreadCount(0);
        } catch (err) {
          console.error("Error marking messages as read:", err);
        }
      }
    };

    markMessagesAsRead();
  }, [chatOpen, chats, user._id, socket, setUnreadCount]);


  useEffect(() => {
    const handleMessageDeleted = (deletedId) => {
      const wasUnread = chats.some(
        (chat) =>
          chat._id === deletedId &&
          chat.sender._id !== user._id &&
          (!chat.readBy || !chat.readBy.includes(user._id))
      );

      deleteChat(deletedId);
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    socket?.on("messageDeleted", handleMessageDeleted);
    return () => socket?.off("messageDeleted", handleMessageDeleted);
  }, [socket, deleteChat, chats, user._id, setUnreadCount]);



   const handleSend = async (e) => {
     e.preventDefault();
     const cleanedMessage = formatSentenceCase(message.trim());
     if (!cleanedMessage) return;
     const tempId = Date.now().toString();

     const tempMessage = {
       _id: tempId,
       sender: user,
       message: cleanedMessage,
       createdAt: new Date(),
       isTemp: true,
     };

     addChat(tempMessage);
     setMessage("");
     setErrorMessage(null);
     try {
       const savedMessage = await sendMessage(cleanedMessage);
       replaceChat(tempId, savedMessage);
       scrollToBottom();
     } catch (err) {
       setErrorMessage("Message failed to send.");
     }
   };


  const formattedMessage = useMemo(() => {
    return formatSentenceCase(message);
  }, [message]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" color="primary.main">
          Chats
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box ref={chatContainerRef} sx={{ overflowY: "auto", flexGrow: 1 }}>
        <MessageList
          messages={chats}
          loading={loading}
          onDeleteMessage={deleteChat}
          firstUnreadRef={firstUnreadRef}
          currentUserId={user._id}
        />
        <div ref={messagesEndRef} />
      </Box>
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleSend}
        sx={{ display: "flex", gap: 1 }}
        alignItems="flex-end"
      >
        <TextField
          autoCorrect="on"
          spellCheck={true}
          autoComplete="off"
          fullWidth
          size="small"
          multiline
          minRows={1}
          maxRows={6}
          variant="outlined"
          value={formattedMessage}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message...😊"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        {!isAutoScrolled && (
          <Tooltip title="Scroll to bottom" placement="left">
            <Fab
              onClick={() => {
                setIsAutoScrolled(true);
                scrollToBottom();
                setNewMessageAlert(false);
              }}
              sx={{
                position: "fixed",
                bottom: 80,
                right: 16,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                transform: newMessageAlert ? "translateY(-5px)" : "none",
                transition: "transform 0.3s ease",
              }}
              size="small"
            >
              <KeyboardDoubleArrowDownIcon />
            </Fab>
          </Tooltip>
        )}
        <Tooltip title="Send">
          <span>
            <Fab
              type="submit"
              disabled={!message.trim()}
              size="small"
              color={message.trim() ? "primary" : "default"}
            >
              <Send fontSize="small" />
            </Fab>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

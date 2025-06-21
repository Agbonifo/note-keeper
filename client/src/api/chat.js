// client/src/api/chat.js
import api from "./api";

export const getMessages = async () => {
  const response = await api.get("/chats");
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await api.post("/chats", { message });
  return response.data;
};

export const updateMessageStatus = async (messageId, userId, status) => {
  const response = await api.post("/chats/status", { messageId, userId, status });
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/chats/${id}`);
  return response.data;
};





// client/src/contexts/SocketContext.jsx
import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_API_URL;

    const newSocket = io(serverUrl, {
      withCredentials: true,
      autoConnect: true,
    });

    const token = localStorage.getItem("token");
    if (token) {
      newSocket.auth = { token };
    }

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

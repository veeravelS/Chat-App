import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SocketContext } from "./socketContext";

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.user.token); // 👈 track from Redux

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ connect_error:", err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]); 

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

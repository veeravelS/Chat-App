import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SocketContext } from "./socketContext";

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.user.token); // 👈 track from Redux

  useEffect(() => {
    if (!token) {
      return;
    }
    
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
      withCredentials: true,
    });

    // Save socket instance to state when connected
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      console.log("🚀 Created socket:", socketInstance); // Debugging the socket instance

      // Directly use socketInstance here instead of waiting for state update
      setSocket(socketInstance); // Set socket to the state
    });

    // socketInstance.on("disconnect", () => {
    //   console.log("❌ Socket disconnected");
    // });

    // socketInstance.on("connect_error", (err) => {
    //   console.error("❌ connect_error:", err.message);
    // });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]); // ✅ Must depend on token

  // Log when socket state updates
  useEffect(() => {
    if (socket) {
      console.log("✅ Socket state updated:", socket);
    }
  }, [socket]);

  console.log("Socket state in provider:", socket); // This will log the latest socket state

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

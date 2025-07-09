import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, setOnlineUser } from "./store/userSlice";
import Sidebar from "./components/Sidebar";
import { useSocket } from "./socket/socketContext";import Header from "./components/Header";
const AppLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUserDetails = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
    try {
      const response = await axios.get(URL, { withCredentials: true });
      console.log(response);
      if (response.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  
  // socket connection
  useEffect(() => {
    if (!socket) return;
  
    socket.on("onlineUser", (data) => {
      console.log("onlineUser:", data);
      dispatch(setOnlineUser(data));
    });
  
    return () => {
      socket.off("onlineUser");
    };
  }, [socket]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || !savedTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // optional, to persist default
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="grid lg:grid-cols-[200px_1fr] bg-white text-black dark:bg-zinc-900 dark:text-white relative overflow-hidden h-screen max-h-screen">
      <section className={`bg-[#fcfbfc] dark:bg-zinc-900 overflow-y-auto border-[1px] lg:block`}>
        <Sidebar />
      </section>
      <div className="#ffffff  mx-10">
      <Header />
      <section className="h-[calc(100vh-100px)] scrollbar">
        <Outlet />
      </section>
      </div>
    </div>
  );
};

export default AppLayout;
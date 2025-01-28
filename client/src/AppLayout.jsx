import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/userSlice";
import Sidebar from "./components/Sidebar";

const AppLayout = () => {
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user);
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

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <Toaster />
      <section className="bg-white">
        <Sidebar />
      </section>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
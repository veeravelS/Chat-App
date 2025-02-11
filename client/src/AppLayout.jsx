import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/userSlice";
import Sidebar from "./components/Sidebar";
import logo from "./assets/logo.png"

const AppLayout = () => {
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  console.log("location",location)
  const basePath = location.pathname === "/"
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <Toaster />
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div className={`justify-center items-center flex-col gap-2 ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img src={logo} width={200} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
      </div>
    </div>
  );
};

export default AppLayout;
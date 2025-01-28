import { Outlet } from "react-router-dom";
import logo from "./assets/logo.png"

const AuthLayout = () => {
  return (
    <div>
      <div className="flex items-center justify-center py-3 h-20 shadow-md bg-white"><img src={logo} alt="logo" className="w-100 h-10"/></div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
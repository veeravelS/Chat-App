import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

const Sidebar = () => {
   const user = useSelector((state)=>state?.user?.userDetails);
   console.log(user);
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="w-full h-full">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between">
        <div>
          <NavLink
            className={`w-12 h-12 cursor-pointer hover:bg-slate-200 flex justify-center items-center ${
              isActive ? "bg-slate-200" : ""
            }`}
            title="chat"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>
          <div
            className={`w-12 h-12 cursor-pointer hover:bg-slate-200 flex justify-center items-center ${
              isActive ? "bg-slate-200" : ""
            }`}
            title="new user"
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
        <button
          className="mx-auto" title={user.name}
        >
        </button>
          <button className="mr-1">
            <Avatar width={25} height={25} name={user.name!=="" ? user.name : ""}  />
          </button>
        <button
          className={`w-12 h-12 cursor-pointer hover:bg-slate-200 flex justify-center items-center ${
            isActive ? "bg-slate-200" : ""
          }`}
          title="logout"
        >
          <span className="mr-2">
            <BiLogOut size={20} />
          </span>
        </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

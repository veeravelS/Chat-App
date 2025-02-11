import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { FiArrowUpLeft } from "react-icons/fi";
import EditUserDetail from "./EditUserDetail";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const user = useSelector((state) => state?.user?.userDetails);
  console.log(user);
  const [isActive, setIsActive] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser,setOpenSearchUser] = useState(false);

  const handleEditUserOpen = () => {
    setEditUserOpen(true);
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
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
            onClick={()=>setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleEditUserOpen}
            className="mx-auto mr-3"
            title={user.name}
          >
            <Avatar
              width={25}
              height={25}
              name={user.name !== "" ? user.name : ""}
              imageUrl={user.profile_pic}
            />
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
      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {
            allUser.length === 0 && (
              <div className="mt-10">
                <div className="flex justify-center items-center my-4 text-slate-400">
                  <FiArrowUpLeft size={40}/>
                </div>
                <p className="text-lg text-center text-slate-400">Explore user to start a conversation with .</p>
              </div>
            )
          }
        </div>
      </div>
      {editUserOpen && (
        <EditUserDetail onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {
        openSearchUser && (
          <SearchUser onClose={()=>setOpenSearchUser(false)}/>
        )
      }
    </div>
  );
};

export default Sidebar;

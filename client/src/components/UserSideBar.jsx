import { useSocket } from "../socket/socketContext";
import { useEffect, useState } from "react";
import { FaImage, FaVideo } from "react-icons/fa";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { NavLink, useParams } from "react-router-dom";
import { FiArrowUpLeft } from "react-icons/fi";
import { MessageSquareMoreIcon } from "lucide-react";
import SearchUser from "./SearchUser";
import { useTheme } from "next-themes";

const UserSideBar = () => {
  const {resolvedTheme} = useTheme();
  const user = useSelector((state) => state?.user?.userDetails);
  const socket = useSocket();
  const params = useParams();
  const [allUser, setAllUser] = useState([]);
  useEffect(() => {
    if (!socket || !socket.connected || !user?._id) return;
    console.log("test");
    const fetchConversation = () => {
      socket.emit("sidebar", user._id);
    };

    const handleConversation = (data) => {
      const conversationUserData = data.map((conversationUser) => {
        if (conversationUser?.sender?._id === conversationUser?.receiver?.id) {
          return { ...conversationUser, userDetails: conversationUser?.sender };
        } else if (conversationUser?.receiver?._id !== user?._id) {
          return {
            ...conversationUser,
            userDetails: conversationUser?.receiver,
          };
        } else {
          return { ...conversationUser, userDetails: conversationUser?.sender };
        }
      });
      setAllUser(conversationUserData);
    };

    if (socket.connected) {
      fetchConversation();
    }

    socket.on("connect", fetchConversation);

    fetchConversation();
    socket.on("conversation", handleConversation);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchConversation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      socket.off("conversation", handleConversation);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, user?._id]);
  console.log(params)
  return (
    <div className="w-full overflow-y-scroll">
      <div className="h-16 flex items-center">
        <SearchUser setAllUser={setAllUser} allUser={allUser} />
      </div>
      <div className={`${resolvedTheme == "dark" ? "bg-slate-800 p-[0.5px]" : "bg-slate-200 p-[0.5px]"}`}></div>
      <div className="h-full w-full overflow-x-hidden overflow-y-auto scrollbar">
        {allUser.length === 0 && (
          <div className="mt-10">
            <div className="flex justify-center items-center my-4 text-slate-400">
              <FiArrowUpLeft size={40} />
            </div>
            <p className="text-lg text-center text-slate-400">
              Explore user to start a conversation with .
            </p>
          </div>
        )}
        {allUser.map((conv, index) => {
          return (
            <NavLink
              to={`/message/${conv?.userDetails._id}`}
              key={conv._id}
              className={`flex items-center hover:bg-gray-100  text-black dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:hover:text-white ${
                conv?.userDetails._id == params.userId ? "dark:!bg-zinc-800 dark:text-white bg-gray-100 text-black" : ""
              } gap-2 py-2 px-2 border-b`}
            >
              <div>
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-sm">
                  {conv?.userDetails?.name}
                </h3>
                <div className="flex items-center justify-start gap-1">
                  {conv?.lastMsg?.imageUrl && (
                    <div className="flex justify-start items-center gap-1">
                      <span className="mt-[2px] text-slate-500">
                        <FaImage size={12} />
                      </span>
                      {!conv?.lastMsg?.text && (
                        <span className="text-xs text-slate-500">Image</span>
                      )}
                    </div>
                  )}
                  {conv?.lastMsg?.videoUrl && (
                    <div className="flex justify-start items-center gap-1">
                      <span className="mt-[2px] text-slate-500">
                        <FaVideo size={12} />
                      </span>
                      {!conv?.lastMsg?.text && (
                        <span className="text-xs text-slate-500">Video</span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-ellipsis line-clamp-1 text-slate-500">
                    {conv?.lastMsg?.text}
                  </p>
                </div>
              </div>
              {Boolean(conv?.unseenMsg) && (
                <p className="text-xs w-5 h-5 flex justify-center items-center bg-primary text-white rounded-full ml-auto">
                  {conv?.unseenMsg}
                </p>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default UserSideBar;
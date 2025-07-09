import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
import Avatar from "./Avatar";
import { IoCloseSharp } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import Loader from "./Loader";
import backgroundImage from "../assets/wallapaper.jpeg";
import darkBackgroundImage from "../assets/bg_dark_wallpaper.jpg";
import moment from "moment";
import { useSocket } from "../socket/socketContext";
import UserSideBar from "./UserSideBar";
import logo from "../assets/logo.png";
import { SendHorizontal } from "lucide-react";
import FileUploadComboBox from "./FileUploadComboBox";
import { useTheme } from "next-themes";

const MessagePage = () => {
  const params = useParams();
  const {resolvedTheme} = useTheme();
  const [dataUser, setDataUser] = useState({});
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const bgImage = resolvedTheme == "dark" ? darkBackgroundImage : backgroundImage;
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessageRef = useRef(null);
  const user = useSelector((state) => state?.user?.userDetails);
  const lastSeenEmitTime = useRef(0);
  const socket = useSocket();
  const handleUploadImage = async (e) => {
    const files = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(files);
    setLoading(false);
    setMessage((prev) => ({
      ...prev,
      imageUrl: uploadPhoto.secure_url,
    }));
  };

  const handleUploadVideo = async (e) => {
    const files = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(files);
    setLoading(false);
    setMessage((prev) => ({
      ...prev,
      videoUrl: uploadVideo.secure_url,
    }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({
      ...prev,
      videoUrl: "",
    }));
  };

  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socket) {
        socket.emit("new message", {
          sender: user?._id,
          receiver: params?.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user._id,
        });
        setMessage({ text: "", imageUrl: "", videoUrl: "" });
      }
    }
  };

  useEffect(() => {
    if (currentMessageRef.current) {
      currentMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (!socket || !params.userId) return;
    if (socket) {
      console.log("Emitting message-page event for user:", params.userId);
      socket.emit("message-page", params.userId);
      socket.emit("seen", params.userId);

      const handleMessageUser = (data) => {
        setDataUser(data);
      };

      const handleMessage = (data) => {
        const reverseData = data ? data.reverse() : [];
        setAllMessage(reverseData);
        const now = Date.now();
        if (now - lastSeenEmitTime.current > 2000) {
          socket.emit("seen", params.userId);
          lastSeenEmitTime.current = now;
        }
      };

      socket.on("message-user", handleMessageUser);
      socket.on("message", handleMessage);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        socket.off("message-user", handleMessageUser);
        socket.off("message", handleMessage);
        // document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [socket, params.userId]);
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUserUpdate = (onlineUsers) => {
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        online: onlineUsers.includes(prevDataUser._id),
      }));
    };

    socket.on("onlineUser", handleOnlineUserUpdate);

    return () => {
      socket.off("onlineUser", handleOnlineUserUpdate);
    };
  }, [socket]);

  return (
    <div className="flex flex-row lg:flex-row rounded-md bg-white text-black dark:bg-zinc-900 dark:text-white shadow-md border mt-5 h-[calc(100vh-105px)] w-full">
      <div className={`hidden lg:block w-[300px] h-full border-r ${resolvedTheme == "dark"?"border-slate-800" : "border-slate-200"}`}>
        <UserSideBar />
      </div>
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className={` ${resolvedTheme=="dark"? "bg-contain" : "bg-contain"} z-30 ${
          !params.userId ? "hidden" : "block"
        } w-full h-full`}
      >
        <header className="sticky flex items-center justify-between p-4 top-0 h-16 bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-b">
          <div className="flex items-center gap-4">
            <Link to="/" className="lg:hidden">
              <FaAngleLeft size={25} />
            </Link>
            <div>
              <Avatar
                width={50}
                height={50}
                imageUrl={dataUser?.profile_pic}
                name={dataUser?.name}
                userId={dataUser?._id}
              />
            </div>
            <div>
              <h3 className="font-semibold text-md my-0 text-ellipsis line-clamp-1">
                {dataUser?.name}
              </h3>
              <p className="my-0 1-mt-1">
                {dataUser.online ? (
                  <span className="text-primary text-sm">online</span>
                ) : (
                  <span className="text-slate-500 text-sm">offline</span>
                )}
              </p>
            </div>
          </div>
          <div>
            <button className="cursor-pointer hover:text-primary">
              <BsThreeDotsVertical />
            </button>
          </div>
        </header>
        {/* show all message */}
        <section className={`h-[calc(100vh-226px)] bg-white text-black text-white ${resolvedTheme=="dark" ?"bg-opacity-0" : "bg-opacity-50"} relative overflow-x-hidden overflow-y-scroll scrollbar`}>
          <div ref={currentMessageRef} className="flex flex-col gap-2 py-2">
            {allMessage?.map((msg, index) => (
              <div
                key={index}
                className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user._id == msg.messageByUserId
                    ? "ml-auto bg-teal-100 bg-teal-100 text-black dark:bg-teal-900 dark:text-white"
                    : "bg-slate-50 text-black dark:bg-gray-100 dark:text-black"
                }`}
              >
                {msg.imageUrl && (
                  <div className="w-full max-w-md">
                    <img
                      src={msg.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                )}
                {msg.videoUrl && (
                  <div className="w-full max-w-md">
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  </div>
                )}
                <p className="px-2 rounded w-fit">{msg.text}</p>
                <p className={`px-2 rounded w-full text-xs text-gray-800 text-black ${ user._id == msg.messageByUserId ? "dark:text-white":"text-black" } text-right`}>
                  {moment(msg.createdAt).format("hh:mm A")}
                </p>
              </div>
            ))}
          </div>
          {message.imageUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center">
              <div
                onClick={handleClearUploadImage}
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              >
                <IoCloseSharp size={25} />
              </div>
              <div className="bg-white p-3">
                <img
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  src={message.imageUrl}
                  width={300}
                  height={300}
                  alt="uploadImage"
                />
              </div>
            </div>
          )}
          {message.videoUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center">
              <div
                onClick={handleClearUploadVideo}
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              >
                <IoCloseSharp size={25} />
              </div>
              <div className="bg-white p-3">
                <video
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  src={message.videoUrl}
                  width={300}
                  height={300}
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )}
          {loading && (
            <div className="flex sticky bottom-0 justify-center items-center h-full w-full">
              <Loader />
            </div>
          )}
        </section>

        {/* send message */}
        <section className="h-14 bg-white text-black dark:bg-zinc-900 dark:text-white rounded-br-md flex items-center  px-4">
          <div className="relative">
            <FileUploadComboBox
              onImageSelect={handleUploadImage}
              onVideoSelect={handleUploadVideo}
            />
          </div>
          <form
            className="w-full h-full flex gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              name="text"
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleChangeText}
            />
            <button
              type="submit"
              className="mt-3 cursor-pointer flex items-center justify-center hover:text-primary rounded-3xl  bg-[#286459] w-[65px] h-8"
            >
              <SendHorizontal size={18} color="white" />
            </button>
          </form>
        </section>
      </div>
      <div
        className={`justify-center w-full bg-white text-black dark:bg-zinc-900 dark:text-white items-center flex-col gap-2 ${
          params.userId ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={200} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default MessagePage;

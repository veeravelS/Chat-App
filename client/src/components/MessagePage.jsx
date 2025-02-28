import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import Avatar from "./Avatar";
import { IoCloseSharp } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import Loader from "./Loader";
import backgroundImage from "../assets/wallapaper.jpeg";
import { MdOutlineSend } from "react-icons/md";

const MessagePage = () => {
  const params = useParams();
  const [dataUser, setDataUser] = useState({});
  const [openUploadImageVideo, setOpenUploadImageVideo] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const user = useSelector((state) => state?.user?.userDetails);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  console.log("params", params);
  console.log("socketConnection", socketConnection);
  const handleOpenImageVideoUpload = () => {
    setOpenUploadImageVideo(!openUploadImageVideo);
  };

  const handleUploadImage = async (e) => {
    const files = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(files);
    setLoading(false);
    console.log(uploadPhoto);
    setOpenUploadImageVideo(false);
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
    setOpenUploadImageVideo(false);
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
      if (socketConnection) {
        socketConnection.emit("new message", {
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
    if(!socketConnection || !params.userId) return;
    if (socketConnection) {
      console.log("Emitting message-page event for user:", params.userId);
      socketConnection.emit("message-page", params.userId);

      const handleMessageUser = (data) => {
        setDataUser(data);
        console.log("data user", data);
      };

      const handleMessage = (data) => {
        setAllMessage(data);
        console.log("message data", data);
      };

      socketConnection.on("message-user", handleMessageUser);
      socketConnection.on("message", handleMessage);

      return () => {
        socketConnection.off("message-user", handleMessageUser);
        socketConnection.off("message", handleMessage);
      };
    }
  }, [socketConnection, params.userId, user]);
  console.log("all", allMessage);
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky flex items-center justify-between p-4 top-0 h-16 bg-white">
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
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="my-0 1-mt-1">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-500">offline</span>
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
      <section className="h-[calc(100vh-128px)] bg-slate-200 bg-opacity-50 relative overflow-x-hidden overflow-y-scroll scrollbar">
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center">
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
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center">
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
          <div className="flex justify-center items-center h-full w-full">
            <Loader />
          </div>
        )}
        <div>
          {allMessage.map((msg, index) => {
            return (
              <div key={index} className="bg-white p-1 py-1 rounded w-fit">
                <p className="px-2">{msg.text}</p>
              </div>
            );
          })}
        </div>
        Show all message
        {/* upload Image Display */}
      </section>

      {/* send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleOpenImageVideoUpload}
            className="flex justify-center items-center w-12 h-12 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>
          {/* video and image */}
          {openUploadImageVideo && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200"
                >
                  <div className="text-primary cursor-pointer">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200"
                >
                  <div className="text-purple-500 cursor-pointer">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                />
                <input
                  className="hidden"
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
        <form className="w-full h-full flex gap-2" onSubmit={handleSendMessage}>
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
            className="mt-2 cursor-pointer hover:text-primary"
          >
            <MdOutlineSend size={30} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";

const MessagePage = () => {
  const params = useParams();
  const [dataUser, setDataUser] = useState({});
  const [openUploadImageVideo, setOpenUploadImageVideo] = useState(false);
  const [uploadPhoto,setUploadPhoto]  =useState(null);
  const [message,setMessage] =  useState({
    text:"",
    imageUrl:"",
    videoUrl:""
  })
  const user = useSelector((state) => state?.user?.userDetails);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  console.log("params", params);
  console.log("socketConnection", socketConnection);
  const handleOpenImageVideoUpload = () => {
    setOpenUploadImageVideo(!openUploadImageVideo);
  };

  const handleUploadImage = async(e)=>{
    const files = e.target.files[0];
    const uploadPhoto = await uploadFile(files);
    console.log(uploadPhoto);
    setMessage((prev)=>({
      ...prev,imageUrl : uploadPhoto.secure_url
    }))
  }

  const handleUploadVideo = async(e)=>{
    const files = e.target.files[0];
    const uploadVideo = await uploadFile(files);
    console.log(uploadPhoto);
    setMessage((prev)=>({
      ...prev,videoUrl : uploadVideo.secure_url
    }))
  }

  useEffect(() => {
    if (socketConnection) {
      console.log("Emitting message-page event for user:", params.userId);
      socketConnection.emit("message-page", params.userId);
      socketConnection.on("message-user", (data) => {
        console.log("userDetails", data);
        setDataUser(data);
      });
    }
  }, [socketConnection, params.userId, user]);

  return (
    <div>
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
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar">
        Show all message
        {/* upload Image Display */}
        <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-3">
            <img src={message.imageUrl} width={300} height={300} alt="uploadImage"  />
          </div>
        </div>
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
                <input className="hidden" type="file" id="uploadImage" onChange={handleUploadImage} />
                <input className="hidden" type="file" id="uploadImage" onChange={handleUploadVideo} />
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagePage;

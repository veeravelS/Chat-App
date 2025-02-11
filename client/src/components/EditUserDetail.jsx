import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setUsers } from "../store/userSlice";

const EditUserDetail = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();
  useEffect(()=>{
    setData((prev)=>({...prev,...user}
    ))
  },[])
  console.log(user);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const files = e.target.files[0];
    const uploadPhoto = await uploadFile(files);
    console.log(uploadPhoto);
    setData((prev) => ({ ...prev, profile_pic: uploadPhoto.secure_url }));
  };

  const handleOpenUploadPhoto = ()=>{
        uploadPhotoRef.current.click();
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`
      const response = await axios.post(URL,data, { withCredentials: true });
      console.log(response?.data)
      toast.success(response?.data?.message);
      onClose();
      if(response.data.success){
        dispatch(setUsers(response?.data?.data))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };
  return (  
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">profile details</h2>
        <p className="text-sm">Edit User details</p>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit} action="">
          <div className="flex flex-col gap-1">
            <label htmlFor="">Name :</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 outline-primary border focus:outline-secondary border-0.5"
            />
          </div>
          <div>
            <div>Photo :</div>
            <div className="my-1 flex items-center gap-3">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button type="button" className="font-semibold" onClick={handleOpenUploadPhoto}>Change Photo</button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
        <Divider />
        <div className="flex gap-2 mt-3 w-fit ml-auto">
          <button onClick={onClose} className="border-primary border text-primary px-4 py-1 hover:bg-primary hover:text-white rounded">
            Cancel
          </button>
          <button  type="submit" className="border-primary border bg-primary hover:bg-secondary text-white px-4 py-1 rounded">
            Save
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetail;
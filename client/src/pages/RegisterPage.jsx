import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const files = e.target.files[0];
    const uploadPhoto = await uploadFile(files);
    console.log(uploadPhoto);
    setData((prev)=>({...prev,profile_pic:uploadPhoto.secure_url}))
    setUploadPhoto(files);
  };

  const handleClearUploadPhoto = () => {
    setUploadPhoto("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`
    try {
      const response = await axios.post(URL,data);
      toast.success(response?.data?.message)
      console.log(response);
      if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        })
        navigate("/login")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
    console.log("data", data);
  };
  
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden md:mx-auto p-4">
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center cursor-pointer rounded border hover:border-primary">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto.name ? uploadPhoto.name : "Upload profile photo"}
                </p>
                {uploadPhoto && (
                  <button
                    type="button"
                    className="text-lg ml-2 text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary px-4 py-1 hover:bg-secondary mt-2 font-bold leading-relaxed tracking-wide rounded-lg text-white"
          >
            Register
          </button>
        </form>
        <p className="py-3 text-center">
          Already have an account ?{" "}
          <Link
            to={"/login"}
            className="hover:text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
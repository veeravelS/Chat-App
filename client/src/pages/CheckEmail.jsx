import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { setUsers } from "../store/userSlice";
import { useDispatch } from "react-redux";
const CheckEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`
    try {
      const response = await axios.post(URL,data);
      toast.success(response?.data?.message)
      if(response.data.success){
        setData({
          email: "",
        })
        dispatch(setUsers(response?.data.data))
        navigate("/password",{state:response.data})
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return(
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden md:mx-auto p-4">
        <div className="w-fit mx-auto mb-2 flex justify-center align-center">
        <Avatar width={70} height={70} name={location?.state?.name} imageUrl={location?.state?.profile_pic}/>
        <h2 className="font-semibold text-sm">{location?.state?.name}</h2>
        </div>
        <h3 className="w-fit mx-auto my-3">Welcome to Chat App</h3>
        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="bg-primary px-4 py-1 hover:bg-secondary mt-2 font-bold leading-relaxed tracking-wide rounded-lg text-white"
          >
            Let's Go 
          </button>
        </form>
        <p className="py-3 text-center">
          New User ?{" "}
          <Link
            to={"/register"}
            className="hover:text-primary font-semibold hover:underline"
          >
            Register 
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail 
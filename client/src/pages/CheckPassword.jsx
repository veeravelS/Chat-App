import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setToken} from "../store/userSlice";

const CheckPassword = () => {
  const userDetail = useSelector((state)=>state.user.userDetails);
  console.log(userDetail);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`
    try {
      const response = await axios.post(URL, {
        userId: location?.state?.data?._id,
        password: data.password,
      }, {
        withCredentials: true
      });
      toast.success(response?.data?.message) 
      if(response.data.success){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem("token",response?.data?.token);
      }
      if(response.data.success){
        setData({
          password: "",
        })
        navigate("/")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  useEffect(()=>{
    if(!location?.state?.data?.name){
      navigate("/email")
    }
  })

  return(
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden md:mx-auto p-4">
        <div className="w-fit mx-auto">
        <Avatar width={70} height={70} name={location?.state?.data?.name} imageUrl={location?.state?.data?.profile_pic}/>
        <h2 className="font-semibold text-sm">{location?.state?.data?.name}</h2>
        </div>
        <h3 className="w-fit mx-auto my-3">Welcome to Chat App</h3>
        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Password :</label>
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
          <button
            type="submit"
            className="bg-primary px-4 py-1 hover:bg-secondary mt-2 font-bold leading-relaxed tracking-wide rounded-lg text-white"
          >
            Login 
          </button>
        </form>
        <p className="py-3 text-center text-primary">
          <Link
            to={"/forget-password"}
            className="hover:text-primary font-semibold hover:underline"
          >
          Forget Password ?{" "}
          </Link>
        </p>
      </div>
    </div>
  );
}
  
export default CheckPassword  
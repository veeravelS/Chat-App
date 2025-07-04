import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import Loader from "./Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import UserSearchCard from "./UserSearchCard";
const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async (e) => {
    setLoading(true);
    setSearch(e.target.value);
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
      const response = await axios.post(URL, { search: e.target.value });
      setSearchUser(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10 m-2">
        Search User
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name,email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={handleSearchUser}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearch size={25} />
          </div>
        </div>
        {/* display search user */}
        <div className="bg-white mt-2 w-full p-4">
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">no user found!</p>
          )}
          {loading && (
            <p className="flex justify-center align-center">
              <Loader />
            </p>
          )}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard user={user} key={index} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div className="absolute top-0 right-0 text-2xl p-4 lg:text-4xl hover:text-white" onClick={onClose}>
        <button>
          <IoMdClose size={25} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;

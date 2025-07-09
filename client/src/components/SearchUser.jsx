import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, UserPlus } from "lucide-react";
import UserSearchCard from "./UserSearchCard";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "./ui/combobox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const SearchUser = ({ onClose, allUser, setAllUser }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  console.log("allUser",allUser);
  const handleSearchUser = async (value) => {
    setSearch(value);
    setSelectedUserId(null);

    if (!value) {
      setSearchUser([]);
      return;
    }

    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
      const response = await axios.post(URL, { search: value });
      console.log(response.data);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleSelect = (user) => {
    setOpen(false);
    const isUser = allUser.some((u) => {
  console.log(typeof u._id, typeof user._id); 
  console.log(u._id, user._id); 
      return u.receiver.String(u._id) === String(user._id);});
    console.log(isUser)
    if (!isUser) {
      // const data = {
      //   ...user,
      //   userDetails: user,
      // };
      // console.log("test")
      // setAllUser((prev) => [...prev, data]);
      setSelectedUserId(user._id);
    }
    setSearch("");
    // onClose?.();
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      <div className="flex items-center justify-center h-20 gap-2">
        <UserPlus size={20} />
        <Combobox
          value={selectedUserId ? String(selectedUserId) : undefined}
          onValueChange={(val) => {
            setSelectedUserId(val);
            setOpen(false);
          }}
          className="w-[200px]"
        >
          <ComboboxTrigger asChild className="w-[200px]">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[185px] justify-between"
              onClick={() => setOpen(true)}
            >
              Search a user
              <ChevronDown />
            </Button>
          </ComboboxTrigger>
          {open && (
            <ComboboxContent className="absolute w-[300px] dark:bg-zinc-900 dark:text-black  h-[200px] -left-20 overflow-y-auto max-h-[300px]">
              <Command className="w-200 dark:bg-zinc-900 dark:text-white h-full flex items-center justify-start">
                <CommandInput
                  onValueChange={(val) => handleSearchUser(val)}
                  value={search}
                  placeholder="Search user..."
                  c
                />
                <CommandEmpty className="w-200 flex  justify-center items-center text-gray-500 text-sm h-full">
                  No user found.
                </CommandEmpty>
                <CommandGroup>
                  {searchUser.map((user) => (
                    <ComboboxItem
                      key={user?._id}
                      value={String(user._id)}
                      onSelect={() => handleSelect(user)}
                    >
                      <Link
                        to={"/message/" + String(user._id)}
                        onClick={onClose}
                        className="flex items-center gap-3 mt-3 p-2 lg:p-2 w-full border border-transparent hover:bg-slate-100 dark:border-t-slate-700 border-t-slate-200 dark:text-white dark:hover:text-white dark:hover:bg-slate-800 rounded cursor-pointer"
                      >
                        <div>
                          <Avatar
                            width={30}
                            height={30}
                            name={user?.name}
                            userId={user?._id}
                            imageUrl={user?.profile_pic}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-ellipsis line-clamp-1">
                            {user?.name}
                          </div>
                          <p className="text-sm text-ellipsis line-clamp-1">
                            {user?.email}
                          </p>
                        </div>
                      </Link>
                    </ComboboxItem>
                  ))}
                </CommandGroup>
              </Command>
            </ComboboxContent>
          )}
        </Combobox>
      </div>
    </div>
  );
};

export default SearchUser;

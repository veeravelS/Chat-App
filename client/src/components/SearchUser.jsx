import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, UserPlus } from "lucide-react";
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
import { Button } from "./ui/button";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const SearchUser = ({ onClose, allUser, setAllUser }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user) => {
    const isUser = allUser.some((u) => String(u._id) === String(user._id));
    if (!isUser) {
      setSelectedUserId(user._id);
    }
    setSearch("");
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      <div className="flex items-center justify-center h-20 gap-2">
        <UserPlus size={20} />
        <Combobox
          value={selectedUserId ? String(selectedUserId) : undefined}
          onValueChange={(val) => {
            setSelectedUserId(val);
          }}
        >
          <ComboboxTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[185px] justify-between"
            >
              Search a user
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </ComboboxTrigger>
          <ComboboxContent className="w-[300px] dark:bg-zinc-900 bg-white p-0">
            <Command
              shouldFilter={false}
              className="dark:bg-zinc-900 dark:text-white bg-white text-black"
            >
              <CommandInput
                value={search}
                onValueChange={handleSearchUser}
                placeholder="Search user..."
              />
              <CommandEmpty>
                {loading ? "Searching..." : "No user found."}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] dark:bg-zinc-900 dark:text-white bg-white text-black overflow-y-auto">
                {searchUser.map((user) => (
                  <ComboboxItem
                    key={user._id}
                    value={String(user._id)}
                    onSelect={(currentValue) => {
                      if (currentValue === String(user._id)) {
                        handleSelect(user);
                        document.dispatchEvent(
                          new KeyboardEvent("keydown", { key: "Escape" })
                        );
                      }
                    }}
                  >
                    <Link
                      to={`/message/${user._id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 w-full p-2 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded cursor-pointer"
                    >
                      <Avatar
                        width={30}
                        height={30}
                        name={user.name}
                        userId={user._id}
                        imageUrl={user.profile_pic}
                      />
                      <div>
                        <div className="font-semibold line-clamp-1">
                          {user.name}
                        </div>
                        <p className="text-sm line-clamp-1">{user.email}</p>
                      </div>
                    </Link>
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </Command>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
};

export default SearchUser;

import { Bell, MessageSquare} from "lucide-react";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  return (
    <div className="w-full h-16 sticky top-0 bg-white border-b flex items-center justify-between">
      <p className="font-bold text-md">Messages</p>
      <div className="flex items-center gap-2 h-8">
        <div className="flex gap-4">
          <MessageSquare onClick={()=>navigate("/message")} className="cursor-pointer"  size={22} />
          <Bell className="cursor-pointer" size={22} />
        </div>
        <div className="h-full w-[1.5px] bg-gray-300" />
        <Avatar
          width={28}
          height={28}
          name={user?.name !== "" ? user?.name : ""}
          imageUrl={user?.profile_pic}
        />
        <p className="text-xs font-semibold">{user?.name}</p>
      </div>
    </div>
  );
};

export default Header;

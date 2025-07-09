import { Bell, MessageCircleMore, Moon, Sun } from "lucide-react";
import Avatar from "./Avatar";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Header = () => {
  const pathnameChange = {
    "/message": "Message",
    "/message/:userId":"Message",
    "/profile": "Profile",
  };
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const pathName = pathnameChange[location.pathname];
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const getPageTitle = () => {
  for (const path in pathnameChange) {
    if (matchPath({ path, end: false }, location.pathname)) {
      return pathnameChange[path];
    }
  }
  return "Dashboard"; // fallback
};

const pageTitle = getPageTitle();
  return (
    <div className="w-full h-16 sticky top-0 bg-white text-black dark:bg-zinc-900 dark:text-white border-b flex items-center justify-between">
      <p className="font-bold text-md">{pageTitle}</p>
      <div className="flex items-center gap-2 h-8">
        <div className="flex gap-3 items-center">
          <MessageCircleMore
            onClick={() => navigate("/message")}
            className="cursor-pointer"
            size={22}
          />
          <Bell className="cursor-pointer" size={22} />
          <div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full p-3"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
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

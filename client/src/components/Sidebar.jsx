import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";
import {FileText, User, LogOut } from "lucide-react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { logout } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logRef = useRef(null);
  const pathname = location.pathname;
  const [logModalOpen, setLogModalOpen] = useState(false);
  const links = [
    // { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    // { href: "/users", icon: Users, label: "Users" },
    { href: "/message", icon: FileText, label: "Messages" },
    { href: "/profile", icon: User, label: "User Profile" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };
  const isActive = (href) => {
  return matchPath({ path: href, end: false }, pathname);
};

  // Close the modal when clicking outside
  const handleClickOutside = (event) => {
    if (logRef.current && !logRef.current.contains(event.target)) {
      setLogModalOpen(false);
    }
  };
  // Add event listener for clicks outside the modal
  document.addEventListener("mousedown", handleClickOutside);

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-[12rem] flex-col border-r dark:bg-zinc-900 dark:text-white sm:flex">
          <div className="flex items-center justify-center h-16 border-b">
            <img src={logo} alt="logo" width={120} />
          </div>
          <nav className="flex flex-col items-start gap-1 px-4 py-4 w-full">
            {links.map((link) => (
              <div key={link.href} className="w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  </TooltipTrigger>
                  {/* Tooltip won't show when label is visible (wide sidebar) */}
                  {window.innerWidth < 768 && (
                    <TooltipContent side="right" sideOffset={5}>
                      {link.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            ))}
          </nav>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-start pl-4 h-16 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => setLogModalOpen(true)}
                  className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                >
                  <LogOut />
                  <span>Logout</span>
                </div>
              </TooltipTrigger>
              {/* Tooltip won't show when label is visible (wide sidebar) */}
              {window.innerWidth < 768 && (
                <TooltipContent side="right" sideOffset={5}>
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
            {
              logModalOpen && (
                 <div ref={logRef} className="w-35 mb-40 -ml-10 bg-white rounded-lg dark:bg-zinc-800 shadow-md p-4 gap-3">
                  <p className="text-sm">Do you really want to logout?</p>
                  <div className="flex flex-row mt-1">
                  <Button className="mr-2 px-5 bg-white hover:bg-white text-black" onClick={() => setLogModalOpen(false)}>No</Button>
                   <Button  onClick={handleLogout} className="bg-primary px-5">Yes</Button>
                  </div>
                 </div>
              )
            }
          </div>
        </aside>
      </TooltipProvider>
    </>
  );
}

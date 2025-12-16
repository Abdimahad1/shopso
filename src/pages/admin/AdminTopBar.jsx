// AdminTopBar.jsx – UPDATED with proper mobile sidebar toggle
import { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";

export default function AdminTopBar({ toggleSidebar }) {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  });

  // Load user safely
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Safely get initials
  const getInitials = () => {
    if (!user?.name) return "AU";
    
    try {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    } catch (error) {
      return "AU";
    }
  };

  // Safely get user display name
  const getDisplayName = () => {
    if (!user?.name) return "Admin";
    try {
      return user.name.split(" ")[0];
    } catch (error) {
      return "Admin";
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div
        className="
          flex md:hidden
          items-center justify-between
          h-16 w-full 
          fixed top-0 z-[100] 
          px-4
        "
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,247,250,0.97))",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {/* LEFT: MENU BUTTON + MINI LOGO */}
        <div className="flex items-center gap-3">
          {/* MENU TOGGLE BUTTON - IMPORTANT: This triggers the sidebar */}
          <button
            onClick={handleMobileMenuToggle}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-300"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              className="w-6 h-6 drop-shadow-md"
              alt="shop"
            />
            <span
              className="font-bold text-xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1e293b",
              }}
            >
              Shop<span className="text-indigo-600 italic">So</span>
            </span>
          </div>
        </div>

        {/* RIGHT: MOBILE ACTIONS */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATION (MOBILE) */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition">
            <MdNotifications className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* USER AVATAR (MOBILE) */}
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${getInitials()}&background=6366f1&color=fff&bold=true&size=64`}
              alt="avatar"
              className="w-8 h-8 rounded-xl border border-white shadow-md"
            />
            <span className="text-sm font-medium text-gray-900 hidden sm:inline">
              {getDisplayName()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div
      className="
        hidden md:grid 
        grid-cols-3 
        items-center 
        h-16 w-full 
        fixed top-0 z-40 
        px-6
      "
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,247,250,0.9))",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        left: 0,
        right: 0,
        width: "calc(100% - var(--sidebar-width, 288px))",
        marginLeft: "var(--sidebar-width, 288px)",
        transition: "margin-left 300ms ease, width 300ms ease"
      }}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center">
        {/* Optional content */}
      </div>

      {/* CENTER SECTION */}
      <div className="flex justify-center items-center gap-2 select-none">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
          className="w-8 h-8 drop-shadow-md"
          alt="shop"
        />

        <span
          className="font-extrabold text-3xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#1e293b",
            textShadow: "0 3px 10px rgba(0,0,0,0.2)",
            letterSpacing: "1px",
          }}
        >
          Shop<span className="text-indigo-600 italic">So</span>
        </span>

        <span className="w-3 h-3 bg-green-500 rounded-full shadow-sm animate-pulse"></span>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-end gap-4">
        {/* NOTIFICATION ICON */}
        <button className="relative group p-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
            className="w-7 h-7 opacity-90 group-hover:opacity-100 transition"
            alt="notifications"
          />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* ONLINE BADGE */}
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-sm">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-green-700">Online</span>
        </div>

        {/* USER PROFILE */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
          <img
            src={`https://ui-avatars.com/api/?name=${getInitials()}&background=6366f1&color=fff&bold=true&size=128`}
            alt="avatar"
            className="
              w-10 h-10 rounded-2xl border border-white 
              shadow-md transition transform hover:scale-105
            "
            style={{
              filter: "drop-shadow(0 3px 6px rgba(99,102,241,0.25))",
            }}
          />

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
              {user?.name || "Admin User"}
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
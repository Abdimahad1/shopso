// ShopOwnerTopBar.jsx - COMPLETELY FIXED
import { useState, useEffect } from "react";
import { MdNotifications, MdMenu, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ShopOwnerTopBar({ toggleSidebar, isMobile, mobileSidebarOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Shop Owner",
    email: "owner@example.com",
    role: "shopOwner",
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

  // Safely get initials
  const getInitials = () => {
    if (!user?.name) return "SO";
    try {
      return user.name
        .split(" ")
        .map((e) => e[0])
        .join("")
        .toUpperCase();
    } catch (error) {
      return "SO";
    }
  };

  const getAvatarColor = () => {
    switch (user?.role) {
      case "shopOwner": return "10b981";
      case "admin": return "6366f1";
      default: return "6b7280";
    }
  };

  const handleMenuClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("🟢 MENU CLICK - TopBar button clicked");
  console.log("🟢 Current mobileSidebarOpen state:", mobileSidebarOpen);
  
  // Add a small delay to see if state changes immediately
  setTimeout(() => {
    console.log("🟢 After timeout - mobileSidebarOpen:", mobileSidebarOpen);
  }, 100);
  
  if (toggleSidebar) {
    toggleSidebar();
  }
};

  // MOBILE VIEW - COMPLETELY FIXED
  if (isMobile) {
    return (
      <div
        className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200"
        style={{
          height: "64px",
          paddingTop: "env(safe-area-inset-top, 0px)",
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div className="grid grid-cols-3 items-center h-full px-4">
          {/* LEFT — MENU */}
          <div className="flex items-center">
            <button
              onClick={handleMenuClick}
              className="p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Menu"
              style={{
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                WebkitTapHighlightColor: 'transparent',
                outline: 'none'
              }}
            >
              {mobileSidebarOpen ? (
                <MdClose className="w-6 h-6 text-gray-700" />
              ) : (
                <MdMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* CENTER — LOGO */}
          <div className="flex justify-center items-center gap-2 select-none">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="ShopSo"
              className="w-6 h-6"
            />
            <span
              className="font-extrabold text-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1e293b",
              }}
            >
              Shop<span className="text-green-600 italic">So</span>
            </span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate("/shop/notifications")}
              className="p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
              aria-label="Notifications"
              style={{
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                WebkitTapHighlightColor: 'transparent',
                outline: 'none'
              }}
            >
              <MdNotifications className="w-5 h-5 text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img
                src={`https://ui-avatars.com/api/?name=${getInitials()}&background=${getAvatarColor()}&color=fff&bold=true`}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="hidden md:block">
      <div 
        className="fixed top-4 z-40 rounded-2xl shadow-lg bg-white border border-gray-200"
        style={{
          left: "calc(var(--sidebar-width, 288px) + 1.5rem)",
          right: "1.5rem",
          height: "64px",
          transition: "left 300ms ease",
        }}
      >
        <div className="grid grid-cols-3 items-center h-full px-6">
          
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
              aria-label="Toggle sidebar"
              style={{ width: "44px", height: "44px" }}
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
          </div>

          <div className="flex justify-center items-center gap-3 select-none">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              className="w-8 h-8"
              alt="shop"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <span
              className="font-extrabold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1e293b",
                fontSize: "28px",
                lineHeight: "1.2",
              }}
            >
              Shop<span className="text-green-600 italic">So</span>
            </span>
            <span 
              className="w-3 h-3 bg-green-500 rounded-full shadow-sm animate-pulse"
              style={{ width: "12px", height: "12px" }}
            ></span>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => navigate("/shop/notifications")}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
              style={{ width: "44px", height: "44px" }}
            >
              <MdNotifications className="text-xl text-gray-700" />
              <span 
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                style={{ width: "12px", height: "12px" }}
              ></span>
            </button>

            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <span 
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                style={{ width: "8px", height: "8px" }}
              ></span>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
              <div
                className="rounded-2xl border-2 border-white shadow-md overflow-hidden"
                style={{ width: "40px", height: "40px" }}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${getInitials()}&background=${getAvatarColor()}&color=fff&bold=true&size=128`}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span 
                  className="font-semibold text-gray-900 truncate"
                  style={{ fontSize: "14px", maxWidth: "140px" }}
                >
                  {user?.name || "Shop Owner"}
                </span>
                <span 
                  className="text-gray-500"
                  style={{ fontSize: "12px" }}
                >
                  Shop Owner
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
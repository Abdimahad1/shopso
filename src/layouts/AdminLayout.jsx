// src/layouts/AdminLayout.jsx – UPDATED WITH PROPER MOBILE SIDEBAR CONTROL
import { useState, useEffect } from "react";
import AdminSidebar from "../pages/admin/AdminSidebar";
import AdminTopBar from "../pages/admin/AdminTopBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // AUTH CHECK
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          navigate("/", {
            state: {
              message: "Session expired. Please login again.",
              redirectFrom: window.location.pathname,
            },
          });
          return false;
        }

        const user = JSON.parse(userData);
        if (user.role !== "admin") {
          localStorage.clear();
          navigate("/", {
            state: { message: "Access denied. Admin privileges required." },
          });
          return false;
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.clear();
        navigate("/", {
          state: { message: "Authentication error. Please login again." },
        });
        return false;
      }
    };

    checkAuth();

    const logoutHandler = () => {
      localStorage.clear();
      navigate("/", { replace: true });
    };

    window.addEventListener("force-logout", logoutHandler);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("force-logout", logoutHandler);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  // SCREEN SIZE CHECK
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
        // Close mobile sidebar when resizing to desktop
        if (!mobile) {
          setMobileSidebarOpen(false);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Update CSS variables when sidebar toggles
  useEffect(() => {
    if (!isMobile) {
      const sidebarWidth = sidebarCollapsed ? "80px" : "288px";
      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
    }
  }, [sidebarCollapsed, isMobile]);

  // Combined toggle function that works for both desktop and mobile
  const toggleSidebar = () => {
    if (isMobile) {
      // For mobile, toggle the mobile sidebar open/close
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      // For desktop, toggle collapse/expand
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Function to close mobile sidebar (passed to sidebar component)
  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  // If not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* CSS VARIABLES */}
      <style>{`
        :root {
          --sidebar-width: 288px;
          --topbar-height: 64px;
        }
      `}</style>

      {/* SIDEBAR */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* MAIN AREA */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0px" : "var(--sidebar-width)",
          width: isMobile ? "100%" : "calc(100% - var(--sidebar-width))",
          minHeight: "100vh",
        }}
      >
        {/* FIXED TOP BAR */}
        <AdminTopBar toggleSidebar={toggleSidebar} />

        {/* MAIN CONTENT */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{
            backgroundColor: "#f9fafb",
            marginTop: "var(--topbar-height)",
            height: "calc(100vh - var(--topbar-height))",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* MOBILE SAFE AREA */}
      {isMobile && <div className="h-4"></div>}

      {/* GLOBAL STYLES */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f1f1;
        }
        *::-webkit-scrollbar { 
          width: 6px; 
          height: 6px; 
        }
        *::-webkit-scrollbar-track { 
          background: #f1f1f1; 
          border-radius: 10px; 
        }
        *::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px; 
        }
        *::-webkit-scrollbar-thumb:hover { 
          background: #94a3b8; 
        }
        
        /* Prevent body scrolling when mobile sidebar is open */
        body.sidebar-open {
          overflow: hidden;
        }
      `}</style>

      {/* Add/remove body class when mobile sidebar opens/closes */}
      <style>{`
        ${mobileSidebarOpen ? `
          body {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
          }
        ` : ''}
      `}</style>
    </div>
  );
}
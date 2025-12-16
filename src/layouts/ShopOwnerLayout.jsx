// layouts/ShopOwnerLayout.jsx – COMPLETELY FIXED
import { useState, useEffect, useRef } from "react";
import ShopOwnerSidebar from "../pages/shopOwner/ShopOwnerSidebar";
import ShopOwnerTopBar from "../pages/shopOwner/ShopOwnerTopBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function ShopOwnerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState("100vh");
  const navigate = useNavigate();
  const location = useLocation();
  const scrollY = useRef(0);

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
              redirectFrom: window.location.pathname
            }
          });
          return false;
        }

        const user = JSON.parse(userData);
        if (user.role !== "shopOwner") {
          localStorage.clear();
          navigate("/", {
            state: {
              message: "Access denied. Shop Owner account required."
            }
          });
          return false;
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.clear();
        navigate("/", {
          state: { message: "Authentication error. Please login again." }
        });
        return false;
      }
    };

    checkAuth();

    const handleLogout = () => {
      localStorage.clear();
      navigate("/", { replace: true });
    };

    window.addEventListener("force-logout", handleLogout);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("force-logout", handleLogout);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setWindowHeight(`${window.innerHeight}px`);
        setSidebarCollapsed(true);
      } else {
        setWindowHeight("100vh");
        // Auto close mobile sidebar when switching to desktop
        setMobileSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("orientationchange", checkScreenSize);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("orientationchange", checkScreenSize);
    };
  }, []);

  // Handle mobile sidebar open/close and body scroll lock
  useEffect(() => {
    if (isMobile) {
      if (mobileSidebarOpen) {
        // Save scroll position
        scrollY.current = window.scrollY;
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
      } else {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        
        // Restore scroll position
        if (scrollY.current) {
          window.scrollTo(0, scrollY.current);
        }
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [isMobile, mobileSidebarOpen]);

  // Update CSS variables when sidebar toggles
  useEffect(() => {
    if (!isMobile) {
      const sidebarWidth = sidebarCollapsed ? "80px" : "288px";
      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
      document.documentElement.style.setProperty('--sidebar-transition', '300ms');
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
      document.documentElement.style.setProperty('--sidebar-transition', '300ms');
    }
  }, [sidebarCollapsed, isMobile]);

  // Auto-expand sidebar when navigating to submenu items
  useEffect(() => {
    if (!isMobile && location.pathname !== "/shop") {
      const isSubmenuPath = location.pathname.includes("/products/") || 
                           location.pathname.includes("/orders/") ||
                           location.pathname.includes("/delivery/") ||
                           location.pathname.includes("/customers/") ||
                           location.pathname.includes("/reports/") ||
                           location.pathname.includes("/discounts/") ||
                           location.pathname.includes("/settings/");
      
      if (isSubmenuPath && sidebarCollapsed) {
        setSidebarCollapsed(false);
      }
    }
  }, [location.pathname, isMobile, sidebarCollapsed]);

  // FIXED: Toggle function - ONLY toggles, doesn't auto-close
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  // Close mobile sidebar - called from sidebar component
  const closeMobileSidebar = () => {
    if (isMobile && mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  // Handle window height for mobile browsers
  useEffect(() => {
    const updateHeight = () => {
      if (isMobile) {
        setWindowHeight(`${window.innerHeight}px`);
      }
    };

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isMobile]);

  // If not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen relative">

      {/* CSS VARIABLES */}
      <style>{`
        :root {
          --sidebar-width: ${isMobile ? "0px" : sidebarCollapsed ? "80px" : "288px"};
          --topbar-height: ${isMobile ? "64px" : "88px"};
          --mobile-topbar-height: 64px;
          --content-height: ${windowHeight}px;
        }

        @media (max-width: 767px) {
          :root {
            --topbar-height: var(--mobile-topbar-height);
            --content-height: ${windowHeight}px;
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <ShopOwnerSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-1 flex flex-col transition-all duration-300 w-full"
        style={{
          marginLeft: isMobile ? "0px" : "var(--sidebar-width)",
          width: isMobile ? "100%" : "calc(100% - var(--sidebar-width))",
          minHeight: "100vh",
        }}
      >
        {/* TOP BAR */}
        <ShopOwnerTopBar 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        {/* PAGE CONTENT */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden w-full"
          style={{
            backgroundColor: "#f9fafb",
            marginTop: "var(--topbar-height)",
            height: "calc(100vh - var(--topbar-height))",
            padding: isMobile ? "1rem" : "1.5rem 2rem",
          }}
        >
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>

      {/* GLOBAL STYLES */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f1f1;
          box-sizing: border-box;
        }

        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        html {
          height: 100%;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @supports (-webkit-touch-callout: none) {
          .min-h-screen, .h-screen {
            height: -webkit-fill-available !important;
          }
        }

        .overflow-y-auto { 
          -webkit-overflow-scrolling: touch !important; 
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        /* Mobile fixes */
        @media (max-width: 767px) {
          button {
            cursor: pointer !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            touch-action: manipulation !important;
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          button:active {
            opacity: 0.7 !important;
            transform: scale(0.98) !important;
          }
          
          .fixed {
            position: fixed !important;
          }

          .max-w-7xl {
            max-width: 100% !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }

        /* Z-INDEX HIERARCHY */
        .z-\[99999\] { z-index: 99999 !important; }  /* Mobile sidebar overlay */
        .z-\[9999\] { z-index: 9999 !important; }    /* Top bar */
        .z-50 { z-index: 50 !important; }           /* Desktop sidebar */

        /* Mobile sidebar animation */
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-sidebar-slide {
          animation: slideInFromLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
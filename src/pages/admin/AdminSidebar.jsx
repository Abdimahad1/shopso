// src/pages/admin/AdminSidebar.jsx - UPDATED WITH COLLAPSIBLE PROP
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdStore,
  MdOutlineStoreMallDirectory,
  MdGroups,
  MdShoppingCart,
  MdOutlinePendingActions,
  MdDeliveryDining,
  MdDirectionsBike,
  MdPayment,
  MdAssessment,
  MdBrush,
  MdSettings,
  MdSupportAgent,
  MdNotifications,
  MdLogout,
  MdMenu,
  MdExpandLess,
  MdChevronRight,
  MdAdd,
  MdHome,
  MdClose,
  MdWarning,
  MdCheckCircle,
  MdInfo
} from "react-icons/md";

// Toast Component
const LogoutToast = ({ onConfirm, onCancel, isMobile }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onCancel();
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onCancel]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  return (
    <div className={`fixed z-[100] ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-8 right-8'} transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <MdWarning className="text-2xl text-white" />
              </div>
              <div className="absolute -inset-1 bg-red-400 rounded-xl blur opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Confirm Logout</h3>
              <p className="text-sm text-gray-600 mt-1">Are you sure you want to logout?</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <MdInfo className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              You will need to login again to access the admin panel.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium rounded-xl transition-all duration-300 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <MdLogout className="text-lg" />
              <span>Logout</span>
            </button>
          </div>

          <div className="mt-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                style={{
                  animation: 'countdown 5s linear forwards'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Auto-closes in 5 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Toast Component
const SuccessToast = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed z-[100] top-4 right-4 md:top-8 md:right-8 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
    }`}>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg p-4 md:p-5 min-w-[280px] animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="text-xl text-white" />
            </div>
            <div className="absolute -inset-1 bg-green-400 rounded-lg blur opacity-30 animate-ping-slow"></div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">Success!</h4>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 hover:bg-green-100 rounded-lg transition-colors"
          >
            <MdClose className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// UPDATED: Accept collapsed and setCollapsed as props
export default function AdminSidebar({ collapsed = false, setCollapsed = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isSidebarClick = sidebarRef.current?.contains(event.target);
      const isPopupClick = popupRef.current?.contains(event.target);
      const isMobileMenuClick = mobileMenuRef.current?.contains(event.target);
      
      if (!isSidebarClick && !isPopupClick && !isMobileMenuClick) {
        setActivePopup(null);
        if (isMobile && !isMobileMenuClick) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  const handleMenuClick = (menuKey) => {
    if (isMobile) {
      setMobileMenuOpen(true);
      if (activePopup === menuKey) {
        setActivePopup(null);
      } else {
        setActivePopup(menuKey);
      }
    } else if (collapsed) {
      if (activePopup === menuKey) {
        setActivePopup(null);
      } else {
        setActivePopup(menuKey);
      }
    } else {
      setOpenMenu(prev => ({
        ...prev,
        [menuKey]: !prev[menuKey]
      }));
    }
  };

  useEffect(() => {
    const isSubmenuPath = Object.values(menuConfigs).some(config =>
      config.subItems.some(item => item.path === location.pathname)
    );
    
    if (isSubmenuPath) {
      setActivePopup(null);
    }
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    setShowLogoutToast(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    setShowSuccessToast(true);
    
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutToast(false);
  };

  const menuItem = (label, icon, path) => (
    <Link
      to={path}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
        location.pathname === path
          ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 font-semibold border-l-4 border-emerald-500 shadow-sm"
          : "hover:bg-gray-50 text-gray-700 hover:translate-x-1 hover:shadow-sm"
      }`}
      onClick={() => {
        setActivePopup(null);
        if (isMobile) {
          setMobileMenuOpen(false);
        }
      }}
    >
      <div className="relative group">
        {icon}
        {location.pathname === path && (
          <div className="absolute -inset-1 bg-emerald-200 rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition duration-300"></div>
        )}
      </div>
      {(!collapsed || isMobile) && (
        <span className="transition-all duration-300">{label}</span>
      )}
    </Link>
  );

  const menuIcon = (Icon, color, size = "text-xl") => (
    <div className="relative">
      <Icon 
        className={`${size} ${color} transition-transform duration-300 hover:scale-110`}
        style={{ 
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
        }}
      />
    </div>
  );

  // Menu configurations - Keeping the green/emerald theme for admin
  const menuConfigs = {
    shops: {
      label: "Shops",
      icon: menuIcon(MdStore, "text-purple-600"),
      subItems: [
        { icon: <MdOutlineStoreMallDirectory className="text-purple-500" />, label: "All Shops", path: "/admin/shops" },
        { icon: <MdAdd className="text-emerald-500" />, label: "Approve New", path: "/admin/shops/approve" },
        { icon: <MdOutlineStoreMallDirectory className="text-red-500" />, label: "Suspended", path: "/admin/shops/suspended" }
      ]
    },
    customers: {
      label: "Customers",
      icon: menuIcon(MdGroups, "text-orange-500"),
      subItems: [
        { icon: <MdGroups className="text-orange-500" />, label: "Customer List", path: "/admin/customers" },
        { icon: <MdShoppingCart className="text-blue-500" />, label: "Customer Orders", path: "/admin/customers/orders" }
      ]
    },
    orders: {
      label: "Orders",
      icon: menuIcon(MdShoppingCart, "text-blue-600"),
      subItems: [
        { icon: <MdShoppingCart className="text-blue-600" />, label: "All Orders", path: "/admin/orders" },
        { icon: <MdOutlinePendingActions className="text-yellow-500" />, label: "New", path: "/admin/orders/new" },
        { icon: <MdOutlinePendingActions className="text-blue-400" />, label: "In Progress", path: "/admin/orders/progress" },
        { icon: <MdOutlinePendingActions className="text-emerald-500" />, label: "Completed", path: "/admin/orders/completed" },
        { icon: <MdOutlinePendingActions className="text-red-500" />, label: "Cancelled", path: "/admin/orders/cancelled" }
      ]
    },
    delivery: {
      label: "Delivery",
      icon: menuIcon(MdDeliveryDining, "text-emerald-600"),
      subItems: [
        { icon: <MdDirectionsBike className="text-emerald-600" />, label: "Add Rider", path: "/admin/delivery/add-rider" },
        { icon: <MdDirectionsBike className="text-emerald-500" />, label: "Rider List", path: "/admin/delivery/riders" },
        { icon: <MdDirectionsBike className="text-emerald-400" />, label: "Delivery Logs", path: "/admin/delivery/logs" },
        { icon: <MdDirectionsBike className="text-emerald-700" />, label: "Delivery Performance", path: "/admin/delivery/performance" }
      ]
    },
    payments: {
      label: "Payments",
      icon: menuIcon(MdPayment, "text-yellow-600"),
      subItems: [
        { icon: <MdPayment className="text-yellow-500" />, label: "Mobile Money Logs", path: "/admin/payments/mobile-money" },
        { icon: <MdPayment className="text-yellow-600" />, label: "Platform Revenue", path: "/admin/payments/revenue" },
        { icon: <MdPayment className="text-yellow-700" />, label: "Subscription Payments", path: "/admin/payments/subscriptions" }
      ]
    },
    reports: {
      label: "Reports",
      icon: menuIcon(MdAssessment, "text-red-600"),
      subItems: [
        { icon: <MdAssessment className="text-red-500" />, label: "Sales Report", path: "/admin/reports/sales" },
        { icon: <MdAssessment className="text-red-600" />, label: "Shop Performance", path: "/admin/reports/shop-performance" },
        { icon: <MdAssessment className="text-red-400" />, label: "Marketplace Overview", path: "/admin/reports/overview" },
        { icon: <MdAssessment className="text-red-700" />, label: "Financial Reports", path: "/admin/reports/financial" }
      ]
    },
    templates: {
      label: "Templates",
      icon: menuIcon(MdBrush, "text-pink-600"),
      subItems: [
        { icon: <MdBrush className="text-pink-500" />, label: "Store Templates", path: "/admin/templates" },
        { icon: <MdAdd className="text-pink-600" />, label: "Add / Edit Template", path: "/admin/templates/add" }
      ]
    },
    settings: {
      label: "Settings",
      icon: menuIcon(MdSettings, "text-gray-700"),
      subItems: [
        { icon: <MdSettings className="text-gray-600" />, label: "Platform Settings", path: "/admin/settings/platform" },
        { icon: <MdSettings className="text-gray-700" />, label: "Roles & Permissions", path: "/admin/settings/roles" },
        { icon: <MdSettings className="text-gray-800" />, label: "API Keys", path: "/admin/settings/api" },
        { icon: <MdSettings className="text-gray-500" />, label: "Email/SMS Settings", path: "/admin/settings/notifications" }
      ]
    },
    support: {
      label: "Support",
      icon: menuIcon(MdSupportAgent, "text-indigo-600"),
      subItems: [
        { icon: <MdSupportAgent className="text-indigo-500" />, label: "Tickets", path: "/admin/support/tickets" },
        { icon: <MdSupportAgent className="text-indigo-600" />, label: "Issues & Requests", path: "/admin/support/issues" }
      ]
    }
  };

  const getActiveMenuIndex = () => {
    if (!activePopup) return 0;
    const menuKeys = Object.keys(menuConfigs);
    return menuKeys.indexOf(activePopup);
  };

  const getPopupVerticalPosition = () => {
    if (isMobile) return "4rem";
    const index = getActiveMenuIndex();
    const baseTop = 4 * 16;
    const itemHeight = 3.5 * 16;
    const topPosition = baseTop + (index * itemHeight);
    
    return `${topPosition}px`;
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      {isMobile && (
        <div className="md:hidden h-16 bg-white flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50 shadow-md border-b border-gray-100">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-300"
          >
            <MdMenu className="text-2xl text-emerald-600" />
          </button>

          <div className="flex items-center gap-2">
            <MdHome className="text-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-transparent bg-clip-text" />
            <span className="font-bold text-gray-800 text-lg">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <MdNotifications className="text-xl text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">
              AU
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <div
          ref={sidebarRef}
          className={`${
            collapsed ? "w-20" : "w-72"
          } h-screen bg-white shadow-xl flex flex-col transition-all duration-300 fixed left-0 top-0 z-50 overflow-hidden hidden md:flex`}
          style={{
            background: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
          }}
        >
          {/* HAMBURGER */}
          <div className="px-4 pt-6 pb-4">
            <button
              onClick={() => {
                setCollapsed(!collapsed);
                setActivePopup(null);
              }}
              className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
              style={{
                background: collapsed 
                  ? "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" 
                  : "transparent"
              }}
            >
              <MdMenu 
                className={`text-2xl text-gray-600 group-hover:text-gray-800 transition-transform duration-300 ${
                  collapsed ? "rotate-90" : ""
                }`}
                style={{ 
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                }}
              />
              {!collapsed && (
                <div className="ml-3 flex items-center gap-2">
                  <MdHome className="text-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-transparent bg-clip-text" />
                  <span className="font-bold text-gray-800 text-lg">
                    Admin Panel
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* MAIN MENU */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1">
            {menuItem(
              "Dashboard",
              menuIcon(MdDashboard, "text-blue-600"),
              "/admin"
            )}

            {Object.entries(menuConfigs).map(([key, config]) => (
              <div key={key} className="space-y-1 relative">
                <div
                  onClick={() => handleMenuClick(key)}
                  className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-300 hover:shadow-sm group ${
                    activePopup === key || openMenu[key]
                      ? "bg-gray-50 border border-gray-200"
                      : "hover:bg-gray-50"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <div className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-3"}`}>
                    <div className="relative">
                      {config.icon}
                      {activePopup === key && (
                        <div className="absolute -inset-1 bg-emerald-100 rounded-full blur opacity-30"></div>
                      )}
                    </div>
                    {!collapsed && (
                      <>
                        <span className="font-medium text-gray-800 group-hover:text-gray-900">
                          {config.label}
                        </span>
                        <div className="transform transition-transform duration-300 ml-auto">
                          {openMenu[key] ? (
                            <MdExpandLess className="text-gray-500 text-lg" />
                          ) : (
                            <MdChevronRight className="text-gray-400 text-lg group-hover:text-gray-600 transform group-hover:translate-x-0.5" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {!collapsed && openMenu[key] && (
                  <div className="mt-1 mb-2 space-y-1">
                    {config.subItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className={`flex items-center gap-3 p-2 pl-10 rounded-lg cursor-pointer transition-all duration-300 ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-medium border-l-2 border-emerald-400"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900 hover:translate-x-1"
                        }`}
                        onClick={() => {
                          setOpenMenu(prev => ({ ...prev, [key]: false }));
                          setActivePopup(null);
                        }}
                      >
                        <div className="relative">
                          {item.icon}
                          {location.pathname === item.path && (
                            <div className="absolute -inset-1 bg-emerald-100 rounded-full blur opacity-40"></div>
                          )}
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {menuItem(
              "Notifications",
              menuIcon(MdNotifications, "text-yellow-500"),
              "/admin/notifications"
            )}
          </div>

          {/* LOGOUT BUTTON */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 group hover:shadow-sm"
            >
              <MdLogout 
                className="text-xl group-hover:rotate-12 transition-transform duration-300"
                style={{ 
                  filter: "drop-shadow(0 1px 2px rgba(239,68,68,0.3))"
                }}
              />
              {!collapsed && (
                <span className="font-medium group-hover:text-red-700">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE SLIDE-OUT MENU */}
      {isMobile && mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-[9999]"
        >
          <div 
            className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 animate-in slide-in-from-left-2">
            <div className="h-16 bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <MdHome className="text-2xl text-white" />
                <span className="font-bold text-white text-lg">Admin Panel</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <MdClose className="text-xl text-white" />
              </button>
            </div>

            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 space-y-2">
              <Link
                to="/admin"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdDashboard className="text-xl text-blue-600" />
                <span className="font-medium text-gray-800">Dashboard</span>
              </Link>

              {Object.entries(menuConfigs).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <button
                    onClick={() => handleMenuClick(key)}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <span className="font-medium text-gray-800">
                        {config.label}
                      </span>
                    </div>
                    <MdChevronRight className={`text-xl text-gray-400 transition-transform duration-300 ${
                      activePopup === key ? "rotate-90" : ""
                    }`} />
                  </button>

                  {activePopup === key && (
                    <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
                      {config.subItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="text-gray-700">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/admin/notifications"
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdNotifications className="text-xl text-yellow-500" />
                <span className="font-medium text-gray-800">Notifications</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-6"
              >
                <MdLogout className="text-xl" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-OUT SUBMENUS FOR COLLAPSED MODE (Desktop only) */}
      {!isMobile && activePopup && menuConfigs[activePopup] && (
        <div 
          ref={popupRef}
          className="hidden md:block fixed z-50"
          style={{
            top: getPopupVerticalPosition(),
            left: collapsed ? "5rem" : "18rem",
          }}
        >
          <div className="bg-white shadow-2xl rounded-xl border border-gray-100 py-2 min-w-[220px] animate-in slide-in-from-left-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                {menuConfigs[activePopup].icon}
                <span className="font-semibold text-gray-800">
                  {menuConfigs[activePopup].label}
                </span>
              </div>
              <button
                onClick={() => setActivePopup(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="text-gray-500 text-lg" />
              </button>
            </div>
            
            <div className="py-2 max-h-[400px] overflow-y-auto">
              {menuConfigs[activePopup].subItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-medium"
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setActivePopup(null);
                    if (!collapsed) {
                      setOpenMenu(prev => ({ ...prev, [activePopup]: false }));
                    }
                  }}
                >
                  <div className="relative">
                    {item.icon}
                    {location.pathname === item.path && (
                      <div className="absolute -inset-1 bg-emerald-100 rounded-full blur opacity-30"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {location.pathname === item.path && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION TOAST */}
      {showLogoutToast && (
        <LogoutToast
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          isMobile={isMobile}
        />
      )}

      {/* SUCCESS TOAST */}
      {showSuccessToast && (
        <SuccessToast
          message="You have been successfully logged out!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes countdown {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .slide-in-from-bottom {
          animation: slideInFromBottom 0.3s ease-out;
        }

        .slide-in-from-right {
          animation: slideInFromRight 0.3s ease-out;
        }

        .slide-in-from-left-2 {
          animation: slideInFromLeft 0.3s ease-out;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .active\:scale-95:active {
          transform: scale(0.95);
        }

        body:has(.fixed.z-\\[100\\]) {
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .fixed.z-\\[100\\] {
            max-width: calc(100vw - 2rem);
          }
        }
      `}</style>
    </>
  );
}
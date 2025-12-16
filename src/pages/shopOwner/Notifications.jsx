// pages/shopOwner/Notifications.jsx - COMPREHENSIVE SYSTEM NOTIFICATIONS
import { useState, useEffect } from "react";
import {
  MdNotifications,
  MdNotificationsActive,
  MdNotificationsOff,
  MdCheckCircle,
  MdDelete,
  MdFilterList,
  MdMarkChatRead,
  MdArchive,
  MdAccessTime,
  MdShoppingCart,
  MdPayment,
  MdLocalShipping,
  MdInventory,
  MdStar,
  MdWarning,
  MdTrendingUp,
  MdRefresh,
  MdStore,
  MdSchedule,
  MdPerson,
  MdMessage,
  MdSettings,
  MdDiscount,
  MdBarChart,
  MdReport,
  MdSecurity,
  MdSystemUpdate,
  MdVerifiedUser,
  MdPriorityHigh,
  MdCampaign
} from "react-icons/md";

export default function ShopOwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Comprehensive system notifications for shop owner
  const systemNotifications = [
    // ORDER NOTIFICATIONS
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      description: "Customer Ahmed Ali placed an order #ORD-2024-00123 for $450.00",
      time: "2 minutes ago",
      icon: <MdShoppingCart className="text-blue-600" />,
      color: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      unread: true,
      priority: "high",
      archived: false,
      action: "view_order"
    },
    {
      id: 2,
      type: "order",
      title: "Order Processing",
      description: "Order #ORD-2024-00122 is being prepared for shipping",
      time: "1 hour ago",
      icon: <MdShoppingCart className="text-blue-500" />,
      color: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      unread: false,
      priority: "medium",
      archived: false,
      action: "track_order"
    },
    {
      id: 3,
      type: "order",
      title: "Order Cancelled",
      description: "Customer cancelled order #ORD-2024-00121",
      time: "3 hours ago",
      icon: <MdShoppingCart className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: false,
      priority: "high",
      archived: false,
      action: "review_cancellation"
    },

    // PAYMENT NOTIFICATIONS
    {
      id: 4,
      type: "payment",
      title: "Payment Successful",
      description: "Payment of $450.00 received for order #ORD-2024-00122",
      time: "5 hours ago",
      icon: <MdPayment className="text-green-600" />,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
      unread: true,
      priority: "high",
      archived: false,
      action: "view_payment"
    },
    {
      id: 5,
      type: "payment",
      title: "Payment Failed",
      description: "Payment attempt failed for order #ORD-2024-00120",
      time: "1 day ago",
      icon: <MdPayment className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: false,
      priority: "high",
      archived: false,
      action: "retry_payment"
    },
    {
      id: 6,
      type: "payment",
      title: "Refund Processed",
      description: "Refund of $120.00 issued to customer",
      time: "2 days ago",
      icon: <MdPayment className="text-amber-600" />,
      color: "from-amber-50 to-amber-100",
      border: "border-amber-200",
      unread: false,
      priority: "medium",
      archived: false,
      action: "view_refund"
    },

    // DELIVERY NOTIFICATIONS
    {
      id: 7,
      type: "delivery",
      title: "Out for Delivery",
      description: "Order #ORD-2024-00121 is out for delivery",
      time: "3 hours ago",
      icon: <MdLocalShipping className="text-orange-600" />,
      color: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      unread: false,
      priority: "medium",
      archived: false,
      action: "track_delivery"
    },
    {
      id: 8,
      type: "delivery",
      title: "Delivery Failed",
      description: "Delivery attempt failed for order #ORD-2024-00120",
      time: "2 days ago",
      icon: <MdLocalShipping className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: false,
      priority: "high",
      archived: false,
      action: "reschedule_delivery"
    },
    {
      id: 9,
      type: "delivery",
      title: "Delivery Successful",
      description: "Order #ORD-2024-00119 delivered successfully",
      time: "3 days ago",
      icon: <MdLocalShipping className="text-green-600" />,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "view_delivery"
    },

    // INVENTORY NOTIFICATIONS
    {
      id: 10,
      type: "inventory",
      title: "Low Stock Alert",
      description: "Product 'Samsung Galaxy S23' is running low (3 items left)",
      time: "1 day ago",
      icon: <MdInventory className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: true,
      priority: "high",
      archived: false,
      action: "restock_product"
    },
    {
      id: 11,
      type: "inventory",
      title: "Out of Stock",
      description: "Product 'iPhone 15 Pro' is now out of stock",
      time: "2 days ago",
      icon: <MdInventory className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: false,
      priority: "high",
      archived: false,
      action: "update_inventory"
    },
    {
      id: 12,
      type: "inventory",
      title: "Restock Complete",
      description: "Product 'AirPods Pro' has been restocked (50 units)",
      time: "3 days ago",
      icon: <MdInventory className="text-green-600" />,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "view_product"
    },

    // REVIEW & RATING NOTIFICATIONS
    {
      id: 13,
      type: "review",
      title: "New 5-Star Review",
      description: "Omar Said left a 5-star review for your store",
      time: "2 days ago",
      icon: <MdStar className="text-yellow-600" />,
      color: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "view_review"
    },
    {
      id: 14,
      type: "review",
      title: "New Customer Rating",
      description: "Fatima Hassan rated your store 4 stars",
      time: "3 days ago",
      icon: <MdStar className="text-yellow-500" />,
      color: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "view_rating"
    },

    // PLATFORM NOTIFICATIONS
    {
      id: 15,
      type: "platform",
      title: "System Maintenance",
      description: "Scheduled maintenance tonight at 2 AM (30 minutes downtime)",
      time: "1 day ago",
      icon: <MdSystemUpdate className="text-indigo-600" />,
      color: "from-indigo-50 to-indigo-100",
      border: "border-indigo-200",
      unread: true,
      priority: "medium",
      archived: false,
      action: "view_details"
    },
    {
      id: 16,
      type: "platform",
      title: "New Feature Available",
      description: "Advanced analytics dashboard now available",
      time: "3 days ago",
      icon: <MdTrendingUp className="text-purple-600" />,
      color: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "explore_feature"
    },

    // SECURITY NOTIFICATIONS
    {
      id: 17,
      type: "security",
      title: "Suspicious Login Attempt",
      description: "Unusual login attempt detected from new device",
      time: "5 hours ago",
      icon: <MdSecurity className="text-red-600" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      unread: true,
      priority: "high",
      archived: false,
      action: "review_security"
    },
    {
      id: 18,
      type: "security",
      title: "Password Changed",
      description: "Your account password was updated",
      time: "2 days ago",
      icon: <MdVerifiedUser className="text-green-600" />,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
      unread: false,
      priority: "medium",
      archived: false,
      action: "verify_account"
    },

    // PROMOTION NOTIFICATIONS
    {
      id: 19,
      type: "promotion",
      title: "Promotion Live",
      description: "Summer Sale promotion is now active",
      time: "1 day ago",
      icon: <MdCampaign className="text-pink-600" />,
      color: "from-pink-50 to-pink-100",
      border: "border-pink-200",
      unread: false,
      priority: "low",
      archived: false,
      action: "view_promotion"
    },
    {
      id: 20,
      type: "promotion",
      title: "Promotion Ending Soon",
      description: "Flash Sale ends in 24 hours",
      time: "2 days ago",
      icon: <MdCampaign className="text-orange-600" />,
      color: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      unread: false,
      priority: "medium",
      archived: false,
      action: "extend_promotion"
    },

    // REPORT NOTIFICATIONS
    {
      id: 21,
      type: "report",
      title: "Weekly Sales Report",
      description: "Your weekly sales report is ready to view",
      time: "1 day ago",
      icon: <MdBarChart className="text-teal-600" />,
      color: "from-teal-50 to-teal-100",
      border: "border-teal-200",
      unread: true,
      priority: "low",
      archived: false,
      action: "view_report"
    },
    {
      id: 22,
      type: "report",
      title: "Monthly Performance",
      description: "Store performance report for last month",
      time: "3 days ago",
      icon: <MdReport className="text-cyan-600" />,
      color: "from-cyan-50 to-cyan-100",
      border: "border-cyan-200",
      unread: false,
      priority: "low",
      archived: true,
      action: "view_report"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setNotifications(systemNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, archived: true } : notif
    ));
  };

  const unarchiveNotification = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, archived: false } : notif
    ));
  };

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    // Based on notification type, navigate to appropriate page
    switch(notification.action) {
      case 'view_order':
        window.location.href = '/shop/orders/new';
        break;
      case 'track_order':
        window.location.href = '/shop/delivery/status';
        break;
      case 'view_payment':
        window.location.href = '/shop/reports/sales';
        break;
      case 'restock_product':
        window.location.href = '/shop/products/inventory';
        break;
      case 'view_report':
        window.location.href = '/shop/reports/performance';
        break;
      default:
        // Default action: just mark as read
        break;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (showArchived && !notif.archived) return false;
    if (!showArchived && notif.archived) return false;
    if (filter !== "all" && notif.type !== filter) return false;
    if (unreadOnly && !notif.unread) return false;
    return true;
  });

  const getNotificationCount = (type) => {
    const activeNotifications = notifications.filter(n => !n.archived);
    if (type === "all") return activeNotifications.length;
    if (type === "unread") return activeNotifications.filter(n => n.unread).length;
    return activeNotifications.filter(n => n.type === type).length;
  };

  const notificationTypes = [
    { id: "all", label: "All", icon: <MdNotifications />, color: "bg-gray-500", count: getNotificationCount("all") },
    { id: "order", label: "Orders", icon: <MdShoppingCart />, color: "bg-blue-500", count: getNotificationCount("order") },
    { id: "payment", label: "Payments", icon: <MdPayment />, color: "bg-green-500", count: getNotificationCount("payment") },
    { id: "delivery", label: "Delivery", icon: <MdLocalShipping />, color: "bg-orange-500", count: getNotificationCount("delivery") },
    { id: "inventory", label: "Inventory", icon: <MdInventory />, color: "bg-red-500", count: getNotificationCount("inventory") },
    { id: "review", label: "Reviews", icon: <MdStar />, color: "bg-yellow-500", count: getNotificationCount("review") },
    { id: "platform", label: "Platform", icon: <MdSettings />, color: "bg-indigo-500", count: getNotificationCount("platform") },
    { id: "security", label: "Security", icon: <MdSecurity />, color: "bg-red-600", count: getNotificationCount("security") },
    { id: "promotion", label: "Promotions", icon: <MdCampaign />, color: "bg-pink-500", count: getNotificationCount("promotion") },
    { id: "report", label: "Reports", icon: <MdBarChart />, color: "bg-teal-500", count: getNotificationCount("report") }
  ];

  const unreadCount = getNotificationCount("unread");
  const archivedCount = notifications.filter(n => n.archived).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 pt-20">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <MdNotificationsActive className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  System Notifications
                </h1>
                <p className="text-white/90">
                  Stay informed about all store activities, orders, payments, and system updates
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${unreadCount === 0 ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'}`}
              >
                <MdMarkChatRead /> Mark All as Read
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
              >
                <MdArchive />
                {showArchived ? "Show Active" : "View Archived"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
              <span className="font-medium">{getNotificationCount("all")} Total</span>
            </div>
            <div className="px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full text-white">
              <span className="font-medium">{unreadCount} Unread</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-white">
              <span className="font-medium">{getNotificationCount("order")} Orders</span>
            </div>
            <div className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white">
              <span className="font-medium">{getNotificationCount("payment")} Payments</span>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-white">
              <span className="font-medium">{archivedCount} Archived</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MdFilterList className="text-gray-600 text-xl" />
            <span className="font-medium text-gray-700">Filter notifications:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {notificationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${filter === type.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
                {type.label}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${filter === type.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              />
              <span className="text-gray-700">Show unread only</span>
            </label>
            
            <button
              onClick={() => {
                setFilter("all");
                setUnreadOnly(false);
              }}
              className="px-4 py-2 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 hover:bg-emerald-50 rounded-lg"
            >
              <MdRefresh /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      ) : (
        <>
          {/* Notifications List */}
          <div className="space-y-4 mb-8">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
                <MdNotificationsOff className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  {showArchived ? "No Archived Notifications" : "All Caught Up!"}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {showArchived 
                    ? "You haven't archived any notifications yet." 
                    : "You're all caught up! New system notifications will appear here automatically."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-gradient-to-r ${notification.color} rounded-2xl p-6 shadow-xl border ${notification.border} transition-all hover:shadow-2xl cursor-pointer ${notification.unread ? 'ring-2 ring-emerald-500/20' : ''}`}
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-white/50 backdrop-blur-sm`}>
                        <div className="text-2xl">
                          {notification.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-800">{notification.title}</h3>
                          {notification.unread && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                              NEW
                            </span>
                          )}
                          {notification.priority === "high" && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                              <MdPriorityHigh /> URGENT
                            </span>
                          )}
                          {notification.archived && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                              ARCHIVED
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{notification.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <MdAccessTime />
                            {notification.time}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${notification.priority === 'high' ? 'bg-red-100 text-red-700' : notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {notification.priority} priority
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${notification.type === 'order' ? 'bg-blue-100 text-blue-700' : notification.type === 'payment' ? 'bg-green-100 text-green-700' : notification.type === 'delivery' ? 'bg-orange-100 text-orange-700' : notification.type === 'inventory' ? 'bg-red-100 text-red-700' : notification.type === 'review' ? 'bg-yellow-100 text-yellow-700' : notification.type === 'platform' ? 'bg-indigo-100 text-indigo-700' : notification.type === 'security' ? 'bg-red-100 text-red-700' : notification.type === 'promotion' ? 'bg-pink-100 text-pink-700' : 'bg-teal-100 text-teal-700'}`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {notification.unread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-2 text-emerald-600 hover:bg-white/50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <MdCheckCircle className="text-xl" />
                        </button>
                      )}
                      {notification.archived ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unarchiveNotification(notification.id);
                          }}
                          className="p-2 text-green-600 hover:bg-white/50 rounded-lg transition-colors"
                          title="Unarchive"
                        >
                          <MdArchive className="text-xl" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                          className="p-2 text-gray-500 hover:bg-white/50 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <MdArchive className="text-xl" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-2 text-red-500 hover:bg-white/50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Statistics */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Notification Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{unreadCount}</div>
                <div className="text-gray-700 font-medium">Unread</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{getNotificationCount("order")}</div>
                <div className="text-gray-700 font-medium">Order Alerts</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                <div className="text-3xl font-bold text-red-600 mb-2">{getNotificationCount("inventory") + getNotificationCount("security")}</div>
                <div className="text-gray-700 font-medium">Critical Alerts</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">{archivedCount}</div>
                <div className="text-gray-700 font-medium">Archived</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Notification Settings</h3>
                <p className="text-gray-600">
                  Configure how you receive notifications for different store activities
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all">
                  Sound Settings
                </button>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all">
                  Configure Alerts
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
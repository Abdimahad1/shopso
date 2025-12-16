// FULL UPDATED RESPONSIVE VERSION

import { useState, useEffect } from "react";
import {
  MdSearch,
  MdPerson,
  MdCalendarToday,
  MdChevronRight,
  MdShoppingCart,
  MdAttachMoney,
  MdAssignmentTurnedIn,
  MdCancel,
  MdHourglassTop,
  MdFiberNew,
  MdFilterList,
  MdToday,
  MdDateRange,
  MdArrowDropDown,
  MdRefresh,
  MdDownload,
  MdMoreVert,
  MdCheckCircle,
  MdPending,
  MdLocalShipping
} from "react-icons/md";

export default function OrdersNew() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const [dateFilter, setDateFilter] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [stats, setStats] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);

  // ===== ORDERS DATA (UNCHANGED) =====
  const ordersData = {
    new: [ /* ...same data... */ ],
    progress: [ /* ...same data... */ ],
    completed: [ /* ...same data... */ ],
    cancelled: [ /* ...same data... */ ],
  };

  // ===== CALCULATE STATISTICS =====
  useEffect(() => {
    const allOrders = Object.values(ordersData).flat();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrder = totalRevenue / allOrders.length;

    setStats({
      totalOrders: allOrders.length,
      totalRevenue,
      averageOrder,
      newOrders: ordersData.new.length,
      inProgress: ordersData.progress.length,
    });
  }, []);

  // ===== DATE FILTERING =====
  const filterByDate = (order) => {
    const orderDate = new Date(order.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (dateFilter) {
      case "today":
        return orderDate.toDateString() === today.toDateString();
      case "yesterday":
        return orderDate.toDateString() === yesterday.toDateString();
      case "last7":
        return orderDate >= last7Days;
      case "thisMonth":
        return orderDate >= thisMonth;
      case "custom":
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return orderDate >= start && orderDate <= end;
      default:
        return true;
    }
  };

  // ===== FILTER ORDERS =====
  const filteredOrders = ordersData[activeTab]
    .filter(order =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.city.toLowerCase().includes(search.toLowerCase())
    )
    .filter(filterByDate);

  // ===== ORDER CARD COMPONENT (UPDATED RESPONSIVE) =====
  const OrderCard = ({ order, type }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const statusColors = {
      new: "bg-blue-100 text-blue-800 border-blue-300",
      progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300"
    };

    const priorityColors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500"
    };

    const paymentColors = {
      Paid: "text-green-600",
      Pending: "text-yellow-600",
      Refunded: "text-red-600"
    };

    const handleSelect = () => {
      setIsSelected(!isSelected);
      if (!isSelected) {
        setSelectedOrders(prev => [...prev, order.id]);
      } else {
        setSelectedOrders(prev => prev.filter(id => id !== order.id));
      }
    };

    const getStatusIcon = () => {
      switch(type) {
        case "new": return <MdFiberNew className="text-blue-600 animate-pulse" />;
        case "progress": return <MdHourglassTop className="text-yellow-600 animate-spin" />;
        case "completed": return <MdCheckCircle className="text-green-600" />;
        case "cancelled": return <MdCancel className="text-red-600" />;
        default: return null;
      }
    };

    return (
      <div className={`bg-white rounded-xl shadow-lg p-5 border-2 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl 
        animate-slide-up max-w-full w-full
        ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
      `}>
        <div className="flex flex-col md:flex-row justify-between gap-4">

          {/* LEFT SECTION */}
          <div className="flex items-start space-x-4">
            <div 
              onClick={handleSelect}
              className={`w-6 h-6 mt-1 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">{order.id}</h2>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                  {getStatusIcon()} {order.status.toUpperCase()}
                </span>

                <div
                  className={`w-3 h-3 rounded-full ${priorityColors[order.priority]} animate-pulse`}
                  title={`${order.priority} priority`}
                />
              </div>

              <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <MdPerson className="text-purple-600" />
                {order.customer}
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {order.customerType}
                </span>
              </p>

              <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <MdCalendarToday className="text-indigo-600" />
                {order.date} • {order.time}
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded ml-2">
                  {order.city}
                </span>
              </p>

              {/* EXPANDED DETAILS */}
              {isExpanded && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-expand">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MdLocalShipping className="text-gray-500" />
                      Shipping: <strong>{order.shipping}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <MdAttachMoney className="text-gray-500" />
                      Payment: <strong className={paymentColors[order.payment]}>{order.payment}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="text-right">
            <p className="font-bold text-xl md:text-2xl text-blue-700 flex items-center justify-end gap-1">
              <MdAttachMoney className="text-blue-600" /> {order.total.toFixed(2)}
            </p>

            <p className="text-gray-500 flex items-center justify-end gap-1 mt-1 text-sm md:text-base">
              <MdShoppingCart className="text-orange-500" /> {order.items} items
            </p>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1">
                <MdMoreVert /> More
              </button>

              <button className={`px-4 py-2 text-white rounded-lg flex items-center gap-1 transition-all hover:scale-105 ${
                type === "new" ? "bg-blue-600" :
                type === "progress" ? "bg-green-600" :
                type === "cancelled" ? "bg-red-600" :
                "bg-gray-400"
              }`}>
                {type === "new" && "Start Processing"}
                {type === "progress" && "Mark Complete"}
                {type === "cancelled" && "View Details"}
                {type === "completed" && "Completed"}
                <MdChevronRight />
              </button>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-800 mt-2 transition"
            >
              <MdArrowDropDown className={`text-2xl transform transition ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===== STATS CARD =====
  const StatsCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${change > 0 ? "text-green-600" : "text-red-600"}`}>
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full text-white text-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // ===== MAIN UI =====
  return (
    <div className="w-full mx-auto px-4 py-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-800">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders easily</p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <MdDownload /> Export
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={<MdShoppingCart />} color="bg-blue-600" change={12} />
        <StatsCard title="Total Revenue" value={`$${stats.totalRevenue?.toFixed(2)}`} icon={<MdAttachMoney />} color="bg-green-600" change={18} />
        <StatsCard title="New Orders" value={stats.newOrders} icon={<MdFiberNew />} color="bg-purple-600" change={8} />
        <StatsCard title="In Progress" value={stats.inProgress} icon={<MdHourglassTop />} color="bg-yellow-600" change={-3} />
      </div>

      {/* ===== MAIN CONTENT CARD ===== */}
      <div className="bg-white rounded-2xl shadow-xl p-6">

        {/* TAB SWITCHER */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
          {[
            { id: "new", label: "New Orders", icon: <MdFiberNew />, count: ordersData.new.length },
            { id: "progress", label: "In Progress", icon: <MdHourglassTop />, count: ordersData.progress.length },
            { id: "completed", label: "Completed", icon: <MdCheckCircle />, count: ordersData.completed.length },
            { id: "cancelled", label: "Cancelled", icon: <MdCancel />, count: ordersData.cancelled.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? "bg-white/20" : "bg-gray-400 text-white"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* FILTERS SECTION */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

          {/* SEARCH BAR */}
          <div className="relative flex-1 min-w-[240px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search orders, customers, cities..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* DATE FILTER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-3 border rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-2"
            >
              <MdFilterList className="text-gray-600" />
              {dateFilter === "all" && "All Dates"}
              {dateFilter === "today" && "Today"}
              {dateFilter === "yesterday" && "Yesterday"}
              {dateFilter === "last7" && "Last 7 Days"}
              {dateFilter === "thisMonth" && "This Month"}
              {dateFilter === "custom" && "Custom Range"}
              <MdArrowDropDown />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl p-4 z-20 animate-dropdown">
                {/* Options */}
                {["all", "today", "yesterday", "last7", "thisMonth", "custom"].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setDateFilter(option);
                      if (option !== "custom") setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 ${
                      dateFilter === option ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}

                {/* Custom Date Fields */}
                {dateFilter === "custom" && (
                  <div className="mt-3 border-t pt-3">
                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                      value={customStartDate}
                      onChange={e => setCustomStartDate(e.target.value)}
                    />

                    <label className="block text-sm text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                    />

                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectedOrders.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="text-blue-700 font-semibold">
              {selectedOrders.length} selected
            </span>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-blue-300 rounded-lg">
                Bulk Update
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* RESULTS COUNTER */}
        <p className="text-sm text-gray-600 mb-4">
          Showing <span className="font-bold text-blue-700">{filteredOrders.length}</span> of {ordersData[activeTab].length} orders
        </p>

        {/* ORDER LIST */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} type={activeTab} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-400">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes dropdown {
          from { opacity:0; transform: translateY(-10px) scale(0.95); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
        @keyframes slide-up {
          from { opacity:0; transform: translateY(20px); }
          to { opacity:1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCalendarToday,
  MdShoppingCart,
  MdAttachMoney,
  MdPerson,
  MdLocationOn,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdDownload,
  MdArrowUpward,
  MdArrowDownward,
  MdOutlineReceipt,
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdStar,
  MdTrendingUp,
  MdTrendingDown,
  MdInfo,
  MdPrint,
  MdShare,
  MdVisibility
} from "react-icons/md";

export default function OrderHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Mock Orders Data
  const initialOrders = [
    {
      id: "ORD-1001",
      customer: "Ahmed Mohamed",
      customerId: "CUST-1001",
      date: "2025-02-01",
      time: "10:30 AM",
      items: 3,
      total: 49.99,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Credit Card",
      shipping: "Express",
      shippingAddress: "Maka Al-Mukarama Rd, Mogadishu",
      deliveryTime: "35 min",
      rating: 4.8,
      notes: "Fragile items handled well",
      itemsList: [
        { name: "Organic Coffee (500g)", quantity: 1, price: 12.99 },
        { name: "Spices Pack", quantity: 1, price: 8.50 },
        { name: "Traditional Shawl", quantity: 1, price: 28.50 }
      ]
    },
    {
      id: "ORD-1002",
      customer: "Fatima Ali",
      customerId: "CUST-1002",
      date: "2025-02-02",
      time: "02:15 PM",
      items: 5,
      total: 89.50,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Mobile Money",
      shipping: "Standard",
      shippingAddress: "Hodan District, Mogadishu",
      deliveryTime: "45 min",
      rating: 4.6,
      notes: "Customer requested morning delivery",
      itemsList: [
        { name: "Fresh Fruits Basket", quantity: 1, price: 25.00 },
        { name: "Organic Honey (1kg)", quantity: 1, price: 15.50 },
        { name: "Spices Pack", quantity: 2, price: 17.00 },
        { name: "Coffee Beans (250g)", quantity: 1, price: 9.00 },
        { name: "Tea Leaves", quantity: 1, price: 8.00 }
      ]
    },
    {
      id: "ORD-1003",
      customer: "Omar Hassan",
      customerId: "CUST-1003",
      date: "2025-01-30",
      time: "09:45 AM",
      items: 2,
      total: 29.99,
      status: "cancelled",
      payment: "Refunded",
      paymentMethod: "Credit Card",
      shipping: "Express",
      shippingAddress: "Waberi, Mogadishu",
      deliveryTime: null,
      rating: null,
      notes: "Cancelled by customer",
      itemsList: [
        { name: "Coffee Maker", quantity: 1, price: 24.99 },
        { name: "Coffee Filters", quantity: 1, price: 5.00 }
      ]
    },
    {
      id: "ORD-1004",
      customer: "Aisha Abdi",
      customerId: "CUST-1004",
      date: "2025-01-29",
      time: "03:30 PM",
      items: 8,
      total: 120.75,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Bank Transfer",
      shipping: "Standard",
      shippingAddress: "Shangani, Mogadishu",
      deliveryTime: "50 min",
      rating: 4.9,
      notes: "Bulk order, VIP customer",
      itemsList: [
        { name: "Office Supplies Pack", quantity: 1, price: 45.00 },
        { name: "Stationery Set", quantity: 2, price: 30.00 },
        { name: "Notebooks", quantity: 3, price: 12.00 },
        { name: "Pens (Box)", quantity: 1, price: 8.75 },
        { name: "Desk Organizer", quantity: 1, price: 25.00 }
      ]
    },
    {
      id: "ORD-1005",
      customer: "Yusuf Ali",
      customerId: "CUST-1005",
      date: "2025-01-28",
      time: "11:20 AM",
      items: 4,
      total: 65.25,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Cash on Delivery",
      shipping: "Express",
      shippingAddress: "Baidoa, Somalia",
      deliveryTime: "40 min",
      rating: 4.5,
      notes: "COD successful",
      itemsList: [
        { name: "Electronics Kit", quantity: 1, price: 45.25 },
        { name: "Batteries (Pack)", quantity: 1, price: 8.00 },
        { name: "Charging Cable", quantity: 2, price: 12.00 }
      ]
    },
    {
      id: "ORD-1006",
      customer: "Halima Mohamed",
      customerId: "CUST-1006",
      date: "2025-01-25",
      time: "04:45 PM",
      items: 6,
      total: 95.80,
      status: "returned",
      payment: "Refunded",
      paymentMethod: "Credit Card",
      shipping: "Standard",
      shippingAddress: "Mogadishu, Somalia",
      deliveryTime: "55 min",
      rating: 3.5,
      notes: "Item damaged, returned for refund",
      itemsList: [
        { name: "Home Decor Set", quantity: 1, price: 60.00 },
        { name: "Cushion Covers", quantity: 2, price: 20.00 },
        { name: "Table Runner", quantity: 1, price: 8.80 },
        { name: "Curtains", quantity: 1, price: 7.00 }
      ]
    },
    {
      id: "ORD-1007",
      customer: "Jamal Abdullahi",
      customerId: "CUST-1007",
      date: "2025-01-20",
      time: "01:15 PM",
      items: 7,
      total: 112.30,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Mobile Money",
      shipping: "Express",
      shippingAddress: "Hargeisa, Somalia",
      deliveryTime: "38 min",
      rating: 4.7,
      notes: "Corporate order",
      itemsList: [
        { name: "Office Chairs", quantity: 2, price: 80.00 },
        { name: "Desk Lamps", quantity: 2, price: 20.00 },
        { name: "File Organizers", quantity: 2, price: 8.00 },
        { name: "Whiteboard", quantity: 1, price: 4.30 }
      ]
    },
    {
      id: "ORD-1008",
      customer: "Nasra Omar",
      customerId: "CUST-1008",
      date: "2025-01-18",
      time: "10:00 AM",
      items: 3,
      total: 42.50,
      status: "delivered",
      payment: "Paid",
      paymentMethod: "Credit Card",
      shipping: "Standard",
      shippingAddress: "Mogadishu, Somalia",
      deliveryTime: "42 min",
      rating: 4.9,
      notes: "Regular customer, satisfied",
      itemsList: [
        { name: "Books Collection", quantity: 1, price: 25.00 },
        { name: "Bookmarks Set", quantity: 1, price: 5.50 },
        { name: "Reading Light", quantity: 1, price: 12.00 }
      ]
    }
  ];

  useEffect(() => {
    setOrders(initialOrders);
    
    // Calculate stats
    const totalOrders = initialOrders.length;
    const deliveredOrders = initialOrders.filter(o => o.status === "delivered").length;
    const totalRevenue = initialOrders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / deliveredOrders;
    const avgRating = initialOrders.filter(o => o.rating).reduce((sum, o) => sum + o.rating, 0) / 
                     initialOrders.filter(o => o.rating).length;
    
    setStats({
      totalOrders,
      deliveredOrders,
      cancelledOrders: initialOrders.filter(o => o.status === "cancelled").length,
      returnedOrders: initialOrders.filter(o => o.status === "returned").length,
      totalRevenue,
      avgOrderValue: avgOrderValue.toFixed(2),
      avgRating: avgRating.toFixed(1),
      successRate: ((deliveredOrders / totalOrders) * 100).toFixed(1)
    });
  }, []);

  // Filter orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.customerId.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      // Date filtering
      const orderDate = new Date(order.date);
      let matchesDate = true;
      
      if (dateFilter === "today") {
        const today = new Date();
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === "last7") {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        matchesDate = orderDate >= last7Days;
      } else if (dateFilter === "thisMonth") {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        matchesDate = orderDate >= thisMonth;
      } else if (dateFilter === "custom") {
        if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          matchesDate = orderDate >= start && orderDate <= end;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc" 
          ? new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
          : new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
      }
      if (sortBy === "total") {
        return sortOrder === "desc" ? b.total - a.total : a.total - b.total;
      }
      return 0;
    });

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "returned": return "bg-orange-100 text-orange-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "delivered": return <MdCheckCircle className="text-green-600" />;
      case "cancelled": return <MdCancel className="text-red-600" />;
      case "returned": return <MdOutlineReceipt className="text-orange-600" />;
      default: return <MdInfo className="text-gray-600" />;
    }
  };

  // Get payment color
  const getPaymentColor = (payment) => {
    switch(payment) {
      case "Paid": return "text-green-600";
      case "Pending": return "text-yellow-600";
      case "Refunded": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Export orders
  const handleExport = () => {
    // In a real app, this would generate a CSV/Excel file
    alert("Export functionality would generate a CSV file");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 to-orange-900 bg-clip-text text-transparent">
              Order History
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              View and analyze all past orders and transactions
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <MdDownload /> Export History
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2">
              <MdRefresh /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { 
              label: "Total Orders", 
              value: stats.totalOrders || 0, 
              icon: <MdShoppingCart className="text-2xl" />,
              color: "from-blue-500 to-blue-600",
              trend: "+15%"
            },
            { 
              label: "Total Revenue", 
              value: formatCurrency(stats.totalRevenue || 0), 
              icon: <MdAttachMoney className="text-2xl" />,
              color: "from-green-500 to-green-600",
              trend: "+22%"
            },
            { 
              label: "Success Rate", 
              value: `${stats.successRate || "0.0"}%`, 
              icon: <MdCheckCircle className="text-2xl" />,
              color: "from-orange-500 to-orange-600",
              trend: "+3.2%"
            },
            { 
              label: "Avg Rating", 
              value: `${stats.avgRating || "0.0"}/5`, 
              icon: <MdStar className="text-2xl" />,
              color: "from-purple-500 to-purple-600",
              trend: "+0.4"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {stat.trend.startsWith('+') ? <MdTrendingUp className="inline text-green-600" /> : <MdTrendingDown className="inline text-red-600" />}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSearch className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer, or customer ID..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border rounded-xl bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <MdFilterList />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl animate-expand">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="all">All Status</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="last7">Last 7 Days</option>
                      <option value="thisMonth">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="date">Date</option>
                        <option value="total">Total Amount</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50"
                      >
                        {sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />}
                      </button>
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  {dateFilter === "custom" && (
                    <div className="md:col-span-3 grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Orders Grid */}
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  className={`bg-gradient-to-br from-white to-gray-50 border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.01] animate-fade-in-delay ${
                    selectedOrder?.id === order.id ? "ring-2 ring-orange-500" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-800">{order.id}</h3>
                            <span className="text-sm text-gray-500">({order.customerId})</span>
                          </div>
                          <p className="text-gray-600">{order.customer}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdCalendarToday className="text-blue-600 flex-shrink-0" />
                            <span>{order.date} • {order.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdShoppingCart className="text-orange-600 flex-shrink-0" />
                            <span>{order.items} items</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdOutlinePayment className={`flex-shrink-0 ${getPaymentColor(order.payment)}`} />
                            <span className={getPaymentColor(order.payment)}>{order.payment}</span>
                            <span className="text-gray-500">({order.paymentMethod})</span>
                          </div>
                          {order.deliveryTime && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MdOutlineLocalShipping className="text-green-600 flex-shrink-0" />
                              <span>Delivery: {order.deliveryTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="font-bold text-2xl text-orange-700">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {order.rating && (
                          <div className="flex items-center gap-1">
                            <MdStar className="text-yellow-500" />
                            <span className="font-semibold">{order.rating}</span>
                          </div>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <MdOutlineReceipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No orders found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-6 border-t">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredOrders.length}</span> of {orders.length} orders
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-2 border rounded-lg bg-orange-600 text-white hover:bg-orange-700">
                  1
                </button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Details & Analytics */}
        <div className="space-y-6">
          {/* Selected Order Details */}
          {selectedOrder ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedOrder.id}</h3>
                    <p className="text-gray-600">Customer: {selectedOrder.customer}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium">{selectedOrder.date} • {selectedOrder.time}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-green-700">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium">{selectedOrder.items} items</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600">Delivery Time</p>
                    <p className="font-medium">{selectedOrder.deliveryTime || "N/A"}</p>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Payment & Shipping</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className={`font-medium ${getPaymentColor(selectedOrder.payment)}`}>
                        {selectedOrder.payment}
                      </p>
                      <p className="text-sm text-gray-500">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Shipping</p>
                      <p className="font-medium">{selectedOrder.shipping}</p>
                      <p className="text-sm text-gray-500 truncate">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.itemsList.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Rating */}
                {selectedOrder.rating && (
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Customer Rating</h3>
                        <p className="text-sm text-gray-600">Feedback provided</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdStar className="text-yellow-500 text-2xl" />
                        <span className="text-2xl font-bold">{selectedOrder.rating}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <MdPrint /> Print
                  </button>
                  <button className="py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <MdShare /> Share
                  </button>
                  <button className="py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2">
                    <MdVisibility /> View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="text-center py-8">
                <MdOutlineReceipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Select an Order</h3>
                <p className="text-gray-600">
                  Click on any order to view detailed information and items
                </p>
              </div>
            </div>
          )}

          {/* Order Analytics */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Order Analytics</h3>
            <div className="space-y-4">
              {[
                { label: "Delivered Orders", value: stats.deliveredOrders || 0, color: "bg-green-500" },
                { label: "Cancelled Orders", value: stats.cancelledOrders || 0, color: "bg-red-500" },
                { label: "Returned Orders", value: stats.returnedOrders || 0, color: "bg-orange-500" },
                { label: "Avg Order Value", value: formatCurrency(stats.avgOrderValue || 0), color: "bg-blue-500" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{stat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{stat.value}</span>
                    <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { time: "2 hours ago", activity: "Order ORD-1009 placed", color: "bg-blue-100" },
                { time: "4 hours ago", activity: "Order ORD-1008 delivered", color: "bg-green-100" },
                { time: "1 day ago", activity: "Customer CUST-1007 updated", color: "bg-purple-100" },
                { time: "2 days ago", activity: "Monthly report generated", color: "bg-orange-100" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[1]}`} />
                  <div>
                    <p className="text-sm text-gray-800">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 300px; }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-expand { animation: expand 0.3s ease-out; }
      `}</style>
    </div>
  );
}
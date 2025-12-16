import { useState, useEffect } from "react";
import {
  MdSearch,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDateRange,
  MdStar,
  MdShoppingCart,
  MdAttachMoney,
  MdFilterList,
  MdDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdOutlineCalendarToday,
  MdVerified,
  MdBlock,
  MdArrowUpward,
  MdArrowDownward,
  MdInfo,
  MdVisibility
} from "react-icons/md";

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});

  // Mock Customers Data
  const initialCustomers = [
    {
      id: "CUST-1001",
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "+252 61 123 4567",
      location: "Mogadishu, Somalia",
      joinDate: "2024-01-15",
      lastOrder: "2025-02-01",
      totalOrders: 12,
      totalSpent: 1250.75,
      avgOrder: 104.23,
      status: "active",
      tier: "VIP",
      satisfaction: 4.8,
      notes: "Regular customer, prefers express delivery"
    },
    {
      id: "CUST-1002",
      name: "Fatima Ali",
      email: "fatima@example.com",
      phone: "+252 61 987 6543",
      location: "Hargeisa, Somalia",
      joinDate: "2024-02-20",
      lastOrder: "2025-02-02",
      totalOrders: 8,
      totalSpent: 890.50,
      avgOrder: 111.31,
      status: "active",
      tier: "Premium",
      satisfaction: 4.6,
      notes: "Likes organic products"
    },
    {
      id: "CUST-1003",
      name: "Omar Hassan",
      email: "omar@example.com",
      phone: "+252 61 555 1234",
      location: "Kismayo, Somalia",
      joinDate: "2024-03-10",
      lastOrder: "2025-01-30",
      totalOrders: 5,
      totalSpent: 450.25,
      avgOrder: 90.05,
      status: "active",
      tier: "Regular",
      satisfaction: 4.4,
      notes: "New customer, needs follow-up"
    },
    {
      id: "CUST-1004",
      name: "Aisha Abdi",
      email: "aisha@example.com",
      phone: "+252 61 777 8888",
      location: "Bosaso, Somalia",
      joinDate: "2023-12-05",
      lastOrder: "2025-01-25",
      totalOrders: 25,
      totalSpent: 3250.00,
      avgOrder: 130.00,
      status: "inactive",
      tier: "VIP",
      satisfaction: 4.9,
      notes: "Top customer, occasional bulk orders"
    },
    {
      id: "CUST-1005",
      name: "Yusuf Ali",
      email: "yusuf@example.com",
      phone: "+252 61 999 1111",
      location: "Baidoa, Somalia",
      joinDate: "2024-04-15",
      lastOrder: "2025-01-20",
      totalOrders: 3,
      totalSpent: 180.75,
      avgOrder: 60.25,
      status: "active",
      tier: "New",
      satisfaction: 4.2,
      notes: "Recently signed up"
    },
    {
      id: "CUST-1006",
      name: "Halima Mohamed",
      email: "halima@example.com",
      phone: "+252 61 222 3333",
      location: "Mogadishu, Somalia",
      joinDate: "2023-11-30",
      lastOrder: "2025-01-15",
      totalOrders: 18,
      totalSpent: 2100.50,
      avgOrder: 116.69,
      status: "blocked",
      tier: "Premium",
      satisfaction: 3.8,
      notes: "Payment issues, temporarily blocked"
    },
    {
      id: "CUST-1007",
      name: "Jamal Abdullahi",
      email: "jamal@example.com",
      phone: "+252 61 444 5555",
      location: "Hargeisa, Somalia",
      joinDate: "2024-05-22",
      lastOrder: "2025-02-03",
      totalOrders: 7,
      totalSpent: 625.30,
      avgOrder: 89.33,
      status: "active",
      tier: "Regular",
      satisfaction: 4.7,
      notes: "Corporate customer"
    },
    {
      id: "CUST-1008",
      name: "Nasra Omar",
      email: "nasra@example.com",
      phone: "+252 61 666 7777",
      location: "Mogadishu, Somalia",
      joinDate: "2024-01-08",
      lastOrder: "2025-01-28",
      totalOrders: 15,
      totalSpent: 1895.00,
      avgOrder: 126.33,
      status: "active",
      tier: "VIP",
      satisfaction: 4.9,
      notes: "Loyal customer, refers others"
    },
    {
      id: "CUST-1009",
      name: "Hassan Warsame",
      email: "hassan@example.com",
      phone: "+252 61 888 9999",
      location: "Garowe, Somalia",
      joinDate: "2024-06-10",
      lastOrder: "2025-01-10",
      totalOrders: 6,
      totalSpent: 720.40,
      avgOrder: 120.07,
      status: "active",
      tier: "Regular",
      satisfaction: 4.3,
      notes: "Consistent customer, pays on time"
    },
    {
      id: "CUST-1010",
      name: "Fadumo Ahmed",
      email: "fadumo@example.com",
      phone: "+252 61 101 2020",
      location: "Mogadishu, Somalia",
      joinDate: "2024-07-15",
      lastOrder: "2025-02-05",
      totalOrders: 4,
      totalSpent: 320.80,
      avgOrder: 80.20,
      status: "active",
      tier: "New",
      satisfaction: 4.5,
      notes: "New customer, prefers cash payments"
    },
    {
      id: "CUST-1011",
      name: "Abdirahman Ali",
      email: "abdirahman@example.com",
      phone: "+252 61 303 4040",
      location: "Kismayo, Somalia",
      joinDate: "2024-08-05",
      lastOrder: "2025-01-28",
      totalOrders: 9,
      totalSpent: 980.20,
      avgOrder: 108.91,
      status: "active",
      tier: "Premium",
      satisfaction: 4.7,
      notes: "Frequent buyer, prefers digital payment"
    },
    {
      id: "CUST-1012",
      name: "Maryan Abdi",
      email: "maryan@example.com",
      phone: "+252 61 505 6060",
      location: "Bosaso, Somalia",
      joinDate: "2024-03-22",
      lastOrder: "2025-01-18",
      totalOrders: 14,
      totalSpent: 1560.90,
      avgOrder: 111.49,
      status: "inactive",
      tier: "Regular",
      satisfaction: 4.4,
      notes: "Inactive for 30+ days"
    }
  ];

  useEffect(() => {
    setCustomers(initialCustomers);
    
    // Calculate comprehensive stats
    const totalCustomers = initialCustomers.length;
    const activeCustomers = initialCustomers.filter(c => c.status === "active").length;
    const totalRevenue = initialCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSatisfaction = initialCustomers.reduce((sum, c) => sum + c.satisfaction, 0) / totalCustomers;
    const totalOrders = initialCustomers.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    setStats({
      totalCustomers,
      activeCustomers,
      inactiveCustomers: initialCustomers.filter(c => c.status === "inactive").length,
      blockedCustomers: initialCustomers.filter(c => c.status === "blocked").length,
      totalRevenue,
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      avgSatisfaction: avgSatisfaction.toFixed(1),
      vipCustomers: initialCustomers.filter(c => c.tier === "VIP").length,
      premiumCustomers: initialCustomers.filter(c => c.tier === "Premium").length,
      newCustomers: initialCustomers.filter(c => c.tier === "New").length,
      regularCustomers: initialCustomers.filter(c => c.tier === "Regular").length
    });
  }, []);

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.id.toLowerCase().includes(search.toLowerCase()) ||
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      const matchesTier = tierFilter === "all" || customer.tier === tierFilter;
      
      return matchesSearch && matchesStatus && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return sortOrder === "desc" 
          ? new Date(b.joinDate) - new Date(a.joinDate)
          : new Date(a.joinDate) - new Date(b.joinDate);
      }
      if (sortBy === "spent") {
        return sortOrder === "desc" ? b.totalSpent - a.totalSpent : a.totalSpent - b.totalSpent;
      }
      if (sortBy === "orders") {
        return sortOrder === "desc" ? b.totalOrders - a.totalOrders : a.totalOrders - b.totalOrders;
      }
      if (sortBy === "rating") {
        return sortOrder === "desc" ? b.satisfaction - a.satisfaction : a.satisfaction - b.satisfaction;
      }
      return 0;
    });

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get tier color - Concise labels
  const getTierColor = (tier) => {
    switch(tier) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Premium": return "bg-blue-100 text-blue-800";
      case "Regular": return "bg-green-100 text-green-800";
      case "New": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "active": return <MdVerified className="text-green-600" size={14} />;
      case "inactive": return <MdOutlineCalendarToday className="text-yellow-600" size={14} />;
      case "blocked": return <MdBlock className="text-red-600" size={14} />;
      default: return null;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get customer value badge - Concise labels
  const getValueBadge = (totalSpent) => {
    if (totalSpent > 2000) return { label: "High", color: "bg-purple-500" };
    if (totalSpent > 1000) return { label: "Mid", color: "bg-blue-500" };
    if (totalSpent > 500) return { label: "Reg", color: "bg-green-500" };
    return { label: "New", color: "bg-yellow-500" };
  };

  // Get tier abbreviation
  const getTierAbbr = (tier) => {
    switch(tier) {
      case "VIP": return "VIP";
      case "Premium": return "Prem";
      case "Regular": return "Reg";
      case "New": return "New";
      default: return tier;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Customer Database
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              View and analyze customer information and purchase history
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <MdDownload /> Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { 
              label: "Total Customers", 
              value: stats.totalCustomers, 
              icon: <MdPerson className="text-2xl" />,
              color: "from-blue-500 to-blue-600",
              trend: "+12%"
            },
            { 
              label: "Active Customers", 
              value: stats.activeCustomers, 
              icon: <MdVerified className="text-2xl" />,
              color: "from-green-500 to-green-600",
              trend: "+8%"
            },
            { 
              label: "Total Revenue", 
              value: formatCurrency(stats.totalRevenue || 0), 
              icon: <MdAttachMoney className="text-2xl" />,
              color: "from-purple-500 to-purple-600",
              trend: "+18%"
            },
            { 
              label: "Avg Satisfaction", 
              value: `${stats.avgSatisfaction || "0.0"}/5`, 
              icon: <MdStar className="text-2xl" />,
              color: "from-orange-500 to-orange-600",
              trend: "+0.3"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
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
        {/* Left Column - Customers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers by name, email, or location..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none appearance-none pr-8 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <MdFilterList className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />
                </div>

                {/* Tier Filter */}
                <div className="relative">
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none appearance-none pr-8 text-sm"
                  >
                    <option value="all">All Tiers</option>
                    <option value="VIP">VIP</option>
                    <option value="Premium">Premium</option>
                    <option value="Regular">Regular</option>
                    <option value="New">New</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="relative flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none appearance-none pr-8 text-sm"
                  >
                    <option value="recent">Recent</option>
                    <option value="spent">Total Spent</option>
                    <option value="orders">Total Orders</option>
                    <option value="rating">Rating</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="ml-1 p-1.5 text-gray-500 hover:text-gray-700"
                  >
                    {sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />}
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table - Read Only */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Customer</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Contact</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Orders</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Spent</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Value</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`border-b hover:bg-gray-50 transition-colors animate-fade-in-delay cursor-pointer ${
                        selectedCustomer?.id === customer.id ? "bg-purple-50" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-semibold text-gray-800 text-sm truncate max-w-[120px]" title={customer.name}>
                                {customer.name}
                              </p>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${getTierColor(customer.tier)} flex-shrink-0`}>
                                {getTierAbbr(customer.tier)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate" title={`ID: ${customer.id}`}>
                              ID: {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-0.5">
                          <p className="text-gray-700 text-sm truncate max-w-[150px]" title={customer.email}>
                            <MdEmail className="inline text-blue-600 mr-1" size={14} /> 
                            {customer.email}
                          </p>
                          <p className="text-gray-600 text-xs truncate max-w-[150px]" title={customer.phone}>
                            <MdPhone className="inline text-green-600 mr-1" size={14} /> 
                            {customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{customer.totalOrders}</p>
                          <p className="text-gray-600 text-xs flex items-center gap-0.5">
                            <MdOutlineCalendarToday size={12} /> 
                            {customer.lastOrder || "Never"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{formatCurrency(customer.totalSpent)}</p>
                          <p className="text-gray-600 text-xs">Avg: {formatCurrency(customer.avgOrder)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${getValueBadge(customer.totalSpent).color} text-white`}>
                            {getValueBadge(customer.totalSpent).label}
                          </span>
                          <div className="flex items-center gap-0.5 mt-1">
                            <MdStar className="text-yellow-500" size={12} />
                            <span className="text-xs font-medium">{customer.satisfaction}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-0.5 ${getStatusColor(customer.status)}`}>
                            {getStatusIcon(customer.status)} 
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </span>
                          <p className="text-gray-600 text-xs truncate max-w-[100px]" title={customer.location}>
                            <MdLocationOn className="inline text-gray-400 mr-0.5" size={12} />
                            {customer.location.split(',')[0]}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <MdPerson className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No customers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{filteredCustomers.length}</span> of {customers.length} customers
              </p>
              <div className="flex gap-1">
                <button className="px-2 py-1.5 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  ← Prev
                </button>
                <button className="px-2 py-1.5 border rounded text-sm bg-purple-600 text-white hover:bg-purple-700">
                  1
                </button>
                <button className="px-2 py-1.5 border rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-2 py-1.5 border rounded text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-2 py-1.5 border rounded text-sm hover:bg-gray-50">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Details */}
        <div className="space-y-6">
          {/* Selected Customer Details - Read Only */}
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedCustomer.status)}`}>
                        {selectedCustomer.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTierColor(selectedCustomer.tier)}`}>
                        {selectedCustomer.tier}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <MdStar size={12} /> {selectedCustomer.satisfaction}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MdEmail className="text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium break-all">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MdPhone className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MdLocationOn className="text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{selectedCustomer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MdDateRange className="text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">{selectedCustomer.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-blue-700">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Avg Order</p>
                    <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedCustomer.avgOrder)}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Last Order</p>
                    <p className="text-xl font-bold text-yellow-700">{selectedCustomer.lastOrder || "Never"}</p>
                  </div>
                </div>

                {/* Customer Value */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Value</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Value Tier</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getValueBadge(selectedCustomer.totalSpent).color} text-white mt-1 inline-block`}>
                        {getValueBadge(selectedCustomer.totalSpent).label} Value
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Customer Rating</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MdStar className="text-yellow-500" />
                        <span className="font-bold">{selectedCustomer.satisfaction}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedCustomer.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MdInfo className="text-yellow-600" />
                      <h3 className="font-semibold text-gray-800">Notes</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{selectedCustomer.notes}</p>
                  </div>
                )}

                {/* View Button Only */}
                <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                  <MdVisibility /> View Full Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="text-center py-8">
                <MdPerson className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Customer</h3>
                <p className="text-gray-600">
                  Click on any customer to view detailed information
                </p>
              </div>
            </div>
          )}

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Customer Segments</h3>
            <div className="space-y-4">
              {[
                { label: "VIP Customers", value: stats.vipCustomers || 0, color: "bg-purple-500", icon: <MdStar className="text-purple-600" /> },
                { label: "Premium", value: stats.premiumCustomers || 0, color: "bg-blue-500", icon: <MdVerified className="text-blue-600" /> },
                { label: "Regular", value: stats.regularCustomers || 0, color: "bg-green-500", icon: <MdPerson className="text-green-600" /> },
                { label: "New Customers", value: stats.newCustomers || 0, color: "bg-yellow-500", icon: <MdOutlineCalendarToday className="text-yellow-600" /> }
              ].map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {segment.icon}
                    <span className="text-gray-700">{segment.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{segment.value}</span>
                    <div className={`w-2 h-2 rounded-full ${segment.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Avg Order Value</span>
                <span className="font-bold text-blue-700">{formatCurrency(stats.avgOrderValue || 0)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Total Orders</span>
                <span className="font-bold text-green-700">{stats.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Blocked Customers</span>
                <span className="font-bold text-red-700">{stats.blockedCustomers || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Inactive (30+ days)</span>
                <span className="font-bold text-purple-700">{stats.inactiveCustomers || 0}</span>
              </div>
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
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        
        /* Custom scrollbar for table */
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        
        /* Table styles */
        table {
          border-collapse: separate;
          border-spacing: 0;
          min-width: 800px;
        }
        th {
          background-color: #f9fafb;
          white-space: nowrap;
        }
        tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
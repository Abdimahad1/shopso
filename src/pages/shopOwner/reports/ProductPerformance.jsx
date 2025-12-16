import { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdTrendingUp,
  MdTrendingDown,
  MdShoppingCart,
  MdAttachMoney,
  MdStar,
  MdBarChart,
  MdPieChart,
  MdDownload,
  MdRefresh,
  MdCalendarToday,
  MdArrowUpward,
  MdArrowDownward,
  MdInfo,
  MdVisibility,
  MdOutlineInventory,
  MdOutlineCategory,
  MdOutlineLocalOffer,
  MdOutlineSpeed
} from "react-icons/md";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ProductPerformance() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [sortBy, setSortBy] = useState("revenue");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Mock Products Data
  const initialProducts = [
    {
      id: "PROD-1001",
      name: "Organic Coffee Beans",
      category: "Beverages",
      sku: "CB-ORG-500",
      price: 12.99,
      cost: 8.50,
      stock: 145,
      sold: 320,
      revenue: 4156.80,
      profit: 1436.80,
      rating: 4.8,
      reviews: 45,
      trend: "up",
      growth: 15,
      lastRestock: "2025-01-25"
    },
    {
      id: "PROD-1002",
      name: "Spices Collection Pack",
      category: "Food",
      sku: "SP-COL-250",
      price: 8.50,
      cost: 5.20,
      stock: 89,
      sold: 185,
      revenue: 1572.50,
      profit: 610.50,
      rating: 4.6,
      reviews: 32,
      trend: "up",
      growth: 8,
      lastRestock: "2025-02-01"
    },
    {
      id: "PROD-1003",
      name: "Traditional Shawl",
      category: "Clothing",
      sku: "CL-SHA-001",
      price: 28.50,
      cost: 18.00,
      stock: 42,
      sold: 78,
      revenue: 2223.00,
      profit: 819.00,
      rating: 4.9,
      reviews: 28,
      trend: "up",
      growth: 22,
      lastRestock: "2025-01-15"
    },
    {
      id: "PROD-1004",
      name: "Coffee Maker",
      category: "Electronics",
      sku: "EL-CM-500",
      price: 49.99,
      cost: 32.00,
      stock: 23,
      sold: 65,
      revenue: 3249.35,
      profit: 1169.35,
      rating: 4.4,
      reviews: 18,
      trend: "up",
      growth: 5,
      lastRestock: "2025-01-30"
    },
    {
      id: "PROD-1005",
      name: "Organic Honey (1kg)",
      category: "Food",
      sku: "FD-HON-1KG",
      price: 15.50,
      cost: 9.80,
      stock: 56,
      sold: 120,
      revenue: 1860.00,
      profit: 684.00,
      rating: 4.7,
      reviews: 37,
      trend: "up",
      growth: 12,
      lastRestock: "2025-02-02"
    },
    {
      id: "PROD-1006",
      name: "Office Chair",
      category: "Furniture",
      sku: "FR-OC-001",
      price: 129.99,
      cost: 85.00,
      stock: 15,
      sold: 28,
      revenue: 3639.72,
      profit: 1259.72,
      rating: 4.5,
      reviews: 15,
      trend: "down",
      growth: -3,
      lastRestock: "2025-01-20"
    },
    {
      id: "PROD-1007",
      name: "Fruits Basket",
      category: "Food",
      sku: "FD-FB-001",
      price: 25.00,
      cost: 16.50,
      stock: 34,
      sold: 95,
      revenue: 2375.00,
      profit: 807.50,
      rating: 4.8,
      reviews: 42,
      trend: "up",
      growth: 18,
      lastRestock: "2025-02-03"
    },
    {
      id: "PROD-1008",
      name: "Books Collection",
      category: "Books",
      sku: "BK-COL-001",
      price: 25.00,
      cost: 17.00,
      stock: 67,
      sold: 52,
      revenue: 1300.00,
      profit: 416.00,
      rating: 4.3,
      reviews: 22,
      trend: "down",
      growth: -2,
      lastRestock: "2025-01-10"
    }
  ];

  // Chart Data
  const initialChartData = [
    { name: 'Jan', revenue: 4200, sold: 120, profit: 1500 },
    { name: 'Feb', revenue: 5200, sold: 145, profit: 1900 },
    { name: 'Mar', revenue: 6100, sold: 165, profit: 2200 },
    { name: 'Apr', revenue: 5800, sold: 158, profit: 2100 },
    { name: 'May', revenue: 6700, sold: 180, profit: 2400 },
    { name: 'Jun', revenue: 7200, sold: 195, profit: 2600 },
  ];

  const categoryColors = {
    'Beverages': '#8884d8',
    'Food': '#82ca9d',
    'Clothing': '#ffc658',
    'Electronics': '#ff8042',
    'Furniture': '#0088fe',
    'Books': '#00C49F'
  };

  useEffect(() => {
    setProducts(initialProducts);
    setChartData(initialChartData);
    
    // Calculate stats
    const totalRevenue = initialProducts.reduce((sum, p) => sum + p.revenue, 0);
    const totalProfit = initialProducts.reduce((sum, p) => sum + p.profit, 0);
    const totalSold = initialProducts.reduce((sum, p) => sum + p.sold, 0);
    const totalStock = initialProducts.reduce((sum, p) => sum + p.stock, 0);
    const avgRating = initialProducts.reduce((sum, p) => sum + p.rating, 0) / initialProducts.length;
    
    // Calculate category distribution
    const categories = {};
    initialProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = {
          revenue: 0,
          count: 0,
          sold: 0
        };
      }
      categories[product.category].revenue += product.revenue;
      categories[product.category].count += 1;
      categories[product.category].sold += product.sold;
    });
    
    const categoryPieData = Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat].revenue,
      count: categories[cat].count
    }));
    
    setCategoryData(categoryPieData);
    
    setStats({
      totalProducts: initialProducts.length,
      totalRevenue,
      totalProfit,
      totalSold,
      totalStock,
      avgRating: avgRating.toFixed(1),
      topSelling: Math.max(...initialProducts.map(p => p.sold)),
      avgGrowth: (initialProducts.reduce((sum, p) => sum + p.growth, 0) / initialProducts.length).toFixed(1),
      lowStock: initialProducts.filter(p => p.stock < 20).length
    });
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.id.toLowerCase().includes(search.toLowerCase()) ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "revenue") {
        return sortOrder === "desc" ? b.revenue - a.revenue : a.revenue - b.revenue;
      }
      if (sortBy === "sold") {
        return sortOrder === "desc" ? b.sold - a.sold : a.sold - b.sold;
      }
      if (sortBy === "profit") {
        return sortOrder === "desc" ? b.profit - a.profit : a.profit - b.profit;
      }
      if (sortBy === "rating") {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      }
      return 0;
    });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get trend color and icon
  const getTrendIndicator = (trend, growth) => {
    if (trend === "up" || growth > 0) {
      return {
        icon: <MdTrendingUp className="text-green-600" />,
        color: "text-green-600",
        bgColor: "bg-green-50"
      };
    } else {
      return {
        icon: <MdTrendingDown className="text-red-600" />,
        color: "text-red-600",
        bgColor: "bg-red-50"
      };
    }
  };

  // Get performance badge
  const getPerformanceBadge = (product) => {
    const revenueRank = products.sort((a, b) => b.revenue - a.revenue).findIndex(p => p.id === product.id) + 1;
    if (revenueRank <= 3) return { label: "Top", color: "bg-purple-500" };
    if (revenueRank <= 6) return { label: "Mid", color: "bg-blue-500" };
    return { label: "Low", color: "bg-gray-500" };
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock < 20) return { label: "Low", color: "bg-red-100 text-red-800" };
    if (stock < 50) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "High", color: "bg-green-100 text-green-800" };
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' || entry.name === 'profit' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Product Performance
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Analyze product sales, revenue, and performance metrics
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <MdDownload /> Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2">
              <MdRefresh /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { 
              label: "Total Revenue", 
              value: formatCurrency(stats.totalRevenue || 0), 
              icon: <MdAttachMoney className="text-2xl" />,
              color: "from-green-500 to-green-600",
              trend: "+18%"
            },
            { 
              label: "Total Profit", 
              value: formatCurrency(stats.totalProfit || 0), 
              icon: <MdTrendingUp className="text-2xl" />,
              color: "from-blue-500 to-blue-600",
              trend: "+15%"
            },
            { 
              label: "Units Sold", 
              value: stats.totalSold || 0, 
              icon: <MdShoppingCart className="text-2xl" />,
              color: "from-purple-500 to-purple-600",
              trend: "+12%"
            },
            { 
              label: "Avg Rating", 
              value: `${stats.avgRating || "0.0"}/5`, 
              icon: <MdStar className="text-2xl" />,
              color: "from-yellow-500 to-yellow-600",
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue & Sales Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MdBarChart className="text-blue-600" />
              Revenue & Sales Trend
            </h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Profit"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MdPieChart className="text-purple-600" />
              Revenue by Category
            </h2>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#cccccc'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products List */}
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
                  placeholder="Search products by name, SKU, or category..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none pr-8 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Books">Books</option>
                  </select>
                  <MdFilterList className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none pr-8 text-sm"
                  >
                    <option value="revenue">Revenue</option>
                    <option value="sold">Units Sold</option>
                    <option value="profit">Profit</option>
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

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Product</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Category</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Revenue</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Sold</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Profit</th>
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
                    const trend = getTrendIndicator(product.trend, product.growth);
                    const performance = getPerformanceBadge(product);
                    const stockStatus = getStockStatus(product.stock);
                    
                    return (
                      <tr
                        key={product.id}
                        className={`border-b hover:bg-gray-50 transition-colors animate-fade-in-delay cursor-pointer ${
                          selectedProduct?.id === product.id ? "bg-blue-50" : ""
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                              {product.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate max-w-[150px]" title={product.name}>
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate" title={`SKU: ${product.sku}`}>
                                SKU: {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStockStatus(product.stock).color}`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{formatCurrency(product.revenue)}</p>
                            <p className="text-gray-600 text-xs flex items-center gap-1">
                              {trend.icon} {product.growth > 0 ? '+' : ''}{product.growth}%
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{product.sold} units</p>
                            <p className="text-gray-600 text-xs">Stock: {product.stock}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-bold text-green-700 text-sm">{formatCurrency(product.profit)}</p>
                            <p className="text-gray-600 text-xs">
                              Margin: {((product.profit / product.revenue) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${performance.color} text-white`}>
                              {performance.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <MdStar className="text-yellow-500" size={12} />
                              <span className="text-xs font-medium">{product.rating}</span>
                              <span className="text-gray-500 text-xs">({product.reviews})</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <MdOutlineInventory className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{filteredProducts.length}</span> of {products.length} products
              </p>
              <div className="flex gap-1">
                <button className="px-2 py-1.5 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  ← Prev
                </button>
                <button className="px-2 py-1.5 border rounded text-sm bg-blue-600 text-white hover:bg-blue-700">
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

        {/* Right Column - Product Details & Insights */}
        <div className="space-y-6">
          {/* Selected Product Details */}
          {selectedProduct ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-2xl font-bold">
                    {selectedProduct.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStockStatus(selectedProduct.stock).color}`}>
                        Stock: {getStockStatus(selectedProduct.stock).label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTrendIndicator(selectedProduct.trend, selectedProduct.growth).bgColor} ${getTrendIndicator(selectedProduct.trend, selectedProduct.growth).color}`}>
                        {getTrendIndicator(selectedProduct.trend, selectedProduct.growth).icon} 
                        {selectedProduct.growth > 0 ? '+' : ''}{selectedProduct.growth}% Growth
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Product Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{selectedProduct.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedProduct.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-blue-700">{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium">{formatCurrency(selectedProduct.cost)}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Units Sold</p>
                    <p className="text-xl font-bold text-blue-700">{selectedProduct.sold}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(selectedProduct.revenue)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Profit</p>
                    <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedProduct.profit)}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {((selectedProduct.profit / selectedProduct.revenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Customer Rating */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Feedback</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <MdStar
                            key={i}
                            className={`${i < Math.floor(selectedProduct.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                            size={20}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{selectedProduct.rating}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Reviews</p>
                      <p className="font-bold">{selectedProduct.reviews}</p>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                  <MdVisibility /> View Detailed Analytics
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="text-center py-8">
                <MdOutlineInventory className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Product</h3>
                <p className="text-gray-600">
                  Click on any product to view detailed performance analytics
                </p>
              </div>
            </div>
          )}

          {/* Performance Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MdOutlineSpeed className="text-blue-600" />
              Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Top Performing Category</span>
                  <span className="font-bold text-green-700">Beverages</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Highest revenue generator</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Fastest Growing</span>
                  <span className="font-bold text-blue-700">Clothing +22%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Highest growth rate</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Best Rated</span>
                  <span className="font-bold text-yellow-700">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Traditional Shawl</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Low Stock Alert</span>
                  <span className="font-bold text-red-700">{stats.lowStock || 0} items</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Need restocking</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2">
                <MdDownload /> Export Report
              </button>
              <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2">
                <MdRefresh /> Refresh Data
              </button>
              <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2">
                <MdBarChart /> Compare Products
              </button>
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
      `}</style>
    </div>
  );
}
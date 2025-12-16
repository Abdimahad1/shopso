import { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCalendarToday,
  MdDownload,
  MdRefresh,
  MdAttachMoney,
  MdShoppingCart,
  MdTrendingUp,
  MdTrendingDown,
  MdBarChart,
  MdPieChart,
  MdShowChart,
  MdArrowUpward,
  MdArrowDownward,
  MdInfo,
  MdPrint,
  MdShare,
  MdOutlineReceipt,
  MdOutlinePayments,
  MdOutlineCategory,
  MdOutlineLocationOn,
  MdOutlinePeople
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
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function SalesReports() {
  const [timeRange, setTimeRange] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [reportType, setReportType] = useState("overview");
  const [salesData, setSalesData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [stats, setStats] = useState({});
  const [topProducts, setTopProducts] = useState([]);

  // Mock Sales Data
  const initialSalesData = [
    { month: 'Jan', revenue: 12500, orders: 145, avgOrder: 86.21, growth: 12 },
    { month: 'Feb', revenue: 14200, orders: 162, avgOrder: 87.65, growth: 13.6 },
    { month: 'Mar', revenue: 15800, orders: 178, avgOrder: 88.76, growth: 11.3 },
    { month: 'Apr', revenue: 17200, orders: 195, avgOrder: 88.21, growth: 8.9 },
    { month: 'May', revenue: 18900, orders: 210, avgOrder: 90.00, growth: 9.9 },
    { month: 'Jun', revenue: 20500, orders: 225, avgOrder: 91.11, growth: 8.5 },
    { month: 'Jul', revenue: 21800, orders: 238, avgOrder: 91.60, growth: 6.3 },
    { month: 'Aug', revenue: 23200, orders: 250, avgOrder: 92.80, growth: 6.4 },
    { month: 'Sep', revenue: 24500, orders: 262, avgOrder: 93.51, growth: 5.6 },
    { month: 'Oct', revenue: 25800, orders: 275, avgOrder: 93.82, growth: 5.3 },
    { month: 'Nov', revenue: 27200, orders: 288, avgOrder: 94.44, growth: 5.4 },
    { month: 'Dec', revenue: 28500, orders: 300, avgOrder: 95.00, growth: 4.8 },
  ];

  // Daily Sales Data
  const initialDailyData = [
    { day: 'Mon', revenue: 3850, orders: 45 },
    { day: 'Tue', revenue: 4200, orders: 48 },
    { day: 'Wed', revenue: 3950, orders: 46 },
    { day: 'Thu', revenue: 4500, orders: 52 },
    { day: 'Fri', revenue: 5100, orders: 58 },
    { day: 'Sat', revenue: 4800, orders: 55 },
    { day: 'Sun', revenue: 3650, orders: 42 },
  ];

  // Category Sales Data
  const initialCategoryData = [
    { name: 'Beverages', value: 32500, color: '#8884d8' },
    { name: 'Food', value: 28500, color: '#82ca9d' },
    { name: 'Clothing', value: 19500, color: '#ffc658' },
    { name: 'Electronics', value: 15800, color: '#ff8042' },
    { name: 'Furniture', value: 12500, color: '#0088fe' },
    { name: 'Books', value: 8500, color: '#00C49F' },
  ];

  // Region Sales Data
  const initialRegionData = [
    { name: 'Mogadishu', value: 42500, orders: 460, growth: 12.5 },
    { name: 'Hargeisa', value: 28500, orders: 310, growth: 9.8 },
    { name: 'Kismayo', value: 18500, orders: 210, growth: 14.2 },
    { name: 'Bosaso', value: 16500, orders: 185, growth: 8.5 },
    { name: 'Baidoa', value: 12500, orders: 140, growth: 11.3 },
  ];

  // Top Products
  const initialTopProducts = [
    { id: 'PROD-1001', name: 'Organic Coffee Beans', revenue: 8560, sold: 640, growth: 15.2 },
    { id: 'PROD-1003', name: 'Traditional Shawl', revenue: 7280, sold: 255, growth: 22.4 },
    { id: 'PROD-1004', name: 'Coffee Maker', revenue: 6350, sold: 127, growth: 8.9 },
    { id: 'PROD-1005', name: 'Organic Honey', revenue: 5920, sold: 382, growth: 12.7 },
    { id: 'PROD-1007', name: 'Fruits Basket', revenue: 5380, sold: 215, growth: 18.3 },
  ];

  useEffect(() => {
    setSalesData(initialSalesData);
    setDailyData(initialDailyData);
    setCategoryData(initialCategoryData);
    setRegionData(initialRegionData);
    setTopProducts(initialTopProducts);
    
    // Calculate stats
    const latestMonth = initialSalesData[initialSalesData.length - 1];
    const prevMonth = initialSalesData[initialSalesData.length - 2];
    const totalRevenue = initialSalesData.reduce((sum, month) => sum + month.revenue, 0);
    const totalOrders = initialSalesData.reduce((sum, month) => sum + month.orders, 0);
    const avgMonthlyGrowth = initialSalesData.reduce((sum, month) => sum + month.growth, 0) / initialSalesData.length;
    
    setStats({
      totalRevenue,
      totalOrders,
      avgMonthlyGrowth: avgMonthlyGrowth.toFixed(1),
      currentRevenue: latestMonth.revenue,
      currentOrders: latestMonth.orders,
      revenueGrowth: latestMonth.growth,
      avgOrderValue: latestMonth.avgOrder,
      topRegion: initialRegionData[0].name,
      topCategory: initialCategoryData[0].name
    });
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'revenue' ? 'Revenue: ' + formatCurrency(entry.value) : 
               entry.name === 'orders' ? 'Orders: ' + entry.value :
               entry.name === 'avgOrder' ? 'Avg Order: ' + formatCurrency(entry.value) :
               entry.name === 'growth' ? 'Growth: ' + entry.value + '%' :
               entry.name + ': ' + (typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get growth color
  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Get growth icon
  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <MdTrendingUp className="text-green-600" /> : <MdTrendingDown className="text-red-600" />;
  };

  // Render different reports based on type
  const renderReportContent = () => {
    switch(reportType) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MdShowChart className="text-blue-600" />
                  Monthly Revenue Trend
                </h2>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="month">Last 6 Months</option>
                    <option value="quarter">Last 4 Quarters</option>
                    <option value="year">Last 12 Months</option>
                  </select>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Orders"
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Performance & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Performance */}
              <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MdBarChart className="text-green-600" />
                  Weekly Performance
                </h2>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orders" fill="#82ca9d" name="Orders" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MdPieChart className="text-purple-600" />
                  Sales by Category
                </h2>
                
                <div className="h-64">
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
          </div>
        );

      case 'regional':
        return (
          <div className="space-y-6">
            {/* Regional Performance */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MdOutlineLocationOn className="text-blue-600" />
                  Regional Sales Performance
                </h2>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">All Regions</option>
                    <option value="Mogadishu">Mogadishu</option>
                    <option value="Hargeisa">Hargeisa</option>
                    <option value="Kismayo">Kismayo</option>
                    <option value="Bosaso">Bosaso</option>
                    <option value="Baidoa">Baidoa</option>
                  </select>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Region Comparison Table */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Region Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Region</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Revenue</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Orders</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Avg Order</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Growth</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionData.map((region, index) => {
                      const avgOrder = region.value / region.orders;
                      const performance = region.growth > 10 ? 'High' : region.growth > 5 ? 'Medium' : 'Low';
                      
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                                {region.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">{region.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-bold text-gray-800">{formatCurrency(region.value)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium text-gray-800">{formatNumber(region.orders)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-gray-700">{formatCurrency(avgOrder)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              {getGrowthIcon(region.growth)}
                              <span className={`font-medium ${getGrowthColor(region.growth)}`}>
                                {region.growth}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              performance === 'High' ? 'bg-green-100 text-green-800' :
                              performance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {performance}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MdOutlineReceipt className="text-blue-600" />
                  Top Performing Products
                </h2>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">All Categories</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Product</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Revenue</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Units Sold</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Avg Price</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Growth</th>
                      <th className="text-left py-3 px-2 text-gray-700 font-semibold text-sm">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => {
                      const avgPrice = product.revenue / product.sold;
                      
                      return (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                                {product.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-bold text-gray-800">{formatCurrency(product.revenue)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium text-gray-800">{formatNumber(product.sold)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-gray-700">{formatCurrency(avgPrice)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              {getGrowthIcon(product.growth)}
                              <span className={`font-medium ${getGrowthColor(product.growth)}`}>
                                {product.growth}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              #{index + 1}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
              Sales Reports
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Comprehensive sales analytics and performance reports
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <MdPrint /> Print Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2">
              <MdDownload /> Export Report
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
              trend: `+${stats.revenueGrowth || '0'}%`
            },
            { 
              label: "Total Orders", 
              value: formatNumber(stats.totalOrders || 0), 
              icon: <MdShoppingCart className="text-2xl" />,
              color: "from-blue-500 to-blue-600",
              trend: "+12%"
            },
            { 
              label: "Avg Order Value", 
              value: formatCurrency(stats.avgOrderValue || 0), 
              icon: <MdTrendingUp className="text-2xl" />,
              color: "from-purple-500 to-purple-600",
              trend: "+5.2%"
            },
            { 
              label: "Monthly Growth", 
              value: `${stats.avgMonthlyGrowth || '0'}%`, 
              icon: <MdBarChart className="text-2xl" />,
              color: "from-orange-500 to-orange-600",
              trend: "Avg"
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
                  {stat.trend.includes('+') || stat.trend.includes('-') ? (
                    stat.trend.startsWith('+') ? <MdTrendingUp className="inline text-green-600" /> : <MdTrendingDown className="inline text-red-600" />
                  ) : null}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <MdBarChart /> },
              { id: 'regional', label: 'Regional', icon: <MdOutlineLocationOn /> },
              { id: 'products', label: 'Products', icon: <MdOutlineReceipt /> },
              { id: 'customers', label: 'Customers', icon: <MdOutlinePeople /> },
              { id: 'comparison', label: 'Comparison', icon: <MdShowChart /> }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  reportType === type.id
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Report Content */}
      <div className="mb-6">
        {renderReportContent()}
      </div>

      {/* Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MdInfo className="text-blue-600" />
              Key Insights
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Revenue Growth</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    +{stats.revenueGrowth || '0'}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Consistent growth observed over the last 6 months, with highest growth in Q4.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Top Performing Region</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                    {stats.topRegion || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {stats.topRegion || 'N/A'} contributes {((42500 / stats.totalRevenue) * 100).toFixed(1)}% of total revenue.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Best Selling Category</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                    {stats.topCategory || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {stats.topCategory || 'N/A'} category shows highest customer demand and growth potential.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Peak Sales Period</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    Friday
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Fridays show 25% higher sales compared to weekly average. Consider promotions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2">
                <MdDownload /> Export Data
              </button>
              <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2">
                <MdRefresh /> Refresh Report
              </button>
              <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2">
                <MdShare /> Share Report
              </button>
              <button className="w-full px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition flex items-center justify-center gap-2">
                <MdCalendarToday /> Schedule Report
              </button>
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Report Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Report Period</span>
                <span className="font-medium">Last 12 Months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Generated On</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Data Points</span>
                <span className="font-medium">{formatNumber(2456)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Report Type</span>
                <span className="font-medium capitalize">{reportType}</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  This report includes comprehensive sales data, trends, and actionable insights for business decisions.
                </p>
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
      `}</style>
    </div>
  );
}
// pages/shopOwner/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdShoppingCart,
  MdTrendingUp,
  MdPeople,
  MdAttachMoney,
  MdLocalShipping,
  MdInventory,
  MdStar,
  MdNotifications,
  MdSchedule,
  MdShowChart,
  MdRefresh,
  MdChevronRight,
  MdStore,
  MdCategory,
  MdAssignmentTurnedIn,
  MdDiscount,
  MdAccessTime,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
  MdEdit,
  MdVisibility,
  MdWarning,
  MdCheckCircle,
  MdPendingActions,
  MdCancel,
  MdDownload,
  MdCalendarToday,
  MdStorefront,
  MdShoppingBag,
  MdBarChart,
  MdPieChart,
  MdAccountBalanceWallet,
  MdTimer,
  MdSecurity,
  MdCloudDone,
  MdEventAvailable,
  MdInventory2,
  MdAdd 
} from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  const [storeStats, setStoreStats] = useState({
    totalSales: 45280,
    totalOrders: 12567,
    activeCustomers: 3245,
    pendingOrders: 43,
    todayRevenue: 2560,
    conversionRate: 4.8,
    avgOrderValue: 120,
    inventoryItems: 1567,
    stockAlerts: 12,
    deliveryPending: 8
  });

  const [salesData, setSalesData] = useState([
    { day: "Mon", sales: 3200, orders: 45 },
    { day: "Tue", sales: 4200, orders: 52 },
    { day: "Wed", sales: 3800, orders: 48 },
    { day: "Thu", sales: 5100, orders: 63 },
    { day: "Fri", sales: 6800, orders: 78 },
    { day: "Sat", sales: 7200, orders: 85 },
    { day: "Sun", sales: 4800, orders: 56 },
  ]);

  const [topProducts, setTopProducts] = useState([
    { id: 1, name: "Samsung Galaxy S23", sales: 156, revenue: "$23,400", stock: 12, trend: "up" },
    { id: 2, name: "iPhone 15 Pro", sales: 132, revenue: "$31,680", stock: 8, trend: "up" },
    { id: 3, name: "AirPods Pro", sales: 98, revenue: "$19,600", stock: 45, trend: "stable" },
    { id: 4, name: "MacBook Air M2", sales: 67, revenue: "$80,400", stock: 5, trend: "down" },
    { id: 5, name: "Apple Watch Series 9", sales: 54, revenue: "$16,200", stock: 22, trend: "up" },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 1, customer: "Ahmed Ali", amount: "$450", status: "Delivered", time: "2 min ago" },
    { id: 2, customer: "Fatima Hassan", amount: "$320", status: "Processing", time: "15 min ago" },
    { id: 3, customer: "Omar Said", amount: "$180", status: "Pending", time: "1 hour ago" },
    { id: 4, customer: "Aisha Mohamed", amount: "$560", status: "Shipped", time: "2 hours ago" },
    { id: 5, customer: "Yusuf Abdullahi", amount: "$230", status: "Delivered", time: "3 hours ago" },
  ]);

  const [activityLog, setActivityLog] = useState([
    { id: 1, action: "New order received", time: "Just now", type: "order" },
    { id: 2, action: "Payment confirmed", time: "5 min ago", type: "payment" },
    { id: 3, action: "Low stock alert", time: "1 hour ago", type: "inventory" },
    { id: 4, action: "New customer review", time: "2 hours ago", type: "review" },
    { id: 5, action: "Product restocked", time: "3 hours ago", type: "inventory" },
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    ordersGrowth: 12.5,
    revenueGrowth: 18.3,
    customerGrowth: 8.7,
    conversionGrowth: 2.1
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStoreStats(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 100),
        pendingOrders: Math.max(0, prev.pendingOrders + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <MdCheckCircle className="text-green-500" />;
      case 'processing': return <MdPendingActions className="text-blue-500" />;
      case 'pending': return <MdSchedule className="text-yellow-500" />;
      case 'shipped': return <MdLocalShipping className="text-purple-500" />;
      default: return <MdCancel className="text-gray-500" />;
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'order': return <MdShoppingCart className="text-blue-500" />;
      case 'payment': return <MdAttachMoney className="text-green-500" />;
      case 'inventory': return <MdInventory className="text-red-500" />;
      case 'review': return <MdStar className="text-yellow-500" />;
      default: return <MdNotifications className="text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 pt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shop Owner</span>
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/shop/products/add")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
            >
              <MdAdd /> Add Product
            </button>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <MdDownload /> Export Report
            </button>
          </div>
        </div>

        {/* Date and Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-blue-500" />
            <span className="font-medium text-gray-700">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <MdTimer className="text-green-500" />
            <span className="font-medium text-gray-700">
              Store open: 8:00 AM - 10:00 PM
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <MdCloudDone className="text-purple-500" />
            <span className="font-medium text-gray-700">
              System Status: <span className="text-green-600 font-bold">Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <MdAttachMoney className="text-2xl text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <MdArrowUpward />
              <span className="font-bold">{performanceMetrics.revenueGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            ${storeStats.totalSales.toLocaleString()}
          </h3>
          <p className="text-gray-600 mb-3">Total Revenue</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Today: ${storeStats.todayRevenue}</span>
            <button 
              onClick={() => navigate("/shop/reports/sales")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View Report <MdChevronRight />
            </button>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <MdShoppingCart className="text-2xl text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <MdArrowUpward />
              <span className="font-bold">{performanceMetrics.ordersGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {storeStats.totalOrders.toLocaleString()}
          </h3>
          <p className="text-gray-600 mb-3">Total Orders</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Pending: <span className="text-yellow-600 font-medium">{storeStats.pendingOrders}</span>
            </span>
            <button 
              onClick={() => navigate("/shop/orders/new")}
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
            >
              View Orders <MdChevronRight />
            </button>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <MdPeople className="text-2xl text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <MdArrowUpward />
              <span className="font-bold">{performanceMetrics.customerGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {storeStats.activeCustomers.toLocaleString()}
          </h3>
          <p className="text-gray-600 mb-3">Active Customers</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Conversion: {storeStats.conversionRate}%
            </span>
            <button 
              onClick={() => navigate("/shop/customers/list")}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              View Customers <MdChevronRight />
            </button>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
              <MdInventory2 className="text-2xl text-white" />
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <MdWarning />
              <span className="font-bold">{storeStats.stockAlerts}</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {storeStats.inventoryItems.toLocaleString()}
          </h3>
          <p className="text-gray-600 mb-3">Products in Stock</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Low stock: <span className="text-red-600 font-medium">{storeStats.stockAlerts} items</span>
            </span>
            <button 
              onClick={() => navigate("/shop/products/inventory")}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
            >
              Manage <MdChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Charts & Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Sales Performance</h2>
              <p className="text-gray-600">Last 7 days revenue & orders</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                Weekly
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                Monthly
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">${salesData.reduce((a, b) => a + b.sales, 0).toLocaleString()}</div>
                <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <MdArrowUpward /> 18.3% increase
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{salesData.reduce((a, b) => a + b.orders, 0)} orders</div>
                <div className="text-blue-600 text-sm font-medium">Total orders this week</div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {salesData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:opacity-90"
                      style={{ height: `${(day.sales / 8000) * 100}%` }}
                    >
                      <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                        ${day.sales.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">{day.orders} orders</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Store Performance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdTrendingUp className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Order Growth</div>
                  <div className="text-sm text-gray-600">This month</div>
                </div>
              </div>
              <div className="text-green-600 font-bold text-lg">
                +{performanceMetrics.ordersGrowth}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdAccountBalanceWallet className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Avg. Order Value</div>
                  <div className="text-sm text-gray-600">Customer spending</div>
                </div>
              </div>
              <div className="text-blue-600 font-bold text-lg">
                ${storeStats.avgOrderValue}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MdPieChart className="text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Conversion Rate</div>
                  <div className="text-sm text-gray-600">Visitor to customer</div>
                </div>
              </div>
              <div className="text-purple-600 font-bold text-lg">
                {storeStats.conversionRate}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MdTimer className="text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Delivery Time</div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>
              </div>
              <div className="text-orange-600 font-bold text-lg">
                2.4h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button 
              onClick={() => navigate("/shop/orders/new")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <MdChevronRight />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/shop/orders/new")}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">
                      {order.customer}
                    </div>
                    <div className="text-sm text-gray-500">{order.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{order.amount}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Top Products</h2>
            <button 
              onClick={() => navigate("/shop/products/all")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <MdChevronRight />
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/shop/products/all")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <MdShoppingBag className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.sales} sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{product.revenue}</div>
                  <div className="text-sm flex items-center gap-1">
                    <span className={`${product.trend === 'up' ? 'text-green-600' : product.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {product.trend === 'up' ? <MdArrowUpward /> : product.trend === 'down' ? <MdArrowDownward /> : '→'}
                    </span>
                    <span className={`text-xs ${product.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button 
              onClick={() => navigate("/shop/notifications")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <MdChevronRight />
            </button>
          </div>

          <div className="space-y-4">
            {activityLog.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate("/shop/notifications")}
              >
                <div className="p-2 rounded-lg bg-gray-100 group-hover:scale-110 transition-transform">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 group-hover:text-blue-600">
                    {activity.action}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MdAccessTime className="text-xs" />
                    {activity.time}
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-xl font-bold text-blue-600">{storeStats.deliveryPending}</div>
              <div className="text-xs text-gray-600">Pending Delivery</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-xl font-bold text-green-600">98.2%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate("/shop/products/add")}
              className="p-4 bg-white rounded-xl hover:shadow-md transition-all text-center group hover:scale-105"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200">
                <MdAdd className="text-blue-600 text-xl" />
              </div>
              <div className="font-medium text-gray-800">Add Product</div>
            </button>
            <button 
              onClick={() => navigate("/shop/discounts/new")}
              className="p-4 bg-white rounded-xl hover:shadow-md transition-all text-center group hover:scale-105"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200">
                <MdDiscount className="text-green-600 text-xl" />
              </div>
              <div className="font-medium text-gray-800">Create Discount</div>
            </button>
            <button 
              onClick={() => navigate("/shop/reports/sales")}
              className="p-4 bg-white rounded-xl hover:shadow-md transition-all text-center group hover:scale-105"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200">
                <MdBarChart className="text-purple-600 text-xl" />
              </div>
              <div className="font-medium text-gray-800">View Reports</div>
            </button>
            <button 
              onClick={() => navigate("/shop/settings/profile")}
              className="p-4 bg-white rounded-xl hover:shadow-md transition-all text-center group hover:scale-105"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200">
                <MdStorefront className="text-orange-600 text-xl" />
              </div>
              <div className="font-medium text-gray-800">Store Settings</div>
            </button>
          </div>
        </div>

        {/* Tips & Insights */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MdShowChart className="text-green-600 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Store Insights</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">Best Selling Time</span>
                <span className="text-green-600 font-bold">7-9 PM</span>
              </div>
              <div className="text-sm text-gray-600">Peak hours for maximum sales</div>
            </div>
            
            <div className="p-3 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">Customer Satisfaction</span>
                <span className="text-yellow-600 font-bold">4.8/5</span>
              </div>
              <div className="text-sm text-gray-600">Based on recent reviews</div>
            </div>
            
            <div className="p-3 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">Next Restock</span>
                <span className="text-blue-600 font-bold">Tomorrow</span>
              </div>
              <div className="text-sm text-gray-600">3 products need attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600">
          <span className="font-medium">Store Uptime:</span> 99.9%
        </div>
        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600">
          <span className="font-medium">Active Promotions:</span> 3
        </div>
        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600">
          <span className="font-medium">Today's Visitors:</span> 1,245
        </div>
        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600">
          <span className="font-medium">Processing Time:</span> 1.2h avg
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .hover\\:scale-\\[1\\.02\\]:hover {
          transform: scale(1.02);
        }

        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }

        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </div>
  );
}
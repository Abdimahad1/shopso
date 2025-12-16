import { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdLocationOn,
  MdAccessTime,
  MdDirectionsBike,
  MdPhone,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdMap,
  MdInfo,
  MdArrowUpward,
  MdArrowDownward,
  MdSchedule,
  MdWarning,
  MdLocalShipping,
  MdPersonPinCircle,
  MdMessage,
  MdStar,
  MdShare
} from "react-icons/md";

export default function DeliveryStatus() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock Delivery Data
  const deliveries = [
    {
      id: "DEL-1001",
      orderId: "ORD-1001",
      customer: "Ahmed Mohamed",
      rider: "Mohamed Jama",
      riderPhone: "+252 61 111 2222",
      status: "in_progress",
      progress: 65,
      currentLocation: "Hodan District",
      destination: "Maka Al-Mukarama Rd",
      estimatedArrival: "10:45 AM",
      actualArrival: null,
      delay: 0,
      items: 3,
      total: 49.99,
      lastUpdated: "10:30 AM",
      coordinates: { lat: 2.0465, lng: 45.3178 },
      updates: [
        { time: "10:00 AM", message: "Order picked up from warehouse" },
        { time: "10:15 AM", message: "Rider heading to delivery location" },
        { time: "10:30 AM", message: "In Hodan District, 2km away" }
      ]
    },
    {
      id: "DEL-1002",
      orderId: "ORD-1002",
      customer: "Fatima Ali",
      rider: "Abdiwali Ahmed",
      riderPhone: "+252 61 333 4444",
      status: "pending",
      progress: 20,
      currentLocation: "Warehouse",
      destination: "Hodan District",
      estimatedArrival: "11:15 AM",
      actualArrival: null,
      delay: 5,
      items: 5,
      total: 89.50,
      lastUpdated: "10:25 AM",
      coordinates: { lat: 2.0400, lng: 45.3150 },
      updates: [
        { time: "10:20 AM", message: "Order prepared for pickup" },
        { time: "10:25 AM", message: "Awaiting rider assignment" }
      ]
    },
    {
      id: "DEL-1003",
      orderId: "ORD-1003",
      customer: "Omar Hassan",
      rider: "Hassan Omar",
      riderPhone: "+252 61 555 6666",
      status: "delivered",
      progress: 100,
      currentLocation: "Delivered",
      destination: "Waberi",
      estimatedArrival: "10:20 AM",
      actualArrival: "10:18 AM",
      delay: -2,
      items: 2,
      total: 29.99,
      lastUpdated: "10:18 AM",
      coordinates: { lat: 2.0421, lng: 45.3205 },
      updates: [
        { time: "09:45 AM", message: "Order picked up" },
        { time: "10:05 AM", message: "En route to destination" },
        { time: "10:18 AM", message: "Delivered successfully" }
      ]
    },
    {
      id: "DEL-1004",
      orderId: "ORD-1004",
      customer: "Aisha Abdi",
      rider: "Jamal Yusuf",
      riderPhone: "+252 61 777 8888",
      status: "delayed",
      progress: 40,
      currentLocation: "Shangani",
      destination: "Shangani Main Road",
      estimatedArrival: "11:30 AM",
      actualArrival: null,
      delay: 15,
      items: 8,
      total: 120.75,
      lastUpdated: "10:35 AM",
      coordinates: { lat: 2.0490, lng: 45.3210 },
      updates: [
        { time: "10:00 AM", message: "Order picked up" },
        { time: "10:20 AM", message: "Traffic delay in Shangani" },
        { time: "10:35 AM", message: "ETA delayed by 15 minutes" }
      ]
    },
    {
      id: "DEL-1005",
      orderId: "ORD-1005",
      customer: "Yusuf Ali",
      rider: "Mohamed Jama",
      riderPhone: "+252 61 111 2222",
      status: "cancelled",
      progress: 0,
      currentLocation: "Cancelled",
      destination: "Waberi",
      estimatedArrival: null,
      actualArrival: null,
      delay: null,
      items: 4,
      total: 65.25,
      lastUpdated: "10:10 AM",
      coordinates: null,
      updates: [
        { time: "10:05 AM", message: "Order assigned to rider" },
        { time: "10:10 AM", message: "Cancelled by customer" }
      ]
    }
  ];

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate live updates
      console.log("Refreshing delivery status...");
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter and sort deliveries
  const filteredDeliveries = deliveries
    .filter(delivery => {
      const matchesSearch = 
        delivery.id.toLowerCase().includes(search.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(search.toLowerCase()) ||
        delivery.customer.toLowerCase().includes(search.toLowerCase()) ||
        delivery.rider.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return sortOrder === "asc" 
          ? new Date(`1970/01/01 ${a.lastUpdated}`) - new Date(`1970/01/01 ${b.lastUpdated}`)
          : new Date(`1970/01/01 ${b.lastUpdated}`) - new Date(`1970/01/01 ${a.lastUpdated}`);
      }
      if (sortBy === "total") {
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

  // Get status counts
  const statusCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
    return acc;
  }, {});

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "delayed": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "in_progress": return <MdDirectionsBike className="text-blue-600" />;
      case "pending": return <MdSchedule className="text-yellow-600" />;
      case "delivered": return <MdCheckCircle className="text-green-600" />;
      case "delayed": return <MdWarning className="text-orange-600" />;
      case "cancelled": return <MdCancel className="text-red-600" />;
      default: return <MdInfo className="text-gray-600" />;
    }
  };

  // Get progress bar color
  const getProgressColor = (status) => {
    switch(status) {
      case "in_progress": return "bg-blue-600";
      case "pending": return "bg-yellow-500";
      case "delivered": return "bg-green-600";
      case "delayed": return "bg-orange-600";
      case "cancelled": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    // In a real app, this would fetch new data
    console.log("Manual refresh triggered");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
              Delivery Status
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Real-time tracking and status of all deliveries
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <MdRefresh className={autoRefresh ? "animate-spin" : ""} />
              Refresh
            </button>
            
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-green-600"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                Auto-refresh
              </label>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          {[
            { label: "All Deliveries", value: deliveries.length, color: "bg-gray-500" },
            { label: "In Progress", value: statusCounts.in_progress || 0, color: "bg-blue-500" },
            { label: "Delivered", value: statusCounts.delivered || 0, color: "bg-green-500" },
            { label: "Delayed", value: statusCounts.delayed || 0, color: "bg-orange-500" },
            { label: "Pending", value: statusCounts.pending || 0, color: "bg-yellow-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Deliveries List */}
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
                  placeholder="Search deliveries by ID, customer, or rider..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none appearance-none pr-10"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <MdFilterList className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none appearance-none pr-10"
                  >
                    <option value="time">Sort by Time</option>
                    <option value="total">Sort by Amount</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="absolute right-10 top-3.5 text-gray-500"
                  >
                    {sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />}
                  </button>
                </div>
              </div>
            </div>

            {/* Deliveries Grid */}
            <div className="space-y-4">
              {filteredDeliveries.map((delivery, index) => (
                <div
                  key={delivery.id}
                  className={`bg-gradient-to-br from-white to-gray-50 border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.01] animate-fade-in-delay ${
                    selectedDelivery?.id === delivery.id ? "ring-2 ring-green-500" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(delivery.status)}`}>
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-800">{delivery.id}</h3>
                            <span className="text-sm text-gray-500">({delivery.orderId})</span>
                          </div>
                          <p className="text-gray-600">{delivery.customer}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdDirectionsBike className="text-blue-600 flex-shrink-0" />
                            <span className="truncate">{delivery.rider}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdLocationOn className="text-green-600 flex-shrink-0" />
                            <span className="truncate">{delivery.currentLocation}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdAccessTime className="text-purple-600 flex-shrink-0" />
                            <span>ETA: {delivery.estimatedArrival || "N/A"}</span>
                          </div>
                          {delivery.delay !== null && delivery.delay > 0 && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <MdWarning className="flex-shrink-0" />
                              <span>Delayed by {delivery.delay} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-700">${delivery.total}</p>
                        <p className="text-sm text-gray-500">{delivery.items} items</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-48">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{delivery.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressColor(delivery.status)} transition-all duration-500`}
                            style={{ width: `${delivery.progress}%` }}
                          />
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDeliveries.length === 0 && (
                <div className="text-center py-12">
                  <MdLocalShipping className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No deliveries found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Delivery Details & Updates */}
        <div className="space-y-6">
          {/* Selected Delivery Details */}
          {selectedDelivery ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-xl ${getStatusColor(selectedDelivery.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedDelivery.status)}
                    <div>
                      <h3 className="font-bold">{selectedDelivery.status.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm opacity-90">Last updated: {selectedDelivery.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                {/* Customer & Rider Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <p className="text-lg font-bold">{selectedDelivery.customer}</p>
                      <p className="text-gray-600">Order: {selectedDelivery.orderId}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MdLocationOn /> {selectedDelivery.destination}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-3">Rider Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">{selectedDelivery.rider}</p>
                        <div className="flex items-center gap-1">
                          <MdStar className="text-yellow-500" />
                          <span className="font-semibold">4.8</span>
                        </div>
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MdPhone /> {selectedDelivery.riderPhone}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MdPersonPinCircle /> Current: {selectedDelivery.currentLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Delivery Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Arrival</span>
                      <span className="font-bold">{selectedDelivery.estimatedArrival || "Calculating..."}</span>
                    </div>
                    {selectedDelivery.actualArrival && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Arrival</span>
                        <span className="font-bold text-green-600">{selectedDelivery.actualArrival}</span>
                      </div>
                    )}
                    {selectedDelivery.delay !== null && selectedDelivery.delay > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delay</span>
                        <span className="font-bold text-orange-600">+{selectedDelivery.delay} minutes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <MdMessage /> Contact Rider
                  </button>
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <MdMap /> Track on Map
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="text-center py-8">
                <MdInfo className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Delivery</h3>
                <p className="text-gray-600">
                  Click on any delivery to view detailed information and real-time updates
                </p>
              </div>
            </div>
          )}

          {/* Live Updates Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Live Updates</h3>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">Live</span>
              </span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {selectedDelivery ? (
                selectedDelivery.updates.map((update, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b last:border-0 last:pb-0 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {index < selectedDelivery.updates.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-800">{update.time}</span>
                        </div>
                        <p className="text-gray-600">{update.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MdSchedule className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Select a delivery to view updates</p>
                </div>
              )}
            </div>

            {selectedDelivery && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Send message to rider..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <MdShare />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">On-time Deliveries</span>
                <span className="font-bold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Avg Delivery Time</span>
                <span className="font-bold text-blue-600">32 min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Customer Rating</span>
                <span className="font-bold text-yellow-600">4.7/5</span>
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
        
        /* Custom scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdDeliveryDining,
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdDirectionsBike,
  MdTwoWheeler,
  MdMap,
  MdInfo,
  MdArrowBack,
  MdSend,
  MdStar,
  MdEmail
} from "react-icons/md";

export default function AssignRider() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [showRiders, setShowRiders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Mock Orders Data
  const orders = [
    {
      id: "ORD-1001",
      customer: "Ahmed Mohamed",
      phone: "+252 61 123 4567",
      address: "Maka Al-Mukarama Rd, Mogadishu",
      items: 3,
      total: 49.99,
      priority: "high",
      status: "pending",
      time: "10-15 min",
      distance: "2.5 km",
      coordinates: { lat: 2.0469, lng: 45.3182 },
      notes: "Fragile items, handle with care"
    },
    {
      id: "ORD-1002",
      customer: "Fatima Ali",
      phone: "+252 61 987 6543",
      address: "Hodan District, Mogadishu",
      items: 5,
      total: 89.50,
      priority: "medium",
      status: "pending",
      time: "20-25 min",
      distance: "4.2 km",
      coordinates: { lat: 2.0392, lng: 45.3189 },
      notes: "Call before delivery"
    },
    {
      id: "ORD-1003",
      customer: "Omar Hassan",
      phone: "+252 61 555 1234",
      address: "Waberi, Mogadishu",
      items: 2,
      total: 29.99,
      priority: "low",
      status: "pending",
      time: "15-20 min",
      distance: "3.1 km",
      coordinates: { lat: 2.0421, lng: 45.3205 },
      notes: "Apartment building, 3rd floor"
    },
    {
      id: "ORD-1004",
      customer: "Aisha Abdi",
      phone: "+252 61 777 8888",
      address: "Shangani, Mogadishu",
      items: 8,
      total: 120.75,
      priority: "high",
      status: "assigned",
      time: "30-35 min",
      distance: "5.8 km",
      coordinates: { lat: 2.0493, lng: 45.3217 },
      notes: "VIP customer - priority delivery"
    },
  ];

  // Mock Riders Data
  const riders = [
    {
      id: "RDR-001",
      name: "Mohamed Jama",
      phone: "+252 61 111 2222",
      vehicle: "Motorcycle",
      rating: 4.8,
      deliveries: 127,
      status: "available",
      currentLocation: "Hodan",
      distance: "1.2 km",
      eta: "5 min"
    },
    {
      id: "RDR-002",
      name: "Abdiwali Ahmed",
      phone: "+252 61 333 4444",
      vehicle: "Bicycle",
      rating: 4.6,
      deliveries: 89,
      status: "available",
      currentLocation: "Waberi",
      distance: "0.8 km",
      eta: "3 min"
    },
    {
      id: "RDR-003",
      name: "Hassan Omar",
      phone: "+252 61 555 6666",
      vehicle: "Motorcycle",
      rating: 4.9,
      deliveries: 156,
      status: "busy",
      currentLocation: "Shangani",
      distance: "2.5 km",
      eta: "8 min"
    },
    {
      id: "RDR-004",
      name: "Jamal Yusuf",
      phone: "+252 61 777 8888",
      vehicle: "Motorcycle",
      rating: 4.7,
      deliveries: 112,
      status: "available",
      currentLocation: "Maka Al-Mukarama",
      distance: "0.5 km",
      eta: "2 min"
    },
  ];

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.address.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter available riders
  const availableRiders = riders.filter(rider => rider.status === "available");

  // Handle rider assignment
  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAssignSuccess(true);
      setShowRiders(false);
      setSelectedRider(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setAssignSuccess(false);
        setSelectedOrder(null);
      }, 3000);
    }, 1500);
  };

  // Reset selection
  const handleReset = () => {
    setSelectedOrder(null);
    setSelectedRider(null);
    setShowRiders(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Assign Rider
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Assign delivery riders to pending orders
            </p>
          </div>
          
          {selectedOrder && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
            >
              <MdArrowBack /> Back to Orders
            </button>
          )}
        </div>

        {/* Success Message */}
        {assignSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-2xl text-green-600 animate-bounce" />
              <div>
                <p className="font-semibold text-green-800">Rider Assigned Successfully!</p>
                <p className="text-sm text-green-600">
                  Rider {selectedRider?.name} has been assigned to {selectedOrder?.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Orders List */}
        {!selectedOrder ? (
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
                    placeholder="Search orders by ID, customer, or address..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["all", "pending", "assigned"].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                        statusFilter === status
                          ? status === "pending" 
                            ? "bg-blue-600 text-white"
                            : status === "assigned"
                            ? "bg-green-600 text-white"
                            : "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "All Orders" : 
                       status === "pending" ? "Pending" : "Assigned"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`bg-gradient-to-br from-white to-gray-50 border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] animate-fade-in-delay ${
                      order.priority === "high" 
                        ? "border-l-4 border-l-red-500" 
                        : order.priority === "medium"
                        ? "border-l-4 border-l-yellow-500"
                        : "border-l-4 border-l-green-500"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {order.status === "pending" ? "Awaiting Rider" : "Assigned"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdLocationOn className="text-blue-600 flex-shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdPhone className="text-green-600 flex-shrink-0" />
                        <span>{order.phone}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <MdAccessTime className="text-purple-600" />
                          <span className="font-medium">{order.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MdDeliveryDining className="text-orange-600" />
                          <span className="font-bold text-blue-700">${order.total}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                      <MdDirectionsBike /> Assign Rider
                    </button>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <MdSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No orders found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Right Column - Order Details and Rider Selection */
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Details Card */}
              <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Order Details</h2>
                  <span className={`px-4 py-2 rounded-full font-semibold ${
                    selectedOrder.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : selectedOrder.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {selectedOrder.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <MdPerson className="text-blue-600 text-xl" />
                        <h3 className="font-semibold text-gray-800">Customer</h3>
                      </div>
                      <p className="text-lg font-bold">{selectedOrder.customer}</p>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <MdPhone className="text-green-600" /> {selectedOrder.phone}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <MdEmail className="text-purple-600" /> customer@email.com
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <MdLocationOn className="text-green-600 text-xl" />
                        <h3 className="font-semibold text-gray-800">Delivery Info</h3>
                      </div>
                      <p className="text-gray-700">{selectedOrder.address}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <MdAccessTime /> {selectedOrder.time}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <MdMap /> {selectedOrder.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Items: <span className="font-semibold">{selectedOrder.items} items</span></p>
                        <p className="text-gray-600">Status: <span className="font-semibold text-blue-600">Pending Assignment</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-700">${selectedOrder.total}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Special Notes */}
                  {selectedOrder.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MdInfo className="text-yellow-600" />
                        <h3 className="font-semibold text-gray-800">Special Instructions</h3>
                      </div>
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Riders Selection Card */}
              <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Available Riders</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {availableRiders.length} Available
                  </span>
                </div>

                {!showRiders ? (
                  <div className="text-center py-12">
                    <MdTwoWheeler className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                    <h3 className="text-xl font-bold text-gray-700 mb-3">Ready to Assign?</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Click the button below to view available riders near {selectedOrder.address}
                    </p>
                    <button
                      onClick={() => setShowRiders(true)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                      <MdDirectionsBike className="text-xl" />
                      View Available Riders
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableRiders.map((rider, index) => (
                      <div
                        key={rider.id}
                        className={`border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                          selectedRider?.id === rider.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedRider(rider)}
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {rider.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{rider.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{rider.vehicle}</span>
                                <div className="flex items-center gap-1">
                                  <MdStar className="text-yellow-500" />
                                  <span className="font-semibold">{rider.rating}</span>
                                  <span className="text-gray-500 text-sm">({rider.deliveries})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              {rider.status}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{rider.distance} away</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdPhone className="text-green-600" />
                            <span>{rider.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdLocationOn className="text-blue-600" />
                            <span>{rider.currentLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdAccessTime className="text-purple-600" />
                            <span className="font-semibold">ETA: {rider.eta}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MdDeliveryDining className="text-orange-600" />
                            <span>{rider.deliveries} deliveries</span>
                          </div>
                        </div>

                        {selectedRider?.id === rider.id && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-expand">
                            <p className="text-blue-800 font-medium flex items-center gap-2">
                              <MdCheckCircle className="text-green-600" />
                              Selected for assignment
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Assign Button */}
                    {selectedRider && (
                      <div className="sticky bottom-0 pt-4 bg-white border-t mt-6">
                        <button
                          onClick={handleAssignRider}
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                          {isLoading ? (
                            <>
                              <MdRefresh className="animate-spin" />
                              Assigning Rider...
                            </>
                          ) : (
                            <>
                              <MdSend />
                              Assign {selectedRider.name} to {selectedOrder.id}
                            </>
                          )}
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-2">
                          Rider will receive notification immediately
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Sidebar */}
        {!selectedOrder && (
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <h3 className="font-bold text-gray-800 mb-4">Delivery Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Pending Assignments</span>
                  <span className="font-bold text-blue-600 text-xl">3</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Available Riders</span>
                  <span className="font-bold text-green-600 text-xl">5</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-bold text-purple-600 text-xl">2.3 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-bold text-green-600 text-xl">98.7%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2">
                  <MdRefresh /> Refresh List
                </button>
                <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2">
                  <MdDirectionsBike /> View All Riders
                </button>
                <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2">
                  <MdMap /> View Delivery Map
                </button>
              </div>
            </div>
          </div>
        )}
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
          to { opacity: 1; max-height: 200px; }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-expand { animation: expand 0.3s ease-out; }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  MdLocationOn,
  MdAttachMoney,
  MdLocalShipping,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdClose,
  MdRefresh,
  MdDownload,
  MdUpload,
  MdInfo,
  MdWarning,
  MdMap,
  MdAccessTime,
  MdArrowUpward,
  MdArrowDownward,
  MdFilterList,
  MdSearch
} from "react-icons/md";

export default function DeliveryFees() {
  const [zones, setZones] = useState([]);
  const [activeZone, setActiveZone] = useState(null);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState({
    name: "",
    cities: [],
    fee: 0,
    freeThreshold: 0,
    estimatedDays: "1-3",
    status: "active"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({});

  // Initial delivery zones data
  const initialZones = [
    {
      id: "ZONE-001",
      name: "Mogadishu Metro",
      cities: ["Mogadishu", "Daynile", "Abdiaziz", "Hodan", "Hawlwadag"],
      fee: 3.00,
      freeThreshold: 30.00,
      estimatedDays: "1-2",
      orders: 245,
      revenue: 735.00,
      status: "active",
      createdAt: "2024-01-15"
    },
    {
      id: "ZONE-002",
      name: "Central Somalia",
      cities: ["Beledweyne", "Jowhar", "Adado", "Dhusamareb"],
      fee: 5.50,
      freeThreshold: 50.00,
      estimatedDays: "2-4",
      orders: 128,
      revenue: 704.00,
      status: "active",
      createdAt: "2024-02-10"
    },
    {
      id: "ZONE-003",
      name: "Northern Region",
      cities: ["Hargeisa", "Berbera", "Burao", "Borama"],
      fee: 8.00,
      freeThreshold: 75.00,
      estimatedDays: "3-5",
      orders: 89,
      revenue: 712.00,
      status: "active",
      createdAt: "2024-03-05"
    },
    {
      id: "ZONE-004",
      name: "Southern Coastal",
      cities: ["Kismayo", "Merka", "Barawe", "Jamaame"],
      fee: 7.00,
      freeThreshold: 60.00,
      estimatedDays: "2-4",
      orders: 67,
      revenue: 469.00,
      status: "active",
      createdAt: "2024-01-30"
    },
    {
      id: "ZONE-005",
      name: "International",
      cities: ["Djibouti", "Nairobi", "Dubai", "London"],
      fee: 25.00,
      freeThreshold: 200.00,
      estimatedDays: "7-14",
      orders: 42,
      revenue: 1050.00,
      status: "active",
      createdAt: "2024-04-15"
    },
    {
      id: "ZONE-006",
      name: "Baidoa Region",
      cities: ["Baidoa", "Burdhubo", "Dinsor"],
      fee: 6.50,
      freeThreshold: 55.00,
      estimatedDays: "2-4",
      orders: 56,
      revenue: 364.00,
      status: "inactive",
      createdAt: "2024-05-20"
    }
  ];

  useEffect(() => {
    setZones(initialZones);
    calculateStats();
  }, []);

  const calculateStats = () => {
    const totalZones = initialZones.length;
    const activeZones = initialZones.filter(z => z.status === "active").length;
    const totalRevenue = initialZones.reduce((sum, zone) => sum + zone.revenue, 0);
    const totalOrders = initialZones.reduce((sum, zone) => sum + zone.orders, 0);
    const avgFee = initialZones.reduce((sum, zone) => sum + zone.fee, 0) / totalZones;

    setStats({
      totalZones,
      activeZones,
      totalRevenue,
      totalOrders,
      avgFee: avgFee.toFixed(2),
      mostPopular: initialZones.sort((a, b) => b.orders - a.orders)[0]?.name || "N/A"
    });
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddZone = () => {
    if (!zoneForm.name || zoneForm.fee <= 0) {
      alert("Please fill in required fields");
      return;
    }

    const newZone = {
      id: `ZONE-${(zones.length + 1001).toString().padStart(3, '0')}`,
      ...zoneForm,
      orders: 0,
      revenue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? newZone : z));
    } else {
      setZones([...zones, newZone]);
    }

    resetZoneForm();
    setShowZoneForm(false);
    calculateStats();
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      cities: [...zone.cities],
      fee: zone.fee,
      freeThreshold: zone.freeThreshold,
      estimatedDays: zone.estimatedDays,
      status: zone.status
    });
    setShowZoneForm(true);
  };

  const handleDeleteZone = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery zone?")) {
      setZones(zones.filter(z => z.id !== id));
      if (activeZone?.id === id) {
        setActiveZone(null);
      }
      calculateStats();
    }
  };

  const resetZoneForm = () => {
    setZoneForm({
      name: "",
      cities: [],
      fee: 0,
      freeThreshold: 0,
      estimatedDays: "1-3",
      status: "active"
    });
    setEditingZone(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Delivery Fees & Zones
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Manage delivery zones, fees, and shipping rates
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowZoneForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
            >
              <MdAdd /> Add New Zone
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <MdDownload /> Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { 
              label: "Total Zones", 
              value: stats.totalZones || 0, 
              icon: <MdLocationOn className="text-2xl" />,
              color: "from-blue-500 to-blue-600",
              trend: "+2"
            },
            { 
              label: "Active Zones", 
              value: stats.activeZones || 0, 
              icon: <MdCheckCircle className="text-2xl" />,
              color: "from-green-500 to-green-600",
              trend: "+1"
            },
            { 
              label: "Total Delivery Revenue", 
              value: formatCurrency(stats.totalRevenue || 0), 
              icon: <MdAttachMoney className="text-2xl" />,
              color: "from-purple-500 to-purple-600",
              trend: "+15%"
            },
            { 
              label: "Avg Delivery Fee", 
              value: formatCurrency(stats.avgFee || 0), 
              icon: <MdLocalShipping className="text-2xl" />,
              color: "from-orange-500 to-orange-600",
              trend: "-0.5"
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
        {/* Left Column - Zones List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search zones by name or city..."
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2">
                  <MdFilterList /> Filter
                </button>
              </div>
            </div>

            {/* Zones Grid */}
            <div className="space-y-4">
              {filteredZones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`bg-gradient-to-br from-white to-gray-50 border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.01] animate-fade-in-delay ${
                    activeZone?.id === zone.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setActiveZone(zone)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          zone.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          <MdLocationOn />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-800">{zone.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              zone.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {zone.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {zone.cities.slice(0, 3).join(", ")}
                            {zone.cities.length > 3 && ` +${zone.cities.length - 3} more`}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-600">Delivery Fee</p>
                          <p className="font-bold text-blue-700">{formatCurrency(zone.fee)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600">Free Over</p>
                          <p className="font-medium text-green-700">{formatCurrency(zone.freeThreshold)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600">Est. Delivery</p>
                          <p className="font-medium">{zone.estimatedDays} days</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600">Total Orders</p>
                          <p className="font-medium">{zone.orders}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditZone(zone);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Zone"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteZone(zone.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Zone"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredZones.length === 0 && (
                <div className="text-center py-12">
                  <MdLocationOn className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No zones found</h3>
                  <p className="text-gray-500">Try adjusting your search or create a new zone</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Zone Details & Form */}
        <div className="space-y-6">
          {/* Zone Details or Form */}
          {showZoneForm ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingZone ? "Edit Zone" : "Add New Zone"}
                </h2>
                <button
                  onClick={() => {
                    setShowZoneForm(false);
                    resetZoneForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    value={zoneForm.name}
                    onChange={(e) => setZoneForm({...zoneForm, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Mogadishu Metro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={zoneForm.cities.join(", ")}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      cities: e.target.value.split(",").map(city => city.trim()).filter(city => city)
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Mogadishu, Daynile, Hodan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={zoneForm.fee}
                        onChange={(e) => setZoneForm({...zoneForm, fee: parseFloat(e.target.value) || 0})}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Shipping Over
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={zoneForm.freeThreshold}
                        onChange={(e) => setZoneForm({...zoneForm, freeThreshold: parseFloat(e.target.value) || 0})}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Days
                  </label>
                  <input
                    type="text"
                    value={zoneForm.estimatedDays}
                    onChange={(e) => setZoneForm({...zoneForm, estimatedDays: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., 1-3 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={zoneForm.status}
                    onChange={(e) => setZoneForm({...zoneForm, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowZoneForm(false);
                      resetZoneForm();
                    }}
                    className="flex-1 py-2.5 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddZone}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingZone ? "Update Zone" : "Add Zone"}
                  </button>
                </div>
              </div>
            </div>
          ) : activeZone ? (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Zone Details</h2>
                <button
                  onClick={() => setActiveZone(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose />
                </button>
              </div>

              <div className="space-y-6">
                {/* Zone Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
                    <MdLocationOn className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{activeZone.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      activeZone.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {activeZone.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Zone Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Zone Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-bold text-blue-700">{formatCurrency(activeZone.fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Free Shipping Over:</span>
                      <span className="font-medium text-green-700">{formatCurrency(activeZone.freeThreshold)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{activeZone.estimatedDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{activeZone.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Cities in Zone</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeZone.cities.map((city, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Zone Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{activeZone.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Revenue</p>
                      <p className="text-2xl font-bold text-blue-700">{formatCurrency(activeZone.revenue)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEditZone(activeZone)}
                    className="py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <MdEdit /> Edit Zone
                  </button>
                  <button
                    onClick={() => handleDeleteZone(activeZone.id)}
                    className="py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
              <div className="text-center py-8">
                <MdMap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Zone</h3>
                <p className="text-gray-600">
                  Click on any zone to view detailed information
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Delivery Overview</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Most Popular Zone</span>
                  <span className="font-bold text-blue-700">{stats.mostPopular || "N/A"}</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Orders</span>
                  <span className="font-bold text-green-700">{stats.totalOrders || 0}</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Revenue Per Order</span>
                  <span className="font-bold text-purple-700">
                    {stats.totalOrders > 0 ? formatCurrency(stats.totalRevenue / stats.totalOrders) : "$0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowZoneForm(true)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                <MdAdd /> Add New Zone
              </button>
              <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2">
                <MdDownload /> Export Zones
              </button>
              <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2">
                <MdUpload /> Bulk Import
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
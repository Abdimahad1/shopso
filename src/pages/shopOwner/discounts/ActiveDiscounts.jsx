import { useState, useEffect } from "react";
import { 
  MdSearch, 
  MdAdd, 
  MdCalendarToday, 
  MdContentCopy,
  MdAttachMoney,
  MdPercent,
  MdCheckCircle,
  MdTimer,
  MdCancel,
  MdFilterList,
  MdArrowDropDown
} from "react-icons/md";

export default function ActiveDiscounts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [discounts, setDiscounts] = useState([]);
  const [stats, setStats] = useState({
    totalDiscounts: 0,
    activeDiscounts: 0,
    totalUsage: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch discounts from API
  const fetchDiscounts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let query = `page=${page}&limit=12`;
      if (search) query += `&search=${search}`;
      if (statusFilter !== "all") query += `&status=${statusFilter}`;
      if (typeFilter !== "all") query += `&type=${typeFilter}`;

      const response = await fetch(`${API_URL}/discounts?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setDiscounts(result.data);
        setCurrentPage(result.pagination.page);
        setTotalPages(result.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/discounts/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchStats();
  }, [search, statusFilter, typeFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/discounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Discount deleted successfully!');
        fetchDiscounts(currentPage);
        fetchStats();
        setSelectedDiscount(null);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      alert('Failed to delete discount. Please try again.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/discounts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Discount status updated!');
        fetchDiscounts(currentPage);
        fetchStats();
        setSelectedDiscount(null);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      alert('Failed to update discount. Please try again.');
    }
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "active": return <MdCheckCircle className="text-green-600" />;
      case "upcoming": return <MdTimer className="text-blue-600" />;
      case "expired": return <MdCancel className="text-gray-400" />;
      case "paused": return <MdCancel className="text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-gray-100 text-gray-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Active Discounts</h1>
              <p className="text-gray-600">Manage your discount offers</p>
            </div>
            
            <button 
              onClick={() => window.location.href = '/shop/discounts/new'}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MdAdd />
              Create Discount
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search discounts..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 appearance-none pr-10"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                  <option value="paused">Paused</option>
                </select>
                <MdArrowDropDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 appearance-none pr-10"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
                <MdArrowDropDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { 
              label: "Total Discounts", 
              value: stats.totalDiscounts || 0, 
              bg: "bg-blue-50", 
              border: "border-blue-200",
              text: "text-blue-900" 
            },
            { 
              label: "Active Now", 
              value: stats.activeDiscounts || 0, 
              bg: "bg-green-50", 
              border: "border-green-200",
              text: "text-green-900" 
            },
            { 
              label: "Total Used", 
              value: stats.totalUsage || 0, 
              bg: "bg-blue-50", 
              border: "border-blue-200",
              text: "text-blue-900" 
            },
            { 
              label: "Revenue", 
              value: `$${(stats.totalRevenue || 0).toLocaleString()}`, 
              bg: "bg-green-50", 
              border: "border-green-200",
              text: "text-green-900" 
            }
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} border ${stat.border} rounded-lg p-4`}>
              <p className={`text-2xl font-bold mb-1 ${stat.text}`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading discounts...</p>
          </div>
        ) : (
          <>
            {/* Discount Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discounts.map((discount, index) => {
                const daysRemaining = getDaysRemaining(discount.endDate);
                const isGreenCard = index % 2 === 0; // Alternate colors
                
                return (
                  <div
                    key={discount._id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                      isGreenCard ? "border-green-200 hover:border-green-300" : "border-blue-200 hover:border-blue-300"
                    } hover:shadow-lg transition-all`}
                  >
                    {/* Card Header */}
                    <div className={`p-5 ${isGreenCard ? "bg-green-50" : "bg-blue-50"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(discount.status)}`}>
                            {getStatusIcon(discount.status)} {discount.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Circle Image */}
                        {discount.image && (
                          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-sm">
                            <img 
                              src={discount.image} 
                              alt={discount.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-lg text-blue-900 mb-1">{discount.name}</h3>
                      
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-3 py-1.5 rounded-lg text-sm border border-gray-200">
                          {discount.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(discount.code)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <MdContentCopy size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Discount Value */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {discount.type === "percentage" ? (
                            <MdPercent className="text-green-600 text-xl" />
                          ) : (
                            <MdAttachMoney className="text-green-600 text-xl" />
                          )}
                          <span className="text-2xl font-bold text-green-600">
                            {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">OFF</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className={`p-2 rounded ${isGreenCard ? "bg-green-50" : "bg-blue-50"}`}>
                          <p className="text-xs text-gray-600">Used</p>
                          <p className={`font-bold ${isGreenCard ? "text-green-700" : "text-blue-700"}`}>
                            {discount.usedCount || 0} times
                          </p>
                        </div>
                        <div className={`p-2 rounded ${isGreenCard ? "bg-blue-50" : "bg-green-50"}`}>
                          <p className="text-xs text-gray-600">Revenue</p>
                          <p className={`font-bold ${isGreenCard ? "text-blue-700" : "text-green-700"}`}>
                            ${(discount.revenueGenerated || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdCalendarToday size={16} />
                          <span>{formatDate(discount.endDate)}</span>
                        </div>
                        <span className={`font-medium ${
                          daysRemaining < 0 ? "text-gray-600" : 
                          daysRemaining < 7 ? "text-yellow-600" : 
                          "text-green-600"
                        }`}>
                          {daysRemaining > 0 ? `${daysRemaining}d left` : "Expired"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-5 pb-5 flex gap-2">
                      <button 
                        onClick={() => setSelectedDiscount(discount)}
                        className="flex-1 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleDelete(discount._id)}
                        className="px-4 py-2.5 rounded-lg font-medium bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {discounts.length === 0 && !loading && (
              <div className="col-span-3 text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <MdSearch className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No discounts found</h3>
                <p className="text-gray-500 mb-4">Try a different search term or create your first discount</p>
                <button 
                  onClick={() => window.location.href = '/shop/discounts/new'}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Your First Discount
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchDiscounts(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchDiscounts(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => fetchDiscounts(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Selected Discount Modal */}
        {selectedDiscount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-900">Discount Details</h3>
                  <button
                    onClick={() => setSelectedDiscount(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium text-blue-900">{selectedDiscount.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Code</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                        {selectedDiscount.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedDiscount.code)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <MdContentCopy size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Type & Value</label>
                    <p className="font-medium text-green-600">
                      {selectedDiscount.type === "percentage" 
                        ? `${selectedDiscount.value}% OFF` 
                        : `$${selectedDiscount.value} OFF`
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Used Count</label>
                      <p className="font-medium">{selectedDiscount.usedCount || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Revenue</label>
                      <p className="font-medium text-green-600">
                        ${(selectedDiscount.revenueGenerated || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Start Date</label>
                      <p className="font-medium">{formatDate(selectedDiscount.startDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Date</label>
                      <p className="font-medium">{formatDate(selectedDiscount.endDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDiscount.status)}`}>
                        {selectedDiscount.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newStatus = selectedDiscount.status === "active" ? "paused" : "active";
                          handleStatusUpdate(selectedDiscount._id, newStatus);
                        }}
                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {selectedDiscount.status === "active" ? "Pause Discount" : "Activate Discount"}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedDiscount._id)}
                        className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Discount Banner */}
        {discounts.length > 0 && (
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Ready to boost sales?</h3>
                  <p className="text-gray-600">Create new discount offers in minutes</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/shop/discounts/new'}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <MdAdd />
                  Create New Discount
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
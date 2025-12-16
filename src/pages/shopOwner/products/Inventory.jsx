import { useState, useEffect } from "react";
import {
  MdInventory,
  MdAdd,
  MdRemove,
  MdSearch,
  MdWarning,
  MdCategory,
  MdFilterAlt,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdRefresh,
} from "react-icons/md";
import axios from "axios";

export default function Inventory() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const [successToast, setSuccessToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = {
        search: search || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        lowStock: filterLowStock ? "true" : undefined,
        sortBy: "stock",
        sortOrder: "asc"
      };

      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setErrorToast("Failed to load inventory");
      setTimeout(() => setErrorToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, selectedCategory, filterLowStock]);

  // Image modal functions
  const openImageModal = (front, back) => {
    const images = [front];
    if (back) images.push(back);
    setModalImages(images);
    setModalIndex(0);
    setModalOpen(true);
  };

  const nextImage = () => {
    setModalIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  // Update stock via API
  const updateStock = async (productId, action, quantity = 1) => {
    try {
      setUpdatingStock(productId);
      const token = localStorage.getItem("token");
      
      const response = await axios.patch(
        `${API_BASE_URL}/products/${productId}/stock`,
        { action, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSuccessToast(`Stock updated: ${response.data.data.name} - ${response.data.data.stock} units`);
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      const errorMsg = error.response?.data?.message || "Failed to update stock";
      setErrorToast(errorMsg);
      setTimeout(() => setErrorToast(null), 3000);
    } finally {
      setUpdatingStock(null);
    }
  };

  // Calculate inventory stats
  const inventoryStats = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    lowStockItems: products.filter(p => p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  return (
    <div className="w-full mx-auto">
      {/* PAGE TITLE */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
          Inventory Management
        </h1>
        
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 mt-2 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <MdRefresh className="text-xl" />
          Refresh
        </button>
      </div>

      {/* INVENTORY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-up">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{inventoryStats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Total Stock</p>
          <p className="text-2xl font-bold text-gray-800">{inventoryStats.totalStock}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">{inventoryStats.lowStockItems}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 animate-slide-up">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* SEARCH */}
          <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl border shadow-sm w-full md:flex-1">
            <MdSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full ml-3 bg-transparent outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border shadow-sm">
            <MdCategory className="text-orange-500 text-xl" />
            <select
              className="bg-transparent outline-none text-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* LOW STOCK FILTER */}
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-sm transition
              ${
                filterLowStock
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-gray-50 text-gray-700"
              }
            `}
          >
            <MdFilterAlt className="text-xl" />
            Low Stock Only
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      )}

      {/* PRODUCT LIST */}
      {!loading && products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-lg">
            {search || selectedCategory !== "All" || filterLowStock 
              ? "No products match your filters." 
              : "No products in inventory. Add some products first!"}
          </p>
          <button
            onClick={() => (window.location.href = "/shop/products/add")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Products
          </button>
        </div>
      ) : !loading && (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className={`bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center animate-fade-in
              ${product.stock <= 5 ? "border-red-300 bg-red-50/30" : ""}`}
            >
              {/* LEFT: IMAGE + INFO */}
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <img
                  src={product.frontImage}
                  onClick={() => openImageModal(product.frontImage, product.backImage)}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-105 transition"
                />

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 flex items-center gap-1">
                    <MdCategory className="text-orange-500" />
                    {product.category?.name || "Uncategorized"}
                  </p>

                  <p className="text-gray-700 flex items-center gap-1 mt-1">
                    <MdInventory className="text-blue-500" />
                    Stock:{" "}
                    <span
                      className={`font-semibold ${
                        product.stock <= 5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </p>

                  {product.stock <= 5 && (
                    <p className="text-red-600 flex items-center gap-1 text-sm mt-1">
                      <MdWarning className="text-lg" /> 
                      {product.stock === 0 ? "Out of Stock" : "Low Stock Alert"}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT: STOCK CONTROL */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Quick Adjust</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(product._id, "add", 10)}
                      disabled={updatingStock === product._id}
                      className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +10
                    </button>
                    
                    <button
                      onClick={() => updateStock(product._id, "add", 1)}
                      disabled={updatingStock === product._id}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdAdd className="text-xl" />
                    </button>

                    <button
                      onClick={() => updateStock(product._id, "remove", 1)}
                      disabled={updatingStock === product._id || product.stock === 0}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdRemove className="text-xl" />
                    </button>
                    
                    <button
                      onClick={() => updateStock(product._id, "remove", 10)}
                      disabled={updatingStock === product._id || product.stock < 10}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -10
                    </button>
                  </div>
                </div>
                
                {/* Manual Stock Input */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Set Stock</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStock(product._id, "add", 50)}
                      disabled={updatingStock === product._id}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => window.location.href = `/shop/products/edit/${product._id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IMAGE MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-4 w-[90%] sm:w-[75%] md:w-[55%] lg:w-[40%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow transition active:scale-90 z-[10000]"
            >
              <MdClose className="text-2xl text-gray-800" />
            </button>

            <div className="relative flex items-center justify-center">
              {modalImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full shadow active:scale-90 transition z-[10000]"
                >
                  <MdChevronLeft className="text-3xl" />
                </button>
              )}

              <div className="w-full h-[300px] sm:h-[350px] md:h-[420px] flex items-center justify-center">
                <img
                  src={modalImages[modalIndex]}
                  className="max-w-full max-h-full object-contain rounded-xl pointer-events-none"
                  alt="Preview"
                />
              </div>

              {modalImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full shadow active:scale-90 transition z-[10000]"
                >
                  <MdChevronRight className="text-3xl" />
                </button>
              )}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {modalImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${modalIndex === i ? "bg-blue-600" : "bg-gray-300"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in z-50">
          {successToast}
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in z-50">
          {errorToast}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in .4s ease-out; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up .4s ease; }
      `}</style>
    </div>
  );
}
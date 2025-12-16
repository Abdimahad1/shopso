import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdFilterAlt,
  MdCategory,
  MdGridView,
  MdList,
  MdEdit,
  MdDelete,
  MdAddCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";
import axios from "axios";

export default function AllProducts() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const [deleteToast, setDeleteToast] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  // Fetch products from backend
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = {
        page,
        limit: 9,
        search: search || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        sortBy: "createdAt",
        sortOrder: "desc"
      };

      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalProducts(response.data.pagination?.total || 0);
        setCurrentPage(response.data.pagination?.page || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorToast("Failed to load products");
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
  }, [search, selectedCategory]);

  // Image modal functions
  const openImageModal = (front, back) => {
    const images = [front];
    if (back) images.push(back);
    setModalImages(images);
    setModalIndex(0);
    setModalOpen(true);
  };

  const prevImage = () => {
    setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setModalIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  };

  // Delete product
  const requestDelete = (product) => {
    setDeleteToast(product);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/products/${deleteToast._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessToast("Product deleted successfully");
        fetchProducts(currentPage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorToast(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteToast(null);
      setTimeout(() => {
        setSuccessToast(null);
        setErrorToast(null);
      }, 3000);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchProducts(page);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
            All Products
          </h1>
          <p className="text-gray-600 mt-1">{totalProducts} products total</p>
        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition active:scale-95"
          onClick={() => navigate("/shop/products/add")}
        >
          <MdAddCircle className="text-2xl" />
          Add Product
        </button>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 animate-slide-up">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* SEARCH INPUT */}
          <div className="flex items-center w-full md:flex-1 bg-gray-50 px-4 py-3 rounded-xl border shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <MdSearch className="text-xl text-gray-500" />
            <input
              type="text"
              placeholder="Search product..."
              className="w-full bg-transparent outline-none pl-3 text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border shadow-sm cursor-pointer">
            <MdCategory className="text-xl text-orange-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent outline-none text-gray-700"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border shadow-sm">
            <button
              onClick={() => setGridView(true)}
              className={`p-2 rounded-lg transition ${
                gridView ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
            >
              <MdGridView className="text-2xl" />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-2 rounded-lg transition ${
                !gridView ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
            >
              <MdList className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* PRODUCT LIST */}
      {!loading && products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
          <p className="text-gray-600 text-lg">No products found.</p>
          <button
            onClick={() => navigate("/shop/products/add")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Product
          </button>
        </div>
      ) : !loading && gridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-xl transition group"
            >
              {/* IMAGE CLICKABLE */}
              <img
                src={product.frontImage}
                onClick={() => openImageModal(product.frontImage, product.backImage)}
                className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-[1.02] transition cursor-pointer"
                alt={product.name}
              />

              {/* NAME */}
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h2>

              {/* CATEGORY */}
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MdCategory className="text-orange-500" /> 
                {product.category?.name || "Uncategorized"}
              </p>

              {/* PRICE + STOCK */}
              <div className="flex justify-between mt-4 text-gray-700">
                <span className="font-semibold">{formatCurrency(product.price)}</span>
                <span className={product.stock <= 5 ? "text-red-600 font-semibold" : ""}>
                  Stock: {product.stock}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  onClick={() => navigate(`/shop/products/edit/${product._id}`)}
                >
                  <MdEdit className="text-xl" />
                </button>
                <button
                  onClick={() => requestDelete(product)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        // LIST VIEW
        <div className="space-y-4 animate-fade-in">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <img
                  src={product.frontImage}
                  onClick={() => openImageModal(product.frontImage, product.backImage)}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                  alt={product.name}
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MdCategory className="text-orange-500" />
                    {product.category?.name || "Uncategorized"}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-gray-700 font-semibold">
                      {formatCurrency(product.price)}
                    </p>
                    <p className={`${product.stock <= 5 ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    onClick={() => navigate(`/shop/products/edit/${product._id}`)}
                  >
                    <MdEdit className="text-xl" />
                  </button>
                  <button
                    onClick={() => requestDelete(product)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronLeft className="text-2xl" />
          </button>
          
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronRight className="text-2xl" />
          </button>
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

      {/* DELETE CONFIRMATION TOAST */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl border border-gray-200 p-5 rounded-xl z-50 animate-fade-in w-72">
          <h2 className="text-lg font-bold text-gray-800">Delete Product?</h2>
          <p className="text-gray-600 mt-1">
            Are you sure you want to delete <b>{deleteToast.name}</b>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteToast(null)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete
            </button>
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
          from {opacity:0;}
          to {opacity:1;}
        }
        .animate-fade-in { animation: fade-in .3s ease-out; }
        
        @keyframes slide-up {
          from {opacity:0; transform: translateY(20px);}
          to {opacity:1; transform: translateY(0);}
        }
        .animate-slide-up { animation: slide-up .4s ease; }
      `}</style>
    </div>
  );
}
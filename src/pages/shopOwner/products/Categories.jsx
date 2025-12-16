import { useState, useEffect } from "react";
import {
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdCategory,
  MdSearch,
} from "react-icons/md";
import axios from "axios";

export default function Categories() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteToast, setDeleteToast] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrorToast("Failed to load categories");
      setTimeout(() => setErrorToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add or Update Category
  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) {
      setErrorToast("Category name is required");
      setTimeout(() => setErrorToast(null), 2000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (editingCategory) {
        // Update existing category
        const response = await axios.put(
          `${API_BASE_URL}/categories/${editingCategory._id}`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setSuccessToast("Category updated successfully");
          fetchCategories();
        }
      } else {
        // Create new category
        const response = await axios.post(
          `${API_BASE_URL}/categories`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setSuccessToast("Category created successfully");
          fetchCategories();
        }
      }

      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMsg = error.response?.data?.message || "Failed to save category";
      setErrorToast(errorMsg);
      setTimeout(() => setErrorToast(null), 3000);
    }
  };

  // Begin editing
  const startEditing = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
  };

  // Delete category
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/categories/${deleteToast._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccessToast("Category deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete category";
      setErrorToast(errorMsg);
    } finally {
      setDeleteToast(null);
      setTimeout(() => {
        setSuccessToast(null);
        setErrorToast(null);
      }, 3000);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
        Product Categories
      </h1>

      {/* ADD/UPDATE CATEGORY */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6 animate-slide-up">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MdCategory className="text-orange-500 text-2xl" />{" "}
          {editingCategory ? "Update Category" : "Add New Category"}
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter category name..."
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button
            className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleCategorySubmit}
            disabled={!categoryName.trim()}
          >
            <MdAddCircle className="text-2xl" />
            {editingCategory ? "Update" : "Add"}
          </button>
          
          {editingCategory && (
            <button
              className="flex items-center gap-2 px-5 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition active:scale-95"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border shadow-sm mb-4">
        <MdSearch className="text-xl text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full bg-transparent outline-none text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      )}

      {/* CATEGORY LIST */}
      {!loading && (
        <div className="space-y-4 animate-fade-in">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">
                {categories.length === 0 ? "No categories yet. Add your first category!" : "No categories found."}
              </p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div
                key={cat._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center justify-between hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {cat.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {cat.productCount || 0} Product{cat.productCount !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startEditing(cat)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <MdEdit className="text-xl" />
                  </button>

                  <button
                    onClick={() => setDeleteToast(cat)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cat.productCount > 0}
                    title={cat.productCount > 0 ? "Cannot delete: category has products" : "Delete category"}
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl border border-gray-200 p-5 rounded-xl z-50 animate-fade-in w-72">
          <h2 className="text-lg font-bold text-gray-800">Delete Category?</h2>
          <p className="text-gray-600 mt-1">
            Are you sure you want to delete{" "}
            <b>{deleteToast.name}</b>?
          </p>
          {deleteToast.productCount > 0 && (
            <p className="text-red-600 text-sm mt-2">
              ⚠️ Cannot delete: {deleteToast.productCount} product(s) in this category
            </p>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteToast(null)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteToast.productCount > 0}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in .3s ease-out; }

        @keyframes slide-up {
          from {opacity:0; transform: translateY(20px);}
          to {opacity:1; transform: translateY(0);}
        }
        .animate-slide-up { animation: slide-up .4s ease-out; }
      `}</style>
    </div>
  );
}
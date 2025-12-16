import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdAddPhotoAlternate,
  MdCategory,
  MdInventory,
  MdAttachMoney,
  MdTitle,
  MdDescription,
  MdCheckCircle,
  MdError,
  MdAddCircle,
  MdInfo,
  MdArrowBack,
} from "react-icons/md";
import axios from "axios";

// Toast Component
function Toast({ type = "success", message, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border
        ${
          type === "success"
            ? "bg-green-50 border-green-300 text-green-800"
            : "bg-red-50 border-red-300 text-red-800"
        }
      `}
      >
        {type === "success" ? (
          <MdCheckCircle className="text-2xl text-green-600" />
        ) : (
          <MdError className="text-2xl text-red-600" />
        )}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 font-bold">
          ×
        </button>
      </div>
    </div>
  );
}

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [backImagePreview, setBackImagePreview] = useState(null);
  const [existingImages, setExistingImages] = useState({ front: null, back: null });

  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch product data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchProductData();
    }
  }, [id]);

  // Fetch product data
  const fetchProductData = async () => {
    try {
      setFetchingProduct(true);
      const token = localStorage.getItem("token");
      
      console.log("Fetching product with ID:", id);
      console.log("Using token:", token ? "Token exists" : "No token");
      
      const response = await axios.get(`${API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product fetch response:", response.data);

      if (response.data.success) {
        const product = response.data.data;
        
        // Populate form with product data
        setName(product.name || "");
        setCategory(product.category?._id || "");
        setPrice(product.price?.toString() || "");
        setStock(product.stock?.toString() || "");
        setDescription(product.description || "");
        
        // Set existing images for preview
        setExistingImages({
          front: product.frontImage,
          back: product.backImage
        });
        
        // Set image previews from existing URLs
        if (product.frontImage) {
          setFrontImagePreview(product.frontImage);
        }
        if (product.backImage) {
          setBackImagePreview(product.backImage);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Failed to load product data";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setToast({
        type: "error",
        msg: errorMessage,
      });
      
      // If 403 Forbidden, it's an ownership issue
      if (error.response?.status === 403) {
        setTimeout(() => {
          navigate("/shop/products/all");
        }, 2000);
      }
    } finally {
      setFetchingProduct(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCategories(response.data.data);
        if (response.data.data.length === 0) {
          setShowCategoryForm(true);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setToast({
        type: "error",
        msg: "Failed to load categories. Please try again.",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setToast({ type: "error", msg: "Category name is required" });
      return;
    }

    try {
      setCreatingCategory(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        { name: newCategoryName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          type: "success",
          msg: "Category created successfully!",
        });
        
        setNewCategoryName("");
        await fetchCategories();
        setShowCategoryForm(false);
        
        if (response.data.data && response.data.data._id) {
          setCategory(response.data.data._id);
        }
      }
    } catch (error) {
      console.error("Error creating category:", error);
      let errorMessage = "Failed to create category";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setToast({
        type: "error",
        msg: errorMessage,
      });
    } finally {
      setCreatingCategory(false);
    }
  };

  // Handlers for front/back images
  const handleFrontUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontImageFile(file);
      setFrontImagePreview(URL.createObjectURL(file));
      setExistingImages(prev => ({ ...prev, front: null }));
    }
  };

  const handleBackUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackImageFile(file);
      setBackImagePreview(URL.createObjectURL(file));
      setExistingImages(prev => ({ ...prev, back: null }));
    }
  };

  const validate = () => {
    if (!name.trim()) {
      setToast({ type: "error", msg: "Product name is required" });
      return false;
    }
    if (!category) {
      setToast({ type: "error", msg: "Category is required" });
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      setToast({ type: "error", msg: "Valid price is required" });
      return false;
    }
    if (!stock || parseInt(stock) < 0) {
      setToast({ type: "error", msg: "Valid stock quantity is required" });
      return false;
    }
    if (!isEditing && !frontImageFile) {
      setToast({ type: "error", msg: "Front image is required for new products" });
      return false;
    }
    if (isEditing && !existingImages.front && !frontImageFile) {
      setToast({ type: "error", msg: "Front image is required" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("description", description);
      
      if (frontImageFile) {
        formData.append("frontImage", frontImageFile);
      }
      
      if (backImageFile) {
        formData.append("backImage", backImageFile);
      }

      let response;
      
      if (isEditing) {
        console.log("Updating product with ID:", id);
        response = await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        console.log("Creating new product");
        response = await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Product save response:", response.data);

      if (response.data.success) {
        setToast({
          type: "success",
          msg: isEditing 
            ? "Product updated successfully!" 
            : "Product created successfully!",
        });

        if (!isEditing) {
          // Reset form only for new products
          setName("");
          setCategory("");
          setPrice("");
          setStock("");
          setDescription("");
          setFrontImageFile(null);
          setBackImageFile(null);
          setFrontImagePreview(null);
          setBackImagePreview(null);
          setExistingImages({ front: null, back: null });
          
          document.querySelectorAll('input[type="file"]').forEach(input => {
            input.value = "";
          });
        }
        
        setTimeout(() => {
          navigate("/shop/products/all");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = isEditing ? "Failed to update product" : "Failed to create product";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setToast({
        type: "error",
        msg: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching product data
  if (isEditing && fetchingProduct) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/shop/products/all")}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <MdArrowBack className="text-xl text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
              {isEditing ? "Edit Product" : "Create a New Product"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Update your product details" : "Add a new product to your store"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-slide-up">
        {/* NO CATEGORIES WARNING */}
        {!loadingCategories && categories.length === 0 && !showCategoryForm && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <MdInfo className="text-2xl text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  No Categories Found
                </h3>
                <p className="text-yellow-700 mb-3">
                  You need to create a category first before adding products.
                  Categories help organize your products.
                </p>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <MdAddCircle className="text-lg" />
                  Create Your First Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUICK CATEGORY CREATION FORM */}
        {showCategoryForm && (
          <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <MdCategory className="text-blue-600" />
              Create a New Category
            </h3>
            <p className="text-blue-700 mb-4">
              Create a category to organize your products (e.g., "Electronics", "Clothing", "Food").
            </p>
            
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter category name (e.g., Electronics)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {creatingCategory ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <MdAddCircle className="text-lg" />
                  )}
                  {creatingCategory ? "Creating..." : "Create Category"}
                </button>
                
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-3 rounded-lg shadow transition active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* FRONT IMAGE */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Front Image {!isEditing && "*"}
              {isEditing && existingImages.front && (
                <span className="text-sm text-green-600 font-normal ml-2">
                  (Current image will be kept unless replaced)
                </span>
              )}
            </label>
            <label className="w-full cursor-pointer">
              <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center">
                  {frontImagePreview || existingImages.front ? (
                    <>
                      <img
                        src={frontImagePreview || existingImages.front}
                        alt="Front Preview"
                        className="w-32 h-32 object-cover rounded-xl shadow-md mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        {frontImageFile?.name || "Existing image"}
                      </p>
                      {isEditing && existingImages.front && !frontImageFile && (
                        <p className="text-xs text-blue-500 mt-1">
                          Click to replace current image
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <MdAddPhotoAlternate className="text-5xl text-blue-500" />
                      <p className="text-gray-600 mt-3">
                        {isEditing ? "Upload New Front Image (Optional)" : "Upload Front Image (Required)"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports: JPEG, JPG, PNG, WebP, GIF • Max 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFrontUpload}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                required={!isEditing}
              />
            </label>
          </div>

          {/* BACK IMAGE */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Back Image (Optional)
              {isEditing && existingImages.back && (
                <span className="text-sm text-green-600 font-normal ml-2">
                  (Current image will be kept unless replaced)
                </span>
              )}
            </label>
            <label className="w-full cursor-pointer">
              <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center">
                  {backImagePreview || existingImages.back ? (
                    <>
                      <img
                        src={backImagePreview || existingImages.back}
                        alt="Back Preview"
                        className="w-32 h-32 object-cover rounded-xl shadow-md mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        {backImageFile?.name || "Existing image"}
                      </p>
                      {isEditing && existingImages.back && !backImageFile && (
                        <p className="text-xs text-blue-500 mt-1">
                          Click to replace current image
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <MdAddPhotoAlternate className="text-5xl text-purple-500" />
                      <p className="text-gray-600 mt-3">
                        Upload Back Image (Optional)
                      </p>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleBackUpload}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              />
            </label>
          </div>

          {/* PRODUCT NAME */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-gray-700 font-medium">
              <MdTitle className="text-blue-500" /> Product Name *
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border shadow-sm 
              focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          {/* CATEGORY SECTION */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <MdCategory className="text-orange-500" /> Category *
              </label>
              
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <MdAddCircle className="text-base" />
                  {showCategoryForm ? "Hide Category Form" : "Add New Category"}
                </button>
              )}
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border shadow-sm bg-white focus:ring-2 focus:ring-orange-400 outline-none transition mb-3"
              disabled={loadingCategories || categories.length === 0}
              required
            >
              <option value="">{categories.length === 0 ? "No categories available" : "Select a category"}</option>
              {loadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            
            {loadingCategories && (
              <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
            )}
            
            {!loadingCategories && categories.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                You must create a category first before adding products.
              </p>
            )}
          </div>

          {/* QUICK CATEGORY CREATION FORM */}
          {showCategoryForm && categories.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in">
              <h4 className="font-medium text-gray-700 mb-2">Add Another Category</h4>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingCategory ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <MdAddCircle className="text-base" />
                  )}
                  {creatingCategory ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-700 font-medium">
                <MdAttachMoney className="text-green-500" /> Price (USD) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-green-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-700 font-medium">
                <MdInventory className="text-purple-500" /> Stock Quantity *
              </label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
                required
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-gray-700 font-medium">
              <MdDescription className="text-pink-500" /> Description
            </label>
            <textarea
              placeholder="Write something about this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-pink-400 outline-none transition"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/shop/products/all")}
              className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold text-lg shadow transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              title={categories.length === 0 ? "Create a category first" : ""}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? "Updating..." : "Creating..."}
                </span>
              ) : categories.length === 0 ? (
                "Create a Category First"
              ) : (
                isEditing ? "Update Product" : "Create Product"
              )}
            </button>
          </div>

          {/* GUIDANCE NOTE */}
          {categories.length === 0 && !isEditing && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">
                <strong>Step 1:</strong> Create a category using the form above
                <br />
                <strong>Step 2:</strong> Fill in product details
                <br />
                <strong>Step 3:</strong> Upload images and submit
              </p>
            </div>
          )}
        </form>
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slide-in {
          from {opacity: 0; transform: translateX(20px);}
          to {opacity: 1; transform: translateX(0);}
        }
        .animate-slide-in { animation: slide-in .4s ease-out; }

        @keyframes slide-up {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-slide-up { animation: slide-up .4s ease-out; }

        @keyframes fade-in {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fade-in { animation: fade-in .6s ease-in; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
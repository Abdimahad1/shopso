import { useState, useEffect } from "react";
import {
  MdAdd,
  MdImage,
  MdCalendarToday,
  MdContentCopy,
  MdRefresh,
  MdArrowBack
} from "react-icons/md";

export default function CreateDiscount() {
  const [discountData, setDiscountData] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    value: 15,
    image: null,
    minOrder: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    usageLimit: "",
    customerType: "all",
    appliesTo: "all_products",
    categories: [],
    products: [],
    oneTimeUse: false,
    combineWithOther: true,
    excludeSaleItems: false
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch categories and products
  useEffect(() => {
    generateDiscountCode();
    
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setDiscountData(prev => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    }));

    // Fetch categories and products
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/categories?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const generateDiscountCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDiscountData(prev => ({ ...prev, code }));
  };

  const handleInputChange = (field, value) => {
    setDiscountData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDiscountData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      setDiscountData(prevData => ({
        ...prevData,
        categories: newCategories
      }));
      
      return newCategories;
    });
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      const newProducts = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      setDiscountData(prevData => ({
        ...prevData,
        products: newProducts
      }));
      
      return newProducts;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all fields
      Object.keys(discountData).forEach(key => {
        if (key === 'categories' || key === 'products') {
          if (discountData[key].length > 0) {
            formData.append(key, JSON.stringify(discountData[key]));
          }
        } else if (key === 'image' && discountData[key]) {
          formData.append('image', discountData[key]);
        } else if (discountData[key] !== '' && discountData[key] !== null) {
          formData.append(key, discountData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/discounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Discount created successfully!');
        
        // Reset form
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        setDiscountData({
          name: "",
          code: "",
          description: "",
          type: "percentage",
          value: 15,
          image: null,
          minOrder: 0,
          maxDiscount: 0,
          startDate: today.toISOString().split('T')[0],
          endDate: nextMonth.toISOString().split('T')[0],
          usageLimit: "",
          customerType: "all",
          appliesTo: "all_products",
          categories: [],
          products: [],
          oneTimeUse: false,
          combineWithOther: true,
          excludeSaleItems: false
        });
        
        setPreviewImage(null);
        setSelectedCategories([]);
        setSelectedProducts([]);
        generateDiscountCode();
        
        // Redirect to discounts page
        window.location.href = '/shop/discounts/active';
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      alert('Failed to create discount. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <MdArrowBack />
            Back to Discounts
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Create Discount</h1>
              <p className="text-gray-600">Create discount offers for your customers</p>
            </div>
            
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MdAdd className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Card - Left Side */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
              <h3 className="font-bold text-blue-900 mb-4">Preview</h3>
              
              {/* Discount Card Preview */}
              <div className="bg-white border-2 border-green-500 rounded-xl p-5">
                {/* Circle Image */}
                {previewImage && (
                  <div className="float-right ml-4 mb-4">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-200 overflow-hidden">
                      <img 
                        src={previewImage} 
                        alt="Discount" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="clear-right">
                  <h4 className="font-bold text-lg text-blue-900 mb-2">
                    {discountData.name || "Discount Name"}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {discountData.type === "percentage" ? "PERCENTAGE OFF" : "FIXED AMOUNT"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm">
                          {discountData.code || "CODE123"}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(discountData.code)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <MdContentCopy size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Use code at checkout</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {discountData.type === "percentage" ? `${discountData.value}%` : `$${discountData.value}`}
                      </p>
                      <p className="text-sm text-gray-600">OFF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-blue-900 mb-3">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Keep it simple</p>
                    <p className="text-sm text-gray-600">Use clear, descriptive names</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Add an image</p>
                    <p className="text-sm text-gray-600">Images increase engagement by 40%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Set clear dates</p>
                    <p className="text-sm text-gray-600">Create urgency with end dates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Right Side */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                {/* Basic Info */}
                <div className="mb-6">
                  <h3 className="font-bold text-blue-900 mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Discount Name *
                      </label>
                      <input
                        type="text"
                        value={discountData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        placeholder="e.g., Summer Sale"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Discount Code *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountData.code}
                          onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={generateDiscountCode}
                          className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <MdRefresh />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Description
                      </label>
                      <textarea
                        value={discountData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        rows="3"
                        placeholder="Describe your discount offer..."
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Value */}
                <div className="mb-6">
                  <h3 className="font-bold text-blue-900 mb-4">Discount Value</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('type', 'percentage')}
                          className={`flex-1 py-3 border rounded-lg ${discountData.type === "percentage" ? "bg-green-100 text-green-800 border-green-300" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                        >
                          Percentage
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('type', 'fixed')}
                          className={`flex-1 py-3 border rounded-lg ${discountData.type === "fixed" ? "bg-green-100 text-green-800 border-green-300" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                        >
                          Fixed
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Value *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={discountData.type === "percentage" ? "100" : "1000"}
                        value={discountData.value}
                        onChange={(e) => handleInputChange('value', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Minimum Order ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountData.minOrder}
                        onChange={(e) => handleInputChange('minOrder', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Max Discount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountData.maxDiscount}
                        onChange={(e) => handleInputChange('maxDiscount', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <h3 className="font-bold text-blue-900 mb-4">Discount Image</h3>
                  
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <MdImage className="text-2xl text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Upload an image (Optional)</p>
                    <p className="text-sm text-gray-500 mb-4">Recommended: Square image</p>
                    <label className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-6">
                  <h3 className="font-bold text-blue-900 mb-4">Validity Period</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Start Date *
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                        <MdCalendarToday className="text-blue-600 mr-2" />
                        <input
                          type="date"
                          value={discountData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-full focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        End Date *
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                        <MdCalendarToday className="text-blue-600 mr-2" />
                        <input
                          type="date"
                          value={discountData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="w-full focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={discountData.usageLimit}
                      onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                      placeholder="Leave empty for unlimited usage"
                    />
                  </div>
                </div>

                {/* Customer Type */}
                <div className="mb-6">
                  <h3 className="font-bold text-blue-900 mb-4">Customer Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Customer Type
                    </label>
                    <select
                      value={discountData.customerType}
                      onChange={(e) => handleInputChange('customerType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    >
                      <option value="all">All Customers</option>
                      <option value="new">New Customers Only</option>
                      <option value="returning">Returning Customers</option>
                      <option value="vip">VIP Customers Only</option>
                    </select>
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">One-Time Use per Customer</p>
                        <p className="text-sm text-gray-600">Limit discount to one use per customer</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('oneTimeUse', !discountData.oneTimeUse)}
                        className={`w-12 h-6 rounded-full transition ${discountData.oneTimeUse ? "bg-green-600" : "bg-gray-300"}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white transform transition ${discountData.oneTimeUse ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">Combine with Other Discounts</p>
                        <p className="text-sm text-gray-600">Allow stacking with other promotions</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('combineWithOther', !discountData.combineWithOther)}
                        className={`w-12 h-6 rounded-full transition ${discountData.combineWithOther ? "bg-green-600" : "bg-gray-300"}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white transform transition ${discountData.combineWithOther ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 text-white rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    isSubmitting ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <MdAdd className="text-xl" />
                      Create Discount
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
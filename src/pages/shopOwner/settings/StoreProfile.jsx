import { useState, useEffect } from "react";
import axios from "axios";
import {
  MdStore,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDescription,
  MdImage,
  MdVerified,
  MdEdit,
  MdSave,
  MdAdd,
  MdBusiness,
  MdWarning,
  MdRefresh,
  MdCheckCircle,
  MdError,
  MdPublic,
  MdShare,
  MdPerson,
  MdClose,
  MdCameraAlt,
  MdStar,
  MdDateRange,
  MdLink
} from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";

export default function StoreProfile() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State management
  const [storeData, setStoreData] = useState({
    name: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    established: new Date().getFullYear(),
    logo: null,
    bannerImage: null,
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      website: ""
    },
    statistics: {
      totalOrders: 0,
      totalRevenue: 0,
      averageRating: 0,
      customerCount: 0,
      productCount: 0,
      activeProducts: 0
    },
    isActive: true,
    isVerified: false,
    createdAt: "",
    yearsActive: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...storeData });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [validationErrors, setValidationErrors] = useState({});

  // Toast configuration
  const showToast = (message, type = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 4000,
          position: 'top-right',
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: 'white',
          },
        });
        break;
      case 'info':
        toast(message, {
          duration: 3000,
          position: 'top-right',
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: 'white',
          },
        });
        break;
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!editedData.name?.trim()) {
      errors.name = 'Store name is required';
    } else if (editedData.name.length < 2) {
      errors.name = 'Store name must be at least 2 characters';
    }
    
    if (editedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (editedData.established) {
      const year = parseInt(editedData.established);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        errors.established = `Year must be between 1900 and ${currentYear}`;
      }
    }
    
    // Validate social links
    const socialErrors = {};
    if (editedData.socialLinks?.website && !isValidUrl(editedData.socialLinks.website)) {
      socialErrors.website = 'Please enter a valid URL (https://example.com)';
    }
    if (editedData.socialLinks?.facebook && !isValidUrl(editedData.socialLinks.facebook)) {
      socialErrors.facebook = 'Please enter a valid Facebook URL';
    }
    if (editedData.socialLinks?.instagram && !isValidUrl(editedData.socialLinks.instagram)) {
      socialErrors.instagram = 'Please enter a valid Instagram URL';
    }
    if (editedData.socialLinks?.twitter && !isValidUrl(editedData.socialLinks.twitter)) {
      socialErrors.twitter = 'Please enter a valid Twitter URL';
    }
    
    if (Object.keys(socialErrors).length > 0) {
      errors.socialLinks = socialErrors;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Fetch store data on component mount
  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login to access store profile', 'error');
        return;
      }

      const response = await axios.get(`${API_URL}/stores/my-store`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const store = response.data.data;
        setStoreData(store);
        setEditedData(store);
        setHasStore(true);
        
        // Set image previews if they exist
        if (store.logoUrl) setLogoPreview(store.logoUrl);
        if (store.bannerUrl) setBannerPreview(store.bannerUrl);
        
        showToast('Store data loaded successfully', 'success');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasStore(false);
        showToast('No store found. Please create your store profile.', 'info');
      } else if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        showToast(error.response?.data?.message || 'Failed to load store data', 'error');
        console.error('Fetch store error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logo upload independently
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload an image (JPEG, PNG, WEBP, GIF, SVG)', 'error');
      return;
    }
    
    if (file.size > maxSize) {
      showToast('File too large. Maximum size is 2MB', 'error');
      return;
    }
    
    try {
      setUploadingLogo(true);
      const token = localStorage.getItem('token');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await axios.put(`${API_URL}/stores/my-store`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        setStoreData(response.data.data);
        setEditedData(response.data.data);
        showToast('Logo updated successfully!', 'success');
        setTimeout(() => fetchStoreData(), 500);
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      showToast(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to upload logo. Please try again.', 
        'error'
      );
      // Reset preview on error
      setLogoPreview(storeData.logoUrl);
    } finally {
      setUploadingLogo(false);
      e.target.value = ''; // Reset file input
    }
  };

  // Handle banner upload independently
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload an image (JPEG, PNG, WEBP, GIF, SVG)', 'error');
      return;
    }
    
    if (file.size > maxSize) {
      showToast('File too large. Maximum size is 5MB', 'error');
      return;
    }
    
    try {
      setUploadingBanner(true);
      const token = localStorage.getItem('token');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      const formData = new FormData();
      formData.append('bannerImage', file);
      
      const response = await axios.put(`${API_URL}/stores/my-store`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        setStoreData(response.data.data);
        setEditedData(response.data.data);
        showToast('Banner updated successfully!', 'success');
        setTimeout(() => fetchStoreData(), 500);
      }
    } catch (error) {
      console.error('Banner upload error:', error);
      showToast(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to upload banner. Please try again.', 
        'error'
      );
      // Reset preview on error
      setBannerPreview(storeData.bannerUrl);
    } finally {
      setUploadingBanner(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      showToast('Please fix the errors in the form before saving', 'warning');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Prepare the data to send
      const dataToSend = {
        name: editedData.name?.trim(),
        tagline: editedData.tagline?.trim(),
        description: editedData.description?.trim(),
        email: editedData.email?.trim(),
        phone: editedData.phone?.trim(),
        address: editedData.address?.trim(),
        established: editedData.established,
        socialLinks: editedData.socialLinks
      };

      // Remove empty values
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '' || dataToSend[key] === null || dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      // Remove empty social links
      if (dataToSend.socialLinks) {
        Object.keys(dataToSend.socialLinks).forEach(key => {
          if (!dataToSend.socialLinks[key]) {
            delete dataToSend.socialLinks[key];
          }
        });
      }

      const response = await axios.put(`${API_URL}/stores/my-store`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        const updatedStore = response.data.data;
        setStoreData(updatedStore);
        setEditedData(updatedStore);
        setHasStore(true);
        setIsEditing(false);
        setValidationErrors({});
        
        showToast(response.data.message || 'Store updated successfully!', 'success');
        
        // Refresh data after save
        setTimeout(() => fetchStoreData(), 500);
      }
    } catch (error) {
      console.error('Save store error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        showToast(error.response?.data?.message || 'Please check your input and try again', 'error');
      } else if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        showToast('Store not found. Please create a store first.', 'warning');
        setHasStore(false);
      } else {
        showToast(error.response?.data?.message || 'Failed to save store. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(storeData);
    setIsEditing(false);
    setValidationErrors({});
    showToast('Changes cancelled', 'info');
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditedData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    
    // Clear validation error for this social link
    if (validationErrors.socialLinks?.[platform]) {
      setValidationErrors(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: undefined
        }
      }));
    }
  };

  const handleCreateStore = async () => {
    if (!editedData.name?.trim()) {
      showToast('Store name is required', 'warning');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const dataToSend = {
        name: editedData.name.trim(),
        tagline: editedData.tagline?.trim() || '',
        description: editedData.description?.trim() || '',
        email: editedData.email?.trim() || '',
        phone: editedData.phone?.trim() || '',
        address: editedData.address?.trim() || '',
        established: editedData.established || new Date().getFullYear(),
      };

      const response = await axios.post(`${API_URL}/stores`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        showToast('Store created successfully!', 'success');
        setHasStore(true);
        setIsEditing(false);
        setTimeout(() => fetchStoreData(), 1000);
      }
    } catch (error) {
      console.error('Create store error:', error);
      showToast(
        error.response?.data?.message || 
        'Failed to create store. Please try again.', 
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store profile...</p>
        </div>
        <Toaster />
      </div>
    );
  }

  // If no store exists and not editing
  if (!hasStore && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 flex items-center justify-center">
        <Toaster />
        <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <MdStore className="text-3xl text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Store Found</h2>
          <p className="text-gray-600 mb-6">You haven't created a store profile yet. Create one to start selling!</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold mx-auto"
          >
            <MdAdd className="text-xl" /> Create Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <Toaster />
      
      {/* Header with Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl">
        {/* Banner Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative group">
          {bannerPreview || storeData.bannerUrl ? (
            <img 
              src={bannerPreview || storeData.bannerUrl} 
              alt="Store Banner" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('bg-gradient-to-r', 'from-indigo-500', 'via-purple-500', 'to-pink-500');
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <MdImage className="text-6xl text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Banner Upload Button */}
          <label className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-purple-600 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg cursor-pointer z-10">
            {uploadingBanner ? (
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MdCameraAlt className="text-xl" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
              disabled={uploadingBanner}
            />
          </label>
        </div>

        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="flex items-start md:items-end gap-4 md:gap-6">
              {/* Logo with Upload Button */}
              <div className="relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Store Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500');
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl text-white">${storeData.name?.charAt(0) || '🏪'}</div>`;
                      }}
                    />
                  ) : storeData.logoUrl ? (
                    <img 
                      src={storeData.logoUrl} 
                      alt="Store Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500');
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl text-white">${storeData.name?.charAt(0) || '🏪'}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {storeData.name?.charAt(0) || '🏪'}
                    </div>
                  )}
                </div>
                
                {/* Logo Upload Button */}
                <label className="absolute -bottom-2 -right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer z-10">
                  {uploadingLogo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MdCameraAlt className="text-lg" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
              </div>

              {/* Store Name & Info */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="text-3xl md:text-4xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white w-full"
                        placeholder="Store Name *"
                        required
                      />
                      {validationErrors.name && (
                        <p className="text-red-200 text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-bold">{storeData.name}</h1>
                  )}
                  {storeData.isVerified && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full">
                      <MdVerified className="text-sm" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                    className="text-lg text-white/90 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-white w-full"
                    placeholder="Add a catchy tagline..."
                  />
                ) : (
                  <p className="text-lg text-white/90">{storeData.tagline || "Add a tagline for your store"}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={fetchStoreData}
                disabled={loading}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <MdRefresh /> Refresh
              </button>
              
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    <MdClose /> Cancel
                  </button>
                  {!hasStore ? (
                    <button
                      onClick={handleCreateStore}
                      disabled={saving}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <MdAdd className="text-xl" /> Create Store
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <MdSave className="text-xl" /> Save Changes
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg"
                >
                  <MdEdit className="text-xl" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'contact' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'social' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Social Links
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <MdDescription className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">About Your Store</h3>
            </div>
            
            {isEditing ? (
              <div>
                <textarea
                  value={editedData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Tell customers about your store, your mission, values, and what makes you unique..."
                />
                <p className="text-gray-500 text-sm mt-2">Describe your store to attract more customers</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {storeData.description || "No description provided. Add a description to tell customers about your store."}
                </p>
                {!storeData.description && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                  >
                    <MdEdit /> Add description
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <MdStore className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Store Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <span>Total Orders</span>
                  <span className="font-bold text-2xl">{storeData.statistics?.totalOrders?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <span>Active Products</span>
                  <span className="font-bold text-2xl">{storeData.statistics?.productCount || "0"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <span>Customer Rating</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl">{storeData.statistics?.averageRating?.toFixed(1) || "0.0"}</span>
                    <MdStar className="text-yellow-300" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <span>Years Active</span>
                  <span className="font-bold text-2xl">
                    {new Date().getFullYear() - parseInt(storeData.established || new Date().getFullYear())}
                  </span>
                </div>
              </div>
            </div>

            {/* Store Details */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg">
                  <MdBusiness className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Store Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <p className="text-sm text-gray-500">Established Year</p>
                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={editedData.established}
                        onChange={(e) => handleChange("established", e.target.value)}
                        className="w-full font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                      {validationErrors.established && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.established}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MdDateRange className="text-purple-500" />
                      <p className="font-bold text-gray-800">{storeData.established}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-gray-500">Store Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${storeData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-bold text-gray-800">
                      {storeData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${storeData.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-bold text-gray-800">
                      {storeData.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                    {!storeData.isVerified && (
                      <button className="text-purple-600 text-sm hover:text-purple-700">
                        Request Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Social */}
        <div className="space-y-6">
          {/* Contact Information */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        placeholder="store@example.com"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                      <MdEmail className="text-purple-500" />
                      <span className="font-medium text-gray-800">{storeData.email || "No email provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                      <MdPhone className="text-purple-500" />
                      <span className="font-medium text-gray-800">{storeData.phone || "No phone number"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Location</label>
                  {isEditing ? (
                    <textarea
                      value={editedData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="123 Main St, City, Country"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
                      <MdLocationOn className="text-purple-500 mt-1" />
                      <span className="font-medium text-gray-800">{storeData.address || "No address provided"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <MdShare className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Social Links</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="url"
                        value={editedData.socialLinks?.website || ''}
                        onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        placeholder="https://your-store.com"
                      />
                      {validationErrors.socialLinks?.website && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.socialLinks.website}</p>
                      )}
                    </div>
                  ) : storeData.socialLinks?.website ? (
                    <a 
                      href={storeData.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 group"
                    >
                      <MdLink className="text-purple-500" />
                      <span className="font-medium text-gray-800 group-hover:text-purple-600">
                        {storeData.socialLinks.website.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-500 italic">
                      No website added
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="url"
                        value={editedData.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="https://facebook.com/your-store"
                      />
                      {validationErrors.socialLinks?.facebook && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.socialLinks.facebook}</p>
                      )}
                    </div>
                  ) : storeData.socialLinks?.facebook ? (
                    <a 
                      href={storeData.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center gap-3 group"
                    >
                      <MdPublic className="text-blue-500" />
                      <span className="font-medium text-gray-800 group-hover:text-blue-600">
                        Facebook Profile
                      </span>
                    </a>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-500 italic">
                      No Facebook link
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="url"
                        value={editedData.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                        placeholder="https://instagram.com/your-store"
                      />
                      {validationErrors.socialLinks?.instagram && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.socialLinks.instagram}</p>
                      )}
                    </div>
                  ) : storeData.socialLinks?.instagram ? (
                    <a 
                      href={storeData.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-all duration-300 flex items-center gap-3 group"
                    >
                      <MdPublic className="text-pink-500" />
                      <span className="font-medium text-gray-800 group-hover:text-pink-600">
                        Instagram Profile
                      </span>
                    </a>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-500 italic">
                      No Instagram link
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="url"
                        value={editedData.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="https://twitter.com/your-store"
                      />
                      {validationErrors.socialLinks?.twitter && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.socialLinks.twitter}</p>
                      )}
                    </div>
                  ) : storeData.socialLinks?.twitter ? (
                    <a 
                      href={storeData.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center gap-3 group"
                    >
                      <MdPublic className="text-blue-400" />
                      <span className="font-medium text-gray-800 group-hover:text-blue-500">
                        Twitter Profile
                      </span>
                    </a>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-500 italic">
                      No Twitter link
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-gray-700 border border-gray-200">
                <MdPerson /> View Public Profile
              </button>
              <button className="w-full py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-purple-700 border border-purple-200">
                <MdShare /> Share Store
              </button>
              <button 
                onClick={() => {
                  if (isEditing) {
                    if (validateForm()) {
                      handleSave();
                    } else {
                      showToast('Please fix the errors before saving', 'warning');
                    }
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-white shadow-lg hover:shadow-xl"
              >
                <MdEdit /> {isEditing ? 'Save Changes' : 'Edit Store Profile'}
              </button>
            </div>
          </div>

          {/* Store Status Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Store Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Products</span>
                <span className="font-bold">{storeData.statistics?.productCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Products</span>
                <span className="font-bold">{storeData.statistics?.activeProducts || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Customer Reviews</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{storeData.statistics?.averageRating?.toFixed(1) || '0.0'}</span>
                  <MdStar className="text-yellow-300" />
                </div>
              </div>
              <button
                onClick={fetchStoreData}
                className="w-full mt-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
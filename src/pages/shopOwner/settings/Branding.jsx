import { useState } from "react";
import {
  MdPalette,
  MdCheckCircle,
  MdVisibility,
  MdColorLens,
  MdBrush,
  MdSmartphone,
  MdDesktopMac,
  MdArrowForward,
  MdRefresh,
  MdStar,
  MdFavorite,
  MdTrendingUp
} from "react-icons/md";

export default function Branding() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");

  // Theme templates data
  const themeTemplates = [
    {
      id: 1,
      name: "Modern Elegance",
      description: "Clean and professional design with purple accents",
      category: "Professional",
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        background: "#F8FAFC",
        text: "#1E293B"
      },
      popularity: 95,
      isPremium: true,
      previewImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Ocean Breeze",
      description: "Fresh blue theme perfect for modern stores",
      category: "Popular",
      colors: {
        primary: "#06B6D4",
        secondary: "#3B82F6",
        background: "#F0F9FF",
        text: "#0F172A"
      },
      popularity: 88,
      isPremium: false,
      previewImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Sunset Glow",
      description: "Warm orange and red gradient theme",
      category: "Warm",
      colors: {
        primary: "#F59E0B",
        secondary: "#EF4444",
        background: "#FFFBEB",
        text: "#78350F"
      },
      popularity: 76,
      isPremium: false,
      previewImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      name: "Forest Green",
      description: "Natural green theme for organic stores",
      category: "Natural",
      colors: {
        primary: "#10B981",
        secondary: "#059669",
        background: "#ECFDF5",
        text: "#064E3B"
      },
      popularity: 82,
      isPremium: false,
      previewImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      name: "Midnight Dark",
      description: "Dark mode theme for modern shopping experience",
      category: "Modern",
      colors: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        background: "#0F172A",
        text: "#E2E8F0"
      },
      popularity: 91,
      isPremium: true,
      previewImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      name: "Rose Garden",
      description: "Romantic pink theme for boutique stores",
      category: "Elegant",
      colors: {
        primary: "#EC4899",
        secondary: "#F472B6",
        background: "#FDF2F8",
        text: "#831843"
      },
      popularity: 79,
      isPremium: false,
      previewImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=70"
    },
    {
      id: 7,
      name: "Royal Gold",
      description: "Luxury gold theme for premium stores",
      category: "Luxury",
      colors: {
        primary: "#D97706",
        secondary: "#F59E0B",
        background: "#FFFBEB",
        text: "#78350F"
      },
      popularity: 87,
      isPremium: true,
      previewImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=75"
    },
    {
      id: 8,
      name: "Minimal White",
      description: "Clean and minimal white theme",
      category: "Minimal",
      colors: {
        primary: "#64748B",
        secondary: "#94A3B8",
        background: "#FFFFFF",
        text: "#1E293B"
      },
      popularity: 84,
      isPremium: false,
      previewImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=65"
    }
  ];

  const handleApplyTheme = (theme) => {
    setSelectedTheme(theme);
    // In real implementation, this would save to backend
    alert(`🎨 ${theme.name} theme applied successfully!`);
  };

  const handlePreviewTheme = (theme) => {
    setSelectedTheme(theme);
  };

  const resetTheme = () => {
    setSelectedTheme(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MdPalette className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Branding & Themes</h1>
                  <p className="text-white/90 mt-2">Select and apply beautiful themes to your store</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                  <span className="font-medium">{themeTemplates.length} Templates Available</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                  <MdStar className="inline mr-2" />
                  <span className="font-medium">3 Premium Themes</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetTheme}
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:scale-105"
            >
              <MdRefresh /> Reset Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {selectedTheme && (
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Theme Preview</h2>
              <p className="text-gray-600">See how your store will look with this theme</p>
            </div>
            
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${previewMode === "desktop" ? 'bg-white shadow' : 'hover:bg-white/50'}`}
              >
                <MdDesktopMac /> Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${previewMode === "mobile" ? 'bg-white shadow' : 'hover:bg-white/50'}`}
              >
                <MdSmartphone /> Mobile
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className={`rounded-xl overflow-hidden border-4 border-gray-200 ${previewMode === "desktop" ? 'max-w-4xl mx-auto' : 'max-w-sm mx-auto'}`}>
            {/* Preview Header */}
            <div 
              className="p-4"
              style={{ backgroundColor: selectedTheme.colors.primary }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20"></div>
                  <div>
                    <div className="h-4 w-24 bg-white/30 rounded"></div>
                    <div className="h-3 w-16 bg-white/20 rounded mt-1"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/30"></div>
                  <div className="w-8 h-8 rounded-full bg-white/30"></div>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div style={{ backgroundColor: selectedTheme.colors.background }}>
              <div className="p-6">
                {/* Navigation */}
                <div className="flex gap-4 mb-6">
                  {["Home", "Products", "Categories", "About", "Contact"].map((item, index) => (
                    <div 
                      key={index}
                      className="h-3 rounded-full"
                      style={{ 
                        backgroundColor: index === 0 ? selectedTheme.colors.secondary : selectedTheme.colors.text + '20',
                        width: index === 0 ? '40px' : '60px'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Hero Section */}
                <div 
                  className="rounded-xl p-6 mb-6"
                  style={{ backgroundColor: selectedTheme.colors.primary + '20' }}
                >
                  <div className="h-5 w-3/4 mb-3 rounded" style={{ backgroundColor: selectedTheme.colors.primary }}></div>
                  <div className="h-3 w-1/2 rounded" style={{ backgroundColor: selectedTheme.colors.primary + '80' }}></div>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div 
                      key={item}
                      className="rounded-lg overflow-hidden border"
                      style={{ borderColor: selectedTheme.colors.text + '20' }}
                    >
                      <div className="h-32" style={{ backgroundColor: selectedTheme.colors.secondary + '40' }}></div>
                      <div className="p-3">
                        <div className="h-3 w-3/4 mb-2 rounded" style={{ backgroundColor: selectedTheme.colors.text }}></div>
                        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: selectedTheme.colors.text + '60' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handleApplyTheme(selectedTheme)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-lg shadow-lg"
            >
              <MdCheckCircle className="text-2xl" />
              Apply {selectedTheme.name} Theme
              <MdArrowForward />
            </button>
          </div>
        </div>
      )}

      {/* Theme Templates Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Themes</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <MdTrendingUp className="text-purple-500" />
            <span className="font-medium">Most Popular First</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeTemplates.map((theme) => (
            <div
              key={theme.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer group ${
                selectedTheme?.id === theme.id ? 'border-purple-500 ring-4 ring-purple-500/20' : 'border-gray-100 hover:border-purple-300'
              }`}
              onClick={() => handlePreviewTheme(theme)}
            >
              {/* Theme Preview Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={theme.previewImage}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  {theme.isPremium ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-bold rounded-full">
                      PREMIUM
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                    <MdStar className="text-yellow-400" />
                    <span>{theme.popularity}%</span>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{theme.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                  </div>
                  {selectedTheme?.id === theme.id && (
                    <MdCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
                  )}
                </div>

                {/* Color Palette */}
                <div className="mb-4">
                  <div className="flex gap-1 mb-2">
                    {Object.values(theme.colors).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {theme.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewTheme(theme);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all group-hover:shadow"
                  >
                    <MdVisibility /> Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-3">
          {["All", "Professional", "Popular", "Modern", "Luxury", "Minimal", "Natural", "Warm", "Elegant"].map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-600 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <MdColorLens /> {category}
            </button>
          ))}
        </div>
      </div>

      {/* Current Theme Info */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow">
            <MdBrush className="text-3xl text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Need Custom Branding?</h3>
            <p className="text-gray-600">
              Our design team can create custom themes tailored to your brand. Contact support to discuss 
              custom branding options and exclusive premium themes.
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold">
            Request Custom Theme
          </button>
        </div>
      </div>
    </div>
  );
}
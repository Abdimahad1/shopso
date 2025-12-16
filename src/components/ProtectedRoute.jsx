// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for auth changes every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const checkAuth = () => {
    try {
      // Check if user exists in localStorage
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!userData || !token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Parse user data
      const user = JSON.parse(userData);
      
      // Verify token format
      if (typeof token !== 'string' || token.length < 10) {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.clear();
        setLoading(false);
        return;
      }

      // Check token expiration
      try {
        const decoded = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000;
        if (isExpired) {
          setIsAuthenticated(false);
          localStorage.clear();
          setLoading(false);
          return;
        }
      } catch (decodeError) {
        setIsAuthenticated(false);
        localStorage.clear();
        setLoading(false);
        return;
      }

      // Check user role
      if (user.role !== requiredRole) {
        setIsAuthenticated(false);
        setUserRole(user.role);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setUserRole(user.role);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location.pathname,
          message: userRole ? "You don't have permission to access this page" : "Please login to continue"
        }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    validateAuth();

    const handleAuthChange = () => validateAuth();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("user-logout", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("user-logout", handleAuthChange);
    };
  }, []);

  const validateAuth = () => {
    setIsValidating(true);

    setTimeout(() => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // ❌ If token or user missing → logout
        if (!userData || !token) {
          window.dispatchEvent(new CustomEvent("force-logout"));
          navigate("/", {
            state: {
              from: location.pathname,
              message: "Your session has expired. Please login again."
            }
          });
          return;
        }

        // Parse user safely
        const user = JSON.parse(userData);

        // ❌ Only check if user object is valid, DO NOT check role here
        if (!user || !user.role) {
          localStorage.clear();
          navigate("/", {
            state: { message: "Invalid session. Please login again." },
          });
          return;
        }

      } catch (err) {
        console.error("Auth validation error:", err);
        localStorage.clear();
        navigate("/", {
          state: { message: "Authentication error. Please login again." },
        });
      } finally {
        setIsValidating(false);
      }
    }, 250);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Securing your session...</p>
          <p className="text-sm text-gray-500 mt-2">Checking authentication status</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;

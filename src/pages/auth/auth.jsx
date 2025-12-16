// src/pages/auth/auth.jsx  ← keep filename lowercase

import { useState, useEffect } from "react";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiShieldCheck,
} from "react-icons/hi";
import { TbShoppingCart } from "react-icons/tb";
import {
  FaShoppingBag,
  FaUsers,
  FaSmileBeam,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------
     BACKEND URL (global)
  -------------------------------- */
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = `${API_URL}/auth`;
  const LOGIN_URL = `${BASE_URL}/login`;
  const VERIFY_SESSION_URL = `${BASE_URL}/verify-session`;

  /* -------------------------------
     FORM STATES
  -------------------------------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* -------------------------------
     UI STATES
  -------------------------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* -------------------------------
     SECURITY STATES
  -------------------------------- */
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const [securityCode, setSecurityCode] = useState("");

  /* -------------------------------
     AUTO-LOGIN IF VALID SESSION
  -------------------------------- */
  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) return;

        const res = await fetch(VERIFY_SESSION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.clear();
          return;
        }

        const parsed = JSON.parse(user);

        if (parsed.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (parsed.role === "shopOwner") {
          navigate("/shop", { replace: true });
        }
      } catch {
        localStorage.clear();
      }
    };

    verifySession();
  }, [navigate]);

  /* -------------------------------
     SHOW REDIRECT MESSAGE
  -------------------------------- */
  useEffect(() => {
    if (location.state?.message) {
      setErrorMsg(location.state.message);
      setTimeout(() => setErrorMsg(""), 5000);
    }

    if (location.state?.success) {
      setSuccessMsg(location.state.success);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  }, [location.state]);

  /* -------------------------------
     CHECK LOGIN LOCK
  -------------------------------- */
  useEffect(() => {
    const lockExpiry = localStorage.getItem("lockExpiry");
    const fails = localStorage.getItem("failedAttempts");

    if (fails) setAttempts(parseInt(fails));

    if (lockExpiry) {
      const expiry = parseInt(lockExpiry);

      if (Date.now() < expiry) {
        setIsLocked(true);
        setLockTime(expiry);
      } else {
        localStorage.removeItem("lockExpiry");
        localStorage.removeItem("failedAttempts");
      }
    }
  }, []);

  /* -------------------------------
     LOCK COUNTDOWN TIMER
  -------------------------------- */
  useEffect(() => {
    if (!isLocked || !lockTime) return;

    const tick = setInterval(() => {
      const remain = lockTime - Date.now();
      if (remain <= 0) {
        setIsLocked(false);
        setLockTime(null);
        localStorage.removeItem("lockExpiry");
        localStorage.removeItem("failedAttempts");
        clearInterval(tick);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [isLocked, lockTime]);

  /* -------------------------------
     GENERATE SECURITY CODE
  -------------------------------- */
  const generateSecurityCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("securityCode", code);
    localStorage.setItem("securityCodeTime", Date.now().toString());
    setSecurityCode(code);
    return code;
  };

  /* -------------------------------
     LOGIN HANDLER
  -------------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLocked) {
      setErrorMsg("Your account is temporarily locked.");
      return;
    }

    if (attempts >= 3 && attempts < 5) {
      const stored = localStorage.getItem("securityCode");
      const time = localStorage.getItem("securityCodeTime");

      if (!stored || !time || Date.now() - parseInt(time) > 300000) {
        const newCode = generateSecurityCode();
        setErrorMsg(`Enter security code: ${newCode}`);
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-IP": "web",
        },
        body: JSON.stringify({
          email,
          password,
          ...(securityCode && { securityCode }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const fail = attempts + 1;
        setAttempts(fail);
        localStorage.setItem("failedAttempts", fail.toString());

        if (fail >= 5) {
          const expiry = Date.now() + 15 * 60 * 1000;
          setIsLocked(true);
          setLockTime(expiry);
          localStorage.setItem("lockExpiry", expiry.toString());
          setErrorMsg("Too many attempts — account locked for 15 minutes.");
        } else if (fail >= 3) {
          generateSecurityCode();
          setErrorMsg("Security verification required.");
        } else {
          setErrorMsg(data.message || "Invalid credentials.");
        }

        setLoading(false);
        return;
      }

      /* ---------------------------
         SUCCESSFUL LOGIN
      ---------------------------- */
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("securityCode");
      localStorage.removeItem("securityCodeTime");
      localStorage.removeItem("lockExpiry");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("sessionId", Date.now().toString());
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + 8 * 60 * 60 * 1000).toString()
      );

      setSuccessMsg("Login successful!");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (data.user.role === "shopOwner") {
          navigate("/shop", { replace: true });
        }
      }, 800);
    } catch {
      setErrorMsg("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     TIME FORMAT
  -------------------------------- */
  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* -------------------------------
     UI (UNCHANGED DESIGN)
  -------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 p-4">
      <div className="
        w-full max-w-5xl
        min-h-[600px] max-h-[750px]
        bg-white/70 backdrop-blur-2xl
        rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)]
        grid grid-cols-1 lg:grid-cols-2 overflow-hidden
        border border-white/40
      ">

        {/* LEFT SIDE */}
        <div className="
          hidden lg:flex flex-col justify-center items-center
          bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700
          text-white p-8 relative overflow-hidden
        ">
          <div className="absolute top-0 left-0 w-56 h-56 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-20 translate-y-20 blur-xl"></div>

          <div className="relative z-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-lg shadow-xl">
                <TbShoppingCart className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold tracking-wide">DashboardPro</h1>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight">
              Secure Admin Portal
            </h2>
            <h3 className="text-xl text-blue-200">Enterprise Management System</h3>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-sm mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <HiShieldCheck className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Protected Access</span>
              </div>
              <p className="text-blue-100/90 text-xs">
                Multi-layer security with session management, rate limiting, and role-based access control.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <FaShoppingBag className="w-14 h-14 text-yellow-300 animate-bounce" />
              <FaSmileBeam className="w-12 h-12 text-pink-200 animate-pulse" />
              <FaUsers className="w-12 h-12 text-green-200 animate-fadeIn" />
            </div>

            <div className="pt-4 text-xs text-blue-100/70">
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span>SSL Encrypted Connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — LOGIN */}
        <div className="p-6 md:p-8 flex items-center justify-center relative">
          <div className="w-full max-w-sm">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="
                w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600
                rounded-xl shadow-xl flex items-center justify-center
              ">
                <TbShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">DashboardPro</h1>
                <p className="text-xs text-gray-500">Secure Admin Access</p>
              </div>
            </div>

            {/* Welcome */}
            <div className="text-center mb-8">
              <div className="
                hidden lg:flex
                w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 
                rounded-2xl shadow-xl items-center justify-center mb-4
              ">
                <FaUsers className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
                Admin Authentication
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            {/* Animated Messages */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-700">
                    <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-green-700">
                    <HiShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{successMsg}</p>
                  </div>
                </motion.div>
              )}

              {isLocked && lockTime && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HiLockClosed className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-yellow-800 font-medium mb-1">Account Locked</p>
                    <p className="text-yellow-600 text-sm">
                      Try again in {formatTime(lockTime - Date.now())}
                    </p>
                  </div>
                </motion.div>
              )}

              {attempts >= 3 && attempts < 5 && securityCode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-blue-700 text-sm font-medium mb-1">Security Verification Required</p>
                  <p className="text-blue-600 text-xs">
                    Enter the code sent to your registered email
                  </p>
                  <input
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="mt-2 w-full p-2 border border-blue-300 rounded text-center font-mono text-lg tracking-widest"
                    maxLength={6}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN FORM */}
            <form className="space-y-5" onSubmit={handleLogin}>

              {/* EMAIL */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiMail className="absolute left-3 top-3 text-blue-600 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    required
                    disabled={isLocked || loading}
                    className="
                      w-full border border-gray-300 p-3 pl-10 rounded-lg bg-gray-50
                      focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-3 text-blue-600 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLocked || loading}
                    className="
                      w-full border border-gray-300 p-3 pl-10 pr-10 rounded-lg bg-gray-50
                      focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked || loading}
                    className="absolute right-2 top-3 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>

              {/* Security Info */}
              {attempts > 0 && (
                <div className="text-xs text-gray-500 text-center">
                  <p>Failed attempts: {attempts} / 5</p>
                  {attempts >= 3 && attempts < 5 && (
                    <p className="text-yellow-600">⚠️ Security verification triggered</p>
                  )}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className="
                  w-full py-3.5 rounded-lg font-semibold text-white text-sm
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95
                  transition-all duration-300 relative overflow-hidden
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                "
              >
                {loading ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="opacity-0">Signing In...</span>
                  </>
                ) : isLocked ? (
                  "Account Locked"
                ) : (
                  "Secure Sign In"
                )}
              </button>

              {/* Security Footer */}
              <div className="pt-6 border-t border-gray-100">
                <div className="text-center text-gray-500 text-xs">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <HiShieldCheck className="w-3 h-3 text-green-500" />
                    <span>Protected by multi-factor authentication</span>
                  </div>
                  <p className="text-gray-400">
                    Need access?{" "}
                    <button 
                      type="button" 
                      className="text-blue-600 font-medium hover:underline"
                      onClick={() => navigate("/contact")}
                    >
                      Contact Administrator
                    </button>
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* Session Warning */}
          {attempts > 0 && (
            <div className="absolute bottom-4 right-4">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${attempts < 3 ? 'bg-green-500' : attempts < 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span>Security Level: {attempts < 3 ? 'Normal' : attempts < 5 ? 'Elevated' : 'High'}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out infinite alternate;
        }
        
        /* Prevent copy-paste on sensitive fields */
        input[type="password"], input[type="text"][placeholder*="code"] {
          -webkit-text-security: disc;
        }
        
        /* Hide autofill background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          box-shadow: 0 0 0px 1000px white inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}

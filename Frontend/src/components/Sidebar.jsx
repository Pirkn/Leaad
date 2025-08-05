import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Home, Package, Users, Flame, Sparkles, Settings } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ x: -256, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col"
      style={{ borderColor: "#e5e7eb" }}
    >
      {/* App Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 border-b border-gray-200"
        style={{ borderBottomColor: "#e5e7eb" }}
      >
        <div className="flex items-center space-x-3">
          {/* Placeholder Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
          >
            <span className="text-gray-600 font-medium text-sm">MA</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-semibold text-gray-900"
          >
            Leaad
          </motion.h1>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex-1 p-4 space-y-1"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={{
                borderColor: isActive("/dashboard") ? "#FFE4CC" : "transparent",
                borderWidth: "1px",
                transition: "border-color 0.2s ease",
              }}
            >
              {/* Dashboard Icon */}
              <Home className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/products"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/products")
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/products")
                    ? "#FFE4CC"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Products Icon */}
                <Package className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Products</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/leads"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/leads")
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/leads") ? "#FFE4CC" : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Leads Icon */}
                <Users className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Leads</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/viral-templates"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/viral-templates")
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/viral-templates")
                    ? "#FFE4CC"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Viral Templates Icon */}
                <Flame className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Viral Templates</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/karma"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/karma")
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/karma") ? "#FFE4CC" : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Karma Icon */}
                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Karma Builder</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/settings")
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/settings")
                    ? "#FFE4CC"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Settings Icon */}
                <Settings className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* User Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-4 border-t border-gray-200"
        style={{ borderTopColor: "#e5e7eb" }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center space-x-3 mb-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"
          >
            <span className="text-orange-600 font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500">Signed in</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <div className="w-5 h-5">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Sign out</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;

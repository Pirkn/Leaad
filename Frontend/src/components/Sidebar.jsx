import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

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
            Marketing Agent
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
          <Link
            to="/"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
              isActive("/")
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            style={{
              borderColor: isActive("/") ? "#e9d5ff" : "transparent",
              borderWidth: "1px",
              transition: "border-color 0.2s ease",
            }}
          >
            {/* Dashboard Icon */}
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

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
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/products")
                    ? "#e9d5ff"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Products Icon */}
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
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
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/leads") ? "#e9d5ff" : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Leads Icon */}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
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
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/viral-templates")
                    ? "#e9d5ff"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Viral Templates Icon */}
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
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
                to="/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive("/settings")
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  borderColor: isActive("/settings")
                    ? "#e9d5ff"
                    : "transparent",
                  borderWidth: "1px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Settings Icon */}
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
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
            className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
          >
            <span className="text-purple-600 font-medium text-sm">
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

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* App Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Placeholder Icon */}
          <div className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-gray-600 font-medium text-sm">MA</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Marketing Agent
          </h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
            isActive("/")
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
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

        <Link
          to="/product-analysis"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
            isActive("/product-analysis")
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {/* Product Analysis Icon */}
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Product Analysis</span>
        </Link>

        <Link
          to="/leads"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
            isActive("/leads")
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
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

        <Link
          to="/viral-templates"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
            isActive("/viral-templates")
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
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

        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
            isActive("/settings")
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
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
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500">Signed in</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

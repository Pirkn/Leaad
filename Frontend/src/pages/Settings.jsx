import { User, AlertTriangle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, signOut } = useAuth();
  // const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getUserInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </motion.div>

      {/* Main Content - Centered Cards */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Profile & Account Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* First Column - Profile Photo */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
              </div>

              {/* Second Column - Name and Email */}
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">{getUserDisplayName()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="text-gray-900">{user?.email || "N/A"}</p>
                </div>
              </div>

              {/* Third Column - Account Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {formatDate(user?.created_at)}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <p className="text-gray-900">Free</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Account Actions
              </h2>
              <p className="text-gray-600 text-sm">
                Manage your account settings
              </p>
            </div>

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Sign Out
                  </label>
                  <p className="text-gray-900 text-sm">
                    Sign out of your account
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Danger Zone
              </h2>
              <p className="text-gray-600 text-sm">
                Irreversible and destructive actions
              </p>
            </div>

            <div className="space-y-4">
              {/* Delete Account */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Delete Account
                  </label>
                  <p className="text-gray-900 text-sm">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Settings;

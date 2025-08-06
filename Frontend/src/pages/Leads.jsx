import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLeads,
  useGenerateLeads,
  useMarkLeadAsRead,
  useProducts,
} from "../hooks/useApi";
import {
  Filter,
  SortAsc,
  Eye,
  MessageSquare,
  Check,
  ExternalLink,
  Calendar,
  User,
  ThumbsUp,
  MessageCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Button } from "../components/ui/button";

function Leads() {
  const [postedFilter, setPostedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewFilter, setViewFilter] = useState("all");

  // API hooks
  const { data: leads, isLoading, error } = useLeads();
  const { data: productsResponse } = useProducts();
  const generateLeadsMutation = useGenerateLeads();
  const markAsReadMutation = useMarkLeadAsRead();

  const products = productsResponse?.products || [];
  const product = products[0]; // Assuming single product setup

  const handleGenerateLeads = async () => {
    if (!product) {
      alert("No product configured. Please add a product first.");
      return;
    }

    try {
      await generateLeadsMutation.mutateAsync(product.id);
    } catch (error) {
      console.error("Failed to generate leads:", error);

      // Check if it's a model overload error
      if (error.message && error.message.includes("overloaded")) {
        alert(
          "The AI model is currently overloaded. Please try again in a few minutes."
        );
      } else {
        alert("Failed to generate leads. Please try again.");
      }
    }
  };

  const handleMarkAsRead = async (leadId) => {
    try {
      await markAsReadMutation.mutateAsync(leadId);
    } catch (error) {
      console.error("Failed to mark lead as read:", error);
    }
  };

  const handleViewOnReddit = (url) => {
    window.open(url, "_blank");
  };

  const handleViewReply = (lead) => {
    // TODO: Implement view reply functionality
    console.log("View reply for lead:", lead);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays < 1;
  };

  const filteredLeads =
    leads?.filter((lead) => {
      if (viewFilter === "read") return lead.read;
      if (viewFilter === "unread") return !lead.read;
      return true; // "all"
    }) || [];

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === "score") {
      return (b.score || 0) - (a.score || 0);
    }
    return 0;
  });

  // Loading State
  if (isLoading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Your Leads</h1>
          <p className="text-gray-600 mt-2">
            View leads that AI found based on your product. Click "Generate
            Leads" to find more potential customers and engagement
            opportunities.
          </p>
        </motion.div>

        {/* Main Content - Wider Layout */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Filter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Action buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleGenerateLeads}
                    disabled={generateLeadsMutation.isPending || !product}
                    className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      {generateLeadsMutation.isPending
                        ? "Generating..."
                        : "Generate Leads"}
                    </span>
                  </Button>

                  <Button
                    onClick={() => setViewFilter("all")}
                    variant="ghost"
                    className={
                      viewFilter === "all"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    All Leads
                  </Button>

                  <Button
                    onClick={() => setViewFilter("unread")}
                    variant="ghost"
                    className={
                      viewFilter === "unread"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    Unread
                  </Button>

                  <Button
                    onClick={() => setViewFilter("read")}
                    variant="ghost"
                    className={
                      viewFilter === "read"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    Read
                  </Button>
                </div>

                {/* Right side - Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Posted:</span>
                    <select
                      value={postedFilter}
                      onChange={(e) => setPostedFilter(e.target.value)}
                      className="w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="score">Score</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading leads...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Leads
          </h3>
          <p className="text-sm text-red-700">
            {error.message || "Failed to load leads. Please try again."}
          </p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">Your Leads</h1>
        <p className="text-gray-600 mt-2">
          View leads that AI found based on your product. Click "Generate Leads"
          to find more potential customers and engagement opportunities.
        </p>
      </motion.div>

      {/* Main Content - Wider Layout */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Filter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleGenerateLeads}
                  disabled={generateLeadsMutation.isPending || !product}
                  className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {generateLeadsMutation.isPending
                      ? "Generating..."
                      : "Generate Leads"}
                  </span>
                </Button>

                <Button
                  onClick={() => setViewFilter("all")}
                  variant="ghost"
                  className={
                    viewFilter === "all"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  All Leads
                </Button>

                <Button
                  onClick={() => setViewFilter("unread")}
                  variant="ghost"
                  className={
                    viewFilter === "unread"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  Unread
                </Button>

                <Button
                  onClick={() => setViewFilter("read")}
                  variant="ghost"
                  className={
                    viewFilter === "read"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  Read
                </Button>
              </div>

              {/* Right side - Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Posted:</span>
                  <select
                    value={postedFilter}
                    onChange={(e) => setPostedFilter(e.target.value)}
                    className="w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="score">Score</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Notification */}
          {generateLeadsMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900">
                    Failed to generate leads
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    {generateLeadsMutation.error?.message ||
                      "Please try again in a few minutes"}
                  </p>
                </div>
                <button
                  onClick={() => generateLeadsMutation.reset()}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* Leads Grid */}
          <div className="grid grid-cols-1 gap-4">
            {sortedLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                {/* Header with New tag */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {lead.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Reddit User</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {isNew(lead.created_at) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {lead.selftext}
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{lead.score || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewOnReddit(lead.url)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Reddit</span>
                  </Button>
                  <Button
                    onClick={() => handleViewReply(lead)}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>View Reply</span>
                  </Button>
                  <Button
                    onClick={() => handleMarkAsRead(lead.id)}
                    disabled={markAsReadMutation.isPending}
                    variant="outline"
                    className="px-3 py-2"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as read</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {sortedLeads.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-500 mb-4">
                {viewFilter === "all"
                  ? "Generate your first leads to get started"
                  : `No ${viewFilter} leads found`}
              </p>
              {viewFilter === "all" && (
                <Button
                  onClick={handleGenerateLeads}
                  disabled={generateLeadsMutation.isPending || !product}
                  className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                >
                  {generateLeadsMutation.isPending
                    ? "Generating..."
                    : "Generate Leads"}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Leads;

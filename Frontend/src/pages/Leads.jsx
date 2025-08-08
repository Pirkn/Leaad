import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLeads,
  useMarkLeadAsRead,
  useProducts,
  useGenerateLeads,
} from "../hooks/useApi";
import { useLeadsContext } from "../contexts/LeadsContext";
import {
  Filter,
  SortAsc,
  Eye,
  MessageSquare,
  Check,
  ExternalLink,
  Calendar,
  User,
  ArrowUp,
  MessageCircle,
  Clock,
  EyeOff,
  RotateCcw,
  Copy,
} from "lucide-react";
import { Button } from "../components/ui/button";

function Leads() {
  const [postedFilter, setPostedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewFilter, setViewFilter] = useState("all");
  const [optimisticReads, setOptimisticReads] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [copiedReplyId, setCopiedReplyId] = useState(null);

  // API hooks
  const { data: leads, isLoading, error } = useLeads();
  const { data: productsResponse } = useProducts();
  const markAsReadMutation = useMarkLeadAsRead();
  const generateLeadsMutation = useGenerateLeads();
  const { newlyGeneratedLeads, addNewlyGeneratedLeads } = useLeadsContext();

  const products = productsResponse?.products || [];
  const product = products[0]; // Assuming single product setup

  const handleGenerateLeads = async () => {
    if (!product) {
      alert("No product configured. Please add a product first.");
      return;
    }

    try {
      const result = await generateLeadsMutation.mutateAsync(product.id);

      // Add newly generated leads to context
      if (result && Array.isArray(result)) {
        const transformedLeads = result.map((lead, index) => ({
          ...lead,
          id: `new-${Date.now()}-${index}`,
          created_at: new Date().toISOString(),
          isNew: true,
        }));
        addNewlyGeneratedLeads(transformedLeads);
      }
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
    // Optimistically update the UI
    setOptimisticReads((prev) => new Set([...prev, leadId]));

    try {
      await markAsReadMutation.mutateAsync(leadId);
    } catch (error) {
      console.error("Failed to mark lead as read:", error);
      // Revert optimistic update on error
      setOptimisticReads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const handleViewOnReddit = (url) => {
    window.open(url, "_blank");
  };

  const handleViewReply = (leadId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const handleCopyReply = async (replyText, leadId) => {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopiedReplyId(leadId);
      setTimeout(() => setCopiedReplyId(null), 2000);
    } catch (err) {
      console.error("Failed to copy reply:", err);
    }
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

  // Combine existing leads with newly generated leads
  const allLeads = [...(leads || []), ...newlyGeneratedLeads];

  const filteredLeads =
    allLeads.filter((lead) => {
      // Apply optimistic updates to the lead data
      const isOptimisticallyRead = optimisticReads.has(lead.id);
      const effectiveReadStatus = lead.read || isOptimisticallyRead;

      if (viewFilter === "read") return effectiveReadStatus;
      if (viewFilter === "unread") return !effectiveReadStatus;
      return true; // "all" - show all leads regardless of read status
    }) || [];

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "newest") {
      // Sort by when the lead was generated (created_at)
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      // Sort by when the lead was generated (created_at)
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA - dateB;
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
            View leads that AI found based on your product. These are leads from
            your lead history.
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
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
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
          View leads that AI found based on your product. These are leads from
          your lead history.
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
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4"
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
            {sortedLeads.map((lead, index) => {
              const isOptimisticallyRead = optimisticReads.has(lead.id);
              const isRead = lead.read || isOptimisticallyRead;

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                >
                  {/* Header with New tag and Subreddit */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {lead.title || "Lead"}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{lead.author || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        r/{lead.subreddit}
                      </span>
                      {isNew(lead.created_at) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {lead.selftext || lead.title || "No description available"}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{lead.score || 0} upvotes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{lead.num_comments || 0} comments</span>
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
                      onClick={() => handleViewReply(lead.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {expandedReplies.has(lead.id)
                          ? "Hide Reply"
                          : "View Reply"}
                      </span>
                    </Button>
                    <Button
                      onClick={() => handleMarkAsRead(lead.id)}
                      variant="outline"
                      className={`px-3 py-2 transition-all duration-200 ${
                        isRead
                          ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                          : "hover:bg-gray-50"
                      }`}
                      title={isRead ? "Marked as read" : "Mark as read"}
                    >
                      {isRead ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Marked as read</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Mark as read</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Reply Section */}
                  {expandedReplies.has(lead.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                AI Generated Reply
                              </h4>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                Suggested
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {lead.comment || "No reply available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            onClick={() =>
                              handleCopyReply(lead.comment, lead.id)
                            }
                            variant="outline"
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                          >
                            {copiedReplyId === lead.id ? (
                              <Check className="w-4 h-4 mr-2" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy Reply
                          </Button>
                          <Button
                            onClick={() => window.open(`${lead.url}`, "_blank")}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-[#FF4500]"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                            Reply on Reddit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
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

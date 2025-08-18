import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLeads,
  useMarkLeadAsRead,
  useMarkLeadAsUnread,
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
  Copy,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function Leads() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const leadRefs = useRef({});
  const [postedFilter, setPostedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewFilter, setViewFilter] = useState("all");
  // Read functionality states - track both read and unread leads optimistically
  const [optimisticReads, setOptimisticReads] = useState(new Set());
  const [optimisticUnreads, setOptimisticUnreads] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [copiedReplyId, setCopiedReplyId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // API hooks
  const { data: leads, isLoading, error } = useLeads();
  const { data: productsResponse } = useProducts();
  const generateLeadsMutation = useGenerateLeads();
  const markAsReadMutation = useMarkLeadAsRead();
  const markAsUnreadMutation = useMarkLeadAsUnread();
  const {
    newlyGeneratedLeads,
    isLeadNew,
    acknowledgeNewLeads,
    simulateNewLead,
    addNewlyGeneratedLeads,
  } = useLeadsContext();

  const products = productsResponse?.products || [];
  const product = products[0]; // Assuming single product setup

  const handleToggleReadStatus = async (leadId, currentReadStatus) => {
    if (currentReadStatus) {
      // Currently read, mark as unread
      setOptimisticUnreads((prev) => new Set([...prev, leadId]));

      // Show success toast immediately
      toast("Lead marked as unread!", {
        duration: 2000,
        icon: <Check className="w-4 h-4 text-green-600" />,
      });

      try {
        await markAsUnreadMutation.mutateAsync(leadId);
      } catch (error) {
        console.error("Failed to mark lead as unread:", error);
        // Revert optimistic update on error
        setOptimisticUnreads((prev) => {
          const newSet = new Set(prev);
          newSet.delete(leadId);
          return newSet;
        });
        // Show error toast
        toast("Failed to mark lead as unread. Please try again.", {
          duration: 3000,
          icon: (
            <svg
              className="w-4 h-4 text-red-600"
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
          ),
        });
      }
    } else {
      // Currently unread, mark as read
      setOptimisticReads((prev) => new Set([...prev, leadId]));

      // Clear any optimistic unread for this lead
      setOptimisticUnreads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });

      // Show success toast immediately
      toast("Lead marked as read!", {
        duration: 2000,
        icon: <Check className="w-4 h-4 text-green-600" />,
      });

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
        // Show error toast
        toast("Failed to mark lead as read. Please try again.", {
          duration: 3000,
          icon: (
            <svg
              className="w-4 h-4 text-red-600"
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
          ),
        });
      }
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

      // Show success toast
      toast("Reply copied to clipboard!", {
        duration: 2000,
        icon: <Check className="w-4 h-4 text-green-600" />,
      });
    } catch (err) {
      console.error("Failed to copy reply:", err);
      // Show error toast
      toast("Failed to copy reply. Please try again.", {
        duration: 3000,
        icon: (
          <svg
            className="w-4 h-4 text-red-600"
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
        ),
      });
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

  // Combine existing leads with newly generated leads (dedupe by id, new first)
  const allLeads = (() => {
    const combined = [...(newlyGeneratedLeads || []), ...(leads || [])];
    const seen = new Set();
    const unique = [];
    for (const l of combined) {
      const id = l?.id;
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      unique.push(l);
    }
    return unique;
  })();

  // Acknowledge new leads when entering this page
  useEffect(() => {
    acknowledgeNewLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLeads =
    allLeads.filter((lead) => {
      // Apply optimistic updates to the lead data
      const isOptimisticallyRead = optimisticReads.has(lead.id);
      const isOptimisticallyUnread = optimisticUnreads.has(lead.id);

      // If lead was optimistically marked as unread, treat it as unread regardless of original status
      let effectiveReadStatus;
      if (isOptimisticallyUnread) {
        effectiveReadStatus = false;
      } else {
        effectiveReadStatus = lead.read || isOptimisticallyRead;
      }

      // Apply view filter (read/unread)
      if (viewFilter === "read" && !effectiveReadStatus) return false;
      if (viewFilter === "unread" && effectiveReadStatus) return false;

      // Apply posted date filter
      if (postedFilter !== "all") {
        const postDate = new Date(lead.date || lead.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - postDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (postedFilter === "today" && diffDays > 1) return false;
        if (postedFilter === "week" && diffDays > 7) return false;
        if (postedFilter === "month" && diffDays > 30) return false;
      }

      return true;
    }) || [];

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "newest") {
      // Sort by when the Reddit post was posted (date)
      const dateA = new Date(a.date || a.created_at);
      const dateB = new Date(b.date || b.created_at);
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      // Sort by when the Reddit post was posted (date)
      const dateA = new Date(a.date || a.created_at);
      const dateB = new Date(b.date || b.created_at);
      return dateA - dateB;
    } else if (sortBy === "score") {
      return (b.score || 0) - (a.score || 0);
    }
    return 0;
  });

  // Handle scrolling to specific lead from URL parameter
  useEffect(() => {
    if (highlightId && leadRefs.current[highlightId]) {
      setTimeout(() => {
        if (leadRefs.current[highlightId]) {
          leadRefs.current[highlightId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Add highlight effect
          leadRefs.current[highlightId].classList.add(
            "ring-2",
            "ring-orange-500",
            "ring-opacity-50"
          );
          setTimeout(() => {
            if (leadRefs.current[highlightId]) {
              leadRefs.current[highlightId].classList.remove(
                "ring-2",
                "ring-orange-500",
                "ring-opacity-50"
              );
            }
          }, 3000);
        }
      }, 500);
    }
  }, [highlightId, sortedLeads]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest(".filter-dropdown")) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

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
        </motion.div>

        {/* Main Content - Wider Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading leads...</p>
            </div>
          </div>
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
      </motion.div>

      {/* Main Content - Wider Layout */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Active Searching Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Actively searching for leads
                </h3>
                <p className="text-sm text-blue-700">
                  We're monitoring Reddit 24/7 and will notify you when new
                  leads are found
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex flex-col space-y-4 max-[500px]:space-y-3 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between min-[500px]:space-y-0">
              {/* Top row - Action buttons */}
              <div className="hidden min-[500px]:flex items-center space-x-2">
                <Button
                  onClick={() => setViewFilter("all")}
                  variant="ghost"
                  className={
                    viewFilter === "all"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  All
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

              {/* Bottom row - Search and Filter */}
              <div className="flex items-center space-x-2">
                {/* Search - keep visible for quick access */}
                <div className="relative flex-1 min-[500px]:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full min-[500px]:w-48 pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                {/* Filter Button with Dropdown */}
                <div className="relative filter-dropdown">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="relative flex items-center px-3 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline sm:ml-2">Filters</span>
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                      <div className="space-y-4">
                        {/* All/Unread/Read Filter - Only show under 500px */}
                        <div className="min-[500px]:hidden">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            View
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setViewFilter("all");
                                setShowFilterDropdown(false);
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                viewFilter === "all"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              All
                            </button>
                            <button
                              onClick={() => {
                                setViewFilter("unread");
                                setShowFilterDropdown(false);
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                viewFilter === "unread"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              Unread
                            </button>
                            <button
                              onClick={() => {
                                setViewFilter("read");
                                setShowFilterDropdown(false);
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                viewFilter === "read"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              Read
                            </button>
                          </div>
                        </div>

                        {/* Posted Date Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Posted Date
                          </label>
                          <select
                            id="posted-filter"
                            name="postedFilter"
                            value={postedFilter}
                            onChange={(e) => setPostedFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                          </select>
                        </div>

                        {/* Sort By */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <select
                            id="sort-by"
                            name="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="score">Score</option>
                          </select>
                        </div>

                        {/* Lead count */}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-sm text-gray-500 mb-3">
                            {sortedLeads.length} of {allLeads.length} leads
                          </div>
                          <Button
                            onClick={() => {
                              setPostedFilter("all");
                              setSortBy("newest");
                              setViewFilter("all");
                              setShowFilterDropdown(false);
                            }}
                            variant="outline"
                            className="w-full"
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dev-only: simulate a new lead */}
                {import.meta.env.DEV && (
                  <Button
                    onClick={() => simulateNewLead()}
                    variant="outline"
                    className="ml-2 whitespace-nowrap"
                    title="Simulate an incoming lead (dev only)"
                  >
                    Simulate New Lead
                  </Button>
                )}

                {/* Dev-only: trigger backend generation */}
                {import.meta.env.DEV && (
                  <Button
                    onClick={async () => {
                      if (!product?.id) {
                        toast("No product found to generate leads for.");
                        return;
                      }
                      try {
                        toast("Generating leads...", { duration: 1200 });
                        const generated =
                          await generateLeadsMutation.mutateAsync(product.id);
                        if (Array.isArray(generated) && generated.length > 0) {
                          addNewlyGeneratedLeads(generated);
                          toast(`${generated.length} leads generated!`, {
                            duration: 2000,
                          });
                        } else {
                          toast("No leads returned.");
                        }
                      } catch (e) {
                        console.error(e);
                        toast("Failed to generate leads.");
                      }
                    }}
                    variant="outline"
                    className="ml-2 whitespace-nowrap"
                    disabled={generateLeadsMutation.isPending}
                    title="Call backend /lead-generation (dev only)"
                  >
                    {generateLeadsMutation.isPending
                      ? "Generating..."
                      : "Generate Leads"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 gap-4">
            {sortedLeads.map((lead, index) => {
              const isOptimisticallyRead = optimisticReads.has(lead.id);
              const isOptimisticallyUnread = optimisticUnreads.has(lead.id);
              const isRead =
                (lead.read || isOptimisticallyRead) && !isOptimisticallyUnread;

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                  ref={(el) => (leadRefs.current[lead.id] = el)}
                >
                  {/* Header with New tag and Subreddit */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {lead.title || "Lead"}
                        {isLeadNew(lead.id) && (
                          <span className="ml-2 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px] font-medium min-[700px]:hidden">
                            New
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1 min-[700px]:flex max-[699px]:hidden">
                          <User className="w-4 h-4" />
                          <span>{lead.author || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            <span className="min-[700px]:inline hidden">
                              Posted{" "}
                            </span>
                            {formatDate(lead.date || lead.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 min-[700px]:hidden">
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">
                            r/{lead.subreddit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 min-[700px]:flex max-[699px]:hidden">
                      {isLeadNew(lead.id) && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium mr-1">
                          New
                        </span>
                      )}
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        r/{lead.subreddit}
                      </span>
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
                      <span className="max-[700px]:hidden">View on Reddit</span>
                      <span className="hidden max-[700px]:inline">View</span>
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
                          : "See Reply"}
                      </span>
                    </Button>
                    <Button
                      onClick={() => handleToggleReadStatus(lead.id, isRead)}
                      variant="outline"
                      className={`px-3 py-2 transition-all duration-200 ${
                        isRead
                          ? "bg-green-50 border-green-300 text-green-700 hover:bg-gray-100 hover:border-green-400"
                          : "hover:bg-gray-50"
                      }`}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {isRead ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="min-[700px]:inline hidden">
                            Mark as unread
                          </span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="min-[700px]:inline hidden">
                            Mark as read
                          </span>
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
                {viewFilter === "all"
                  ? "No leads yet"
                  : `No ${viewFilter} leads found`}
              </h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                {viewFilter === "all"
                  ? "We're actively searching Reddit for leads. You'll be notified when we find relevant opportunities."
                  : `No ${viewFilter} leads match your current filters`}
              </p>
              {viewFilter !== "all" && (
                <Button
                  onClick={() => {
                    setViewFilter("all");
                    setPostedFilter("all");
                    setSortBy("newest");
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  View All Leads
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Toaster is rendered at app root */}
    </motion.div>
  );
}

export default Leads;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRedditPosts,
  useGenerateRedditPost,
  useProducts,
} from "../hooks/useApi";
import { Button } from "../components/ui/button";
import {
  RotateCcw,
  Copy,
  Check,
  MessageCircle,
  FileText,
  ExternalLink,
  Filter,
  SortAsc,
  Search,
} from "lucide-react";

function Posts() {
  const { data: posts, isLoading, error } = useRedditPosts();
  const { data: productsResponse } = useProducts();
  const generatePostMutation = useGenerateRedditPost();
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [subredditFilter, setSubredditFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const products = productsResponse?.products || [];
  const product = products[0]; // Assuming single product setup

  const handleGeneratePost = async () => {
    if (!product) {
      alert("No product configured. Please add a product first.");
      return;
    }
    try {
      await generatePostMutation.mutateAsync({ product_id: product.id });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCopyPost = (post) => {
    const text = `${post.title}\n\n${post.description}`;
    navigator.clipboard.writeText(text);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // Filter and sort posts
  const filteredPosts =
    posts?.filter((post) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          post.title?.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          post.subreddit?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Subreddit filter
      if (subredditFilter !== "all" && post.subreddit !== subredditFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all" && post.created_at) {
        const postDate = new Date(post.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - postDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === "today" && diffDays > 1) return false;
        if (dateFilter === "week" && diffDays > 7) return false;
        if (dateFilter === "month" && diffDays > 30) return false;
      }

      return true;
    }) || [];

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === "subreddit") {
      return (a.subreddit || "").localeCompare(b.subreddit || "");
    }
    return 0;
  });

  // Get unique subreddits for filter dropdown
  const uniqueSubreddits = [
    ...new Set(posts?.map((post) => post.subreddit).filter(Boolean)),
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSubredditFilter("all");
    setDateFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm ||
    subredditFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Reddit Posts
        </h1>
        <p className="text-gray-600 mt-2">
          View and generate Reddit posts for your product. Posts are generated
          with AI and saved to your account.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading your Reddit posts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Posts
              </h3>
              <p className="text-sm text-red-700">
                {error.message || "Failed to load posts. Please try again."}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Generate New Reddit Posts
                </h2>
                <p className="text-gray-600 text-sm">
                  Click the button to generate new Reddit posts for your
                  product.
                </p>
              </div>
              <Button
                onClick={handleGeneratePost}
                disabled={generatePostMutation.isPending || !product}
                className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {generatePostMutation.isPending
                  ? "Generating..."
                  : "Generate Post"}
              </Button>
            </motion.div>

            {/* Success Notification */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Post generated successfully!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {sortedPosts.length} of {posts?.length || 0} posts
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                {/* Subreddit Filter */}
                <div>
                  <select
                    value={subredditFilter}
                    onChange={(e) => setSubredditFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="all">All Subreddits</option>
                    {uniqueSubreddits.map((subreddit) => (
                      <option key={subreddit} value={subreddit}>
                        r/{subreddit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
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
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="subreddit">By Subreddit</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                          r/{post.subreddit}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.created_at
                            ? new Date(post.created_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-4 whitespace-pre-line line-clamp-4">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Button
                        onClick={() => handleCopyPost(post)}
                        variant="outline"
                        className="px-3 py-2"
                      >
                        {copiedPostId === post.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            <span>Copy Post</span>
                          </>
                        )}
                      </Button>
                      {post.url && (
                        <Button
                          onClick={() => window.open(post.url, "_blank")}
                          variant="outline"
                          className="px-3 py-2"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span>View on Reddit</span>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 col-span-full"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {hasActiveFilters
                      ? "No posts match your filters"
                      : "No posts found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {hasActiveFilters
                      ? "Try adjusting your filters or generate new posts"
                      : "Generate your first Reddit post to get started"}
                  </p>
                  {hasActiveFilters ? (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="mr-2"
                    >
                      Clear Filters
                    </Button>
                  ) : null}
                  <Button
                    onClick={handleGeneratePost}
                    disabled={generatePostMutation.isPending || !product}
                    className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {generatePostMutation.isPending
                      ? "Generating..."
                      : "Generate Post"}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Posts;

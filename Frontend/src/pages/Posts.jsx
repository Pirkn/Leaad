import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRedditPosts,
  useGenerateRedditPost,
  useProducts,
  useMarkRedditPostAsSaved,
  useMarkRedditPostAsUnsaved,
} from "../hooks/useApi";
import { usePostsContext } from "../contexts/PostsContext";
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
  Bookmark,
  CircleCheck,
} from "lucide-react";
import Snackbar from "@mui/material/Snackbar";
import { Toaster, toast } from "sonner";
import { useSearchParams } from "react-router-dom";

function Posts() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const postRefs = useRef({});
  const { data: posts, isLoading, error } = useRedditPosts();
  const { data: productsResponse } = useProducts();
  const generatePostMutation = useGenerateRedditPost();
  const markAsSavedMutation = useMarkRedditPostAsSaved();
  const markAsUnsavedMutation = useMarkRedditPostAsUnsaved();
  const [copiedPostId, setCopiedPostId] = useState(null);

  const {
    newlyGeneratedPosts,
    addNewlyGeneratedPosts,
    isGeneratingPosts,
    setGeneratingPosts,
  } = usePostsContext();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPostText, setEditedPostText] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalPostText, setOriginalPostText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [subredditFilter, setSubredditFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [saveFilter, setSaveFilter] = useState("all"); // "all" or "saved"

  // Save functionality states
  const [optimisticSaves, setOptimisticSaves] = useState(new Set());

  const products = productsResponse?.products || [];
  const product = products[0]; // Assuming single product setup

  const handleGeneratePost = async () => {
    if (!product) {
      alert("No product configured. Please add a product first.");
      return;
    }

    // Set persistent loading state
    setGeneratingPosts(true);

    try {
      const result = await generatePostMutation.mutateAsync({
        product_id: product.id,
      });

      // Parse the response to extract the generated posts
      if (result && result.response) {
        try {
          const parsed = JSON.parse(result.response);
          let postsList = [];

          if (typeof parsed === "object" && parsed.response) {
            postsList = Array.isArray(parsed.response) ? parsed.response : [];
          } else if (Array.isArray(parsed)) {
            postsList = parsed;
          }

          // Transform the posts to match the expected format
          const transformedPosts = postsList.map((post, index) => {
            // Clean up subreddit name - remove "r/" prefix if it exists
            let subredditName = post["r/subreddit"] || post.subreddit || "";
            if (subredditName.startsWith("r/")) {
              subredditName = subredditName.substring(2);
            }

            return {
              id: `new-${Date.now()}-${index}`,
              title: post.Title || post.title || "",
              description: post.Post || post.description || "",
              subreddit: subredditName,
              created_at: new Date().toISOString(),
              isNew: true,
            };
          });

          addNewlyGeneratedPosts(transformedPosts);
        } catch (parseError) {
          console.error("Failed to parse generated posts:", parseError);
        }
      }

      // Show success toast
      toast("Posts generated successfully!", {
        duration: 2000,
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
    } catch (error) {
      // Error handled by mutation
    } finally {
      // Clear persistent loading state
      setGeneratingPosts(false);
    }
  };

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setEditedTitle(post.title || "");
    setEditedPostText(post.description || "");
    setOriginalTitle(post.title || "");
    setOriginalPostText(post.description || "");
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
    setEditedTitle("");
    setEditedPostText("");
    setOriginalTitle("");
    setOriginalPostText("");
  };

  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage("Content copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setSnackbarMessage("Failed to copy to clipboard. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleResetChanges = () => {
    setEditedTitle(originalTitle);
    setEditedPostText(originalPostText);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSavePost = async (postId) => {
    // Optimistically update the UI
    setOptimisticSaves((prev) => new Set([...prev, postId]));

    try {
      await markAsSavedMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Failed to save post:", error);
      // Revert optimistic update on error
      setOptimisticSaves((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleUnsavePost = async (postId) => {
    // Optimistically update the UI
    setOptimisticSaves((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });

    try {
      await markAsUnsavedMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Failed to unsave post:", error);
      // Revert optimistic update on error
      setOptimisticSaves((prev) => new Set([...prev, postId]));
    }
  };

  // Combine existing posts with newly generated posts
  const allPosts = [...(posts || []), ...newlyGeneratedPosts];

  // Filter and sort posts
  const filteredPosts = allPosts.filter((post) => {
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

    // Save filter
    if (saveFilter !== "all") {
      const isOptimisticallySaved = optimisticSaves.has(post.id);
      const effectiveSaveStatus = post.read || isOptimisticallySaved;

      if (saveFilter === "saved" && !effectiveSaveStatus) {
        return false;
      }
    }

    return true;
  });

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
    ...new Set(allPosts.map((post) => post.subreddit).filter(Boolean)),
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSubredditFilter("all");
    setDateFilter("all");
    setSortBy("newest");
    setSaveFilter("all");
  };

  const hasActiveFilters =
    searchTerm ||
    subredditFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest" ||
    saveFilter !== "all";

  // Handle scrolling to specific post from URL parameter
  useEffect(() => {
    if (highlightId && postRefs.current[highlightId]) {
      setTimeout(() => {
        if (postRefs.current[highlightId]) {
          postRefs.current[highlightId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Add highlight effect
          postRefs.current[highlightId].classList.add(
            "ring-2",
            "ring-orange-500",
            "ring-opacity-50"
          );
          setTimeout(() => {
            if (postRefs.current[highlightId]) {
              postRefs.current[highlightId].classList.remove(
                "ring-2",
                "ring-orange-500",
                "ring-opacity-50"
              );
            }
          }, 3000);
        }
      }, 500);
    }
  }, [highlightId, sortedPosts]);

  const shouldAnimate = !isGeneratingPosts;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldAnimate ? { duration: 0.3, ease: "easeOut" } : { duration: 0 }
      }
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
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
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
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldAnimate ? { duration: 0.3, delay: 0.1 } : { duration: 0 }
            }
            className="space-y-6"
          >
            {/* Action Card */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimate ? { duration: 0.3, delay: 0.1 } : { duration: 0 }
              }
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
                disabled={isGeneratingPosts || !product}
                className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isGeneratingPosts ? "Generating..." : "Generate Post"}
              </Button>
            </motion.div>

            {/* Filter Card */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimate ? { duration: 0.3, delay: 0.2 } : { duration: 0 }
              }
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Action buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setSaveFilter("all")}
                    variant="ghost"
                    className={
                      saveFilter === "all"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    All Posts
                  </Button>

                  <Button
                    onClick={() => setSaveFilter("saved")}
                    variant="ghost"
                    className={
                      saveFilter === "saved"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    Saved Posts
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Right side - Filters */}
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  {/* Subreddit Filter */}
                  <select
                    value={subredditFilter}
                    onChange={(e) => setSubredditFilter(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="all">All Subreddits</option>
                    {uniqueSubreddits.map((subreddit) => (
                      <option key={subreddit} value={subreddit}>
                        r/{subreddit}
                      </option>
                    ))}
                  </select>

                  {/* Date Filter */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="subreddit">By Subreddit</option>
                  </select>

                  {/* Post count */}
                  <div className="text-sm text-gray-500">
                    {sortedPosts.length} of {allPosts.length}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      shouldAnimate
                        ? { duration: 0.2, delay: 0.3 + index * 0.05 }
                        : { duration: 0 }
                    }
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow flex flex-col justify-between"
                    ref={(el) => (postRefs.current[post.id] = el)}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                          r/{post.subreddit || "unknown"}
                        </span>
                        {post.isNew && (
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {post.created_at
                            ? `Created ${new Date(
                                post.created_at
                              ).toLocaleDateString()}`
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="relative mb-3">
                        <p className="text-gray-700 text-sm whitespace-pre-line line-clamp-4">
                          {post.description}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        onClick={() => handleOpenPostModal(post)}
                        variant="outline"
                        className="px-3 py-2"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span>View Post</span>
                      </Button>
                      {(() => {
                        const isOptimisticallySaved = optimisticSaves.has(
                          post.id
                        );
                        const isSaved = post.read || isOptimisticallySaved;

                        return (
                          <Button
                            onClick={() =>
                              isSaved
                                ? handleUnsavePost(post.id)
                                : handleSavePost(post.id)
                            }
                            variant="outline"
                            className={`px-3 py-2 transition-all duration-200 ${
                              isSaved
                                ? "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400"
                                : "hover:bg-gray-50"
                            }`}
                            title={isSaved ? "Unsave post" : "Save post"}
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            <span>{isSaved ? "Saved" : "Save"}</span>
                          </Button>
                        );
                      })()}
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
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Generation Overlay Loader (cover content area only) */}
      <AnimatePresence>
        {isGeneratingPosts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
            style={{ clipPath: "inset(0 0 0 16rem)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-sm text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Generating your post...
              </h3>
              <p className="text-sm text-gray-500">
                This may take ~15–30 seconds.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post View/Edit Modal */}
      <AnimatePresence>
        {showPostModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClosePostModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={handleClosePostModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
              <div className="p-6 pt-2">
                <div className="max-w-4xl mx-auto">
                  {/* Single Editable Post Column */}
                  <div className="bg-white p-0">
                    {/* Title Textarea */}
                    <div className="mb-4 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Post Title (Edit this section to make it your own)
                        </label>
                        <motion.button
                          onClick={() => handleCopyToClipboard(editedTitle)}
                          className="text-gray-400 hover:text-[#FF4500] transition-colors ml-2"
                          title="Copy title to clipboard"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                      <textarea
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500] resize-none leading-snug"
                        placeholder="Enter your post title..."
                        style={{ minHeight: "2.5rem", maxHeight: "4.5rem" }}
                      />
                    </div>
                    {/* Post Textarea */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Post Content (Edit this section to make it your own)
                        </label>
                        <motion.button
                          onClick={() => handleCopyToClipboard(editedPostText)}
                          className="text-gray-400 hover:text-[#FF4500] transition-colors ml-2"
                          title="Copy content to clipboard"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                      <textarea
                        value={editedPostText}
                        onChange={(e) => setEditedPostText(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500] resize-none"
                        placeholder="Enter your post content..."
                      />
                    </div>
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {/* Post to Reddit Button */}
                      <Button
                        onClick={() =>
                          window.open(
                            `https://www.reddit.com/r/${selectedPost.subreddit}/submit`,
                            "_blank"
                          )
                        }
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium mr-1"
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-[#FF4500]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                        </svg>
                        Post to Reddit
                      </Button>
                      {/* Reset Changes Button */}
                      <Button
                        onClick={handleResetChanges}
                        variant="outline"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar for copy success/failure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {snackbarMessage}
        </div>
      </Snackbar>

      {/* Sonner Toaster */}
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          classNames: {
            toast: "max-w-xs p-3",
            closeButton: "hidden",
          },
        }}
      />
    </motion.div>
  );
}

export default Posts;

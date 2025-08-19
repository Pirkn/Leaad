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
  TriangleAlert,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useSearchParams } from "react-router-dom";

function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
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
    removeNewlyGeneratedPost,
    updateNewlyGeneratedPost,
    isGeneratingPosts,
    setGeneratingPosts,
  } = usePostsContext();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPostText, setEditedPostText] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalPostText, setOriginalPostText] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [subredditFilter, setSubredditFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [saveFilter, setSaveFilter] = useState("all"); // "all" or "saved"
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Save functionality states - track both saved and unsaved posts optimistically
  const [optimisticSaves, setOptimisticSaves] = useState(new Set());
  const [optimisticUnsaves, setOptimisticUnsaves] = useState(new Set());

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

      // Extract the generated posts from the response
      if (result && result.response) {
        try {
          let parsed;

          // Check if result.response is already an object or needs to be parsed
          if (typeof result.response === "string") {
            parsed = JSON.parse(result.response);
          } else {
            parsed = result.response;
          }

          let postsList = [];

          // The generate-reddit-post endpoint returns { "response": [...] }
          // while get-reddit-posts returns [...] directly
          if (parsed && parsed.response && Array.isArray(parsed.response)) {
            postsList = parsed.response;
          } else if (Array.isArray(parsed)) {
            postsList = parsed;
          }

          // Transform the posts to match the expected format
          const transformedPosts = postsList.map((post, index) => ({
            id: post.id || `new-${Date.now()}-${index}`,
            title: post.title || "",
            description: post.description || "",
            subreddit: post.subreddit || "",
            created_at: post.created_at || new Date().toISOString(),
            isNew: true,
            source: "generated",
          }));

          // Add to newly generated posts context - this will make them immediately visible
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
      console.error("Error generating posts:", error);
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

  const handleCopyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      const message =
        type === "title"
          ? "Title copied to clipboard!"
          : "Content copied to clipboard!";
      toast(message, {
        duration: 2000,
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      const errorMessage =
        type === "title"
          ? "Failed to copy title. Please try again."
          : "Failed to copy content. Please try again.";
      toast(errorMessage, {
        duration: 3000,
        icon: <TriangleAlert className="w-4 h-4 text-red-600" />,
      });
    }
  };

  const handleResetChanges = () => {
    setEditedTitle(originalTitle);
    setEditedPostText(originalPostText);
  };

  const handleSavePost = async (postId) => {
    // Optimistically update the UI
    setOptimisticSaves((prev) => new Set([...prev, postId]));

    // Clear any optimistic unsave for this post
    setOptimisticUnsaves((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });

    // Mark the post as saved in the newly generated posts context
    // This ensures it shows up in the saved filter
    updateNewlyGeneratedPost(postId, { read: true });

    // Show success toast immediately
    toast("Post saved successfully!", {
      duration: 2000,
      icon: <CircleCheck className="w-4 h-4 text-green-600" />,
    });

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
      // Also revert the context update
      updateNewlyGeneratedPost(postId, { read: false });
      // Show error toast
      toast("Failed to save post. Please try again.", {
        duration: 3000,
        icon: <TriangleAlert className="w-4 h-4 text-red-600" />,
      });
    }
  };

  const handleUnsavePost = async (postId) => {
    // Track that this post was optimistically unsaved
    setOptimisticUnsaves((prev) => new Set([...prev, postId]));

    // Also update newly generated posts if this post exists there
    updateNewlyGeneratedPost(postId, { read: false });

    // Show success toast immediately
    toast("Post unsaved!", {
      duration: 2000,
      icon: <CircleCheck className="w-4 h-4 text-green-600" />,
    });

    try {
      await markAsUnsavedMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Failed to unsave post:", error);
      // Revert optimistic update on error
      setOptimisticUnsaves((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      // Also revert the context update
      updateNewlyGeneratedPost(postId, { read: true });
      // Show error toast
      toast("Failed to unsave post. Please try again.", {
        duration: 3000,
        icon: <TriangleAlert className="w-4 h-4 text-red-600" />,
      });
    }
  };

  // Combine existing posts with newly generated posts
  // Ensure newly generated posts are always shown first and don't get lost
  const allPosts = [
    ...newlyGeneratedPosts,
    ...(posts || []).filter(
      (existingPost) =>
        // Don't show existing posts that have the same ID as newly generated ones
        !newlyGeneratedPosts.some(
          (newPost) => newPost.id === existingPost.id
        ) &&
        // Also filter out any posts that might have the same content (extra safety)
        !newlyGeneratedPosts.some(
          (newPost) =>
            newPost.title === existingPost.title &&
            newPost.description === existingPost.description
        )
    ),
  ];

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
      const isOptimisticallyUnsaved = optimisticUnsaves.has(post.id);

      // If post was optimistically unsaved, treat it as unsaved regardless of original status
      if (isOptimisticallyUnsaved) {
        if (saveFilter === "saved") {
          return false;
        }
      } else {
        // Use optimistic save status or original read status
        const effectiveSaveStatus = post.read || isOptimisticallySaved;
        if (saveFilter === "saved" && !effectiveSaveStatus) {
          return false;
        }
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
    setPreviousFilterState({
      saveFilter,
      subredditFilter,
      dateFilter,
      sortBy,
    });
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
          // Clear the highlight param so it only triggers once
          setTimeout(() => {
            setSearchParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.delete("highlight");
                return next;
              },
              { replace: true }
            );
          }, 50);
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
  }, [highlightId, sortedPosts, setSearchParams]);

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

  const [previousFilterState, setPreviousFilterState] = useState({
    saveFilter: "all",
    subredditFilter: "all",
    dateFilter: "all",
    sortBy: "newest",
  });

  const [lastNewlyGeneratedCount, setLastNewlyGeneratedCount] = useState(0);

  // Monitor newlyGeneratedPosts changes to trigger animation
  useEffect(() => {
    if (newlyGeneratedPosts.length > lastNewlyGeneratedCount) {
      // New posts were added, trigger animation
      setLastNewlyGeneratedCount(newlyGeneratedPosts.length);
    }
  }, [newlyGeneratedPosts, lastNewlyGeneratedCount]);

  const shouldAnimate = !isGeneratingPosts;

  // Check if filters actually changed
  const filtersChanged =
    previousFilterState.saveFilter !== saveFilter ||
    previousFilterState.subredditFilter !== subredditFilter ||
    previousFilterState.dateFilter !== dateFilter ||
    previousFilterState.sortBy !== sortBy;

  // Always animate when switching between Saved/All views for better UX
  const shouldAnimateSaveFilter = saveFilter !== previousFilterState.saveFilter;

  // Check if new posts were added
  const newPostsAdded = newlyGeneratedPosts.length > lastNewlyGeneratedCount;

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
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col space-y-4 min-[660px]:flex-row min-[660px]:items-center min-[660px]:justify-between min-[660px]:space-y-0"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1 min-[660px]:mb-1 max-[660px]:mb-2">
                  Generate New Posts
                </h2>
                <p className="text-gray-600 text-sm max-[500px]:text-xs">
                  <span className="max-[420px]:hidden">
                    Click the button to generate new posts for your product.
                  </span>
                  <span className="hidden max-[420px]:inline">
                    Click the button to generate new posts.
                  </span>
                </p>
              </div>
              <Button
                onClick={handleGeneratePost}
                disabled={isGeneratingPosts || !product}
                className="bg-[#FF4500] hover:bg-[#CC3700] text-white w-full min-[660px]:w-auto"
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
              <div className="flex flex-col space-y-4 max-[500px]:space-y-3 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between min-[500px]:space-y-0">
                {/* Top row - Action buttons */}
                <div className="hidden min-[500px]:flex items-center space-x-2">
                  <Button
                    onClick={() => {
                      setPreviousFilterState({
                        saveFilter,
                        subredditFilter,
                        dateFilter,
                        sortBy,
                      });
                      setSaveFilter("all");
                    }}
                    variant="ghost"
                    className={
                      saveFilter === "all"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    All
                  </Button>

                  <Button
                    onClick={() => {
                      setPreviousFilterState({
                        saveFilter,
                        subredditFilter,
                        dateFilter,
                        sortBy,
                      });
                      setSaveFilter("saved");
                    }}
                    variant="ghost"
                    className={
                      saveFilter === "saved"
                        ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    Saved
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

                {/* Bottom row - Search and Filter */}
                <div className="flex items-center space-x-2">
                  {/* Search - keep visible for quick access */}
                  <div className="relative flex-1 min-[500px]:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                      {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full"></span>
                      )}
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                        <div className="space-y-4">
                          {/* All/Saved Filter - Only show under 500px */}
                          <div className="min-[500px]:hidden">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              View
                            </label>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setPreviousFilterState({
                                    saveFilter,
                                    subredditFilter,
                                    dateFilter,
                                    sortBy,
                                  });
                                  setSaveFilter("all");
                                  setShowFilterDropdown(false);
                                }}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                  saveFilter === "all"
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                All
                              </button>
                              <button
                                onClick={() => {
                                  setPreviousFilterState({
                                    saveFilter,
                                    subredditFilter,
                                    dateFilter,
                                    sortBy,
                                  });
                                  setSaveFilter("saved");
                                  setShowFilterDropdown(false);
                                }}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                  saveFilter === "saved"
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                Saved
                              </button>
                            </div>
                          </div>

                          {/* Subreddit Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subreddit
                            </label>
                            <select
                              value={subredditFilter}
                              onChange={(e) => {
                                setPreviousFilterState({
                                  saveFilter,
                                  subredditFilter,
                                  dateFilter,
                                  sortBy,
                                });
                                setSubredditFilter(e.target.value);
                              }}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Posted Date
                            </label>
                            <select
                              value={dateFilter}
                              onChange={(e) => {
                                setPreviousFilterState({
                                  saveFilter,
                                  subredditFilter,
                                  dateFilter,
                                  sortBy,
                                });
                                setDateFilter(e.target.value);
                              }}
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
                              value={sortBy}
                              onChange={(e) => {
                                setPreviousFilterState({
                                  saveFilter,
                                  subredditFilter,
                                  dateFilter,
                                  sortBy,
                                });
                                setSortBy(e.target.value);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            >
                              <option value="newest">Newest First</option>
                              <option value="oldest">Oldest First</option>
                              <option value="subreddit">By Subreddit</option>
                            </select>
                          </div>

                          {/* Post count */}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="text-sm text-gray-500 mb-3">
                              {sortedPosts.length} of {allPosts.length} posts
                            </div>
                            <Button
                              onClick={() => {
                                setSubredditFilter("all");
                                setDateFilter("all");
                                setSortBy("newest");
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
                </div>
              </div>
            </motion.div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={
                      shouldAnimate &&
                      (filtersChanged ||
                        shouldAnimateSaveFilter ||
                        newPostsAdded)
                        ? { opacity: 0, y: 20 }
                        : false
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      shouldAnimate &&
                      (filtersChanged ||
                        shouldAnimateSaveFilter ||
                        newPostsAdded)
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
                    <div className="grid grid-cols-2 gap-2 mt-3 lg:flex lg:items-center lg:grid-cols-none">
                      <Button
                        onClick={() => handleOpenPostModal(post)}
                        variant="outline"
                        className="px-3 py-2 w-full lg:w-auto"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span>View</span>
                      </Button>
                      {(() => {
                        const isOptimisticallySaved = optimisticSaves.has(
                          post.id
                        );
                        const isOptimisticallyUnsaved = optimisticUnsaves.has(
                          post.id
                        );
                        const isSaved =
                          (post.read || isOptimisticallySaved) &&
                          !isOptimisticallyUnsaved;

                        return (
                          <Button
                            onClick={() =>
                              isSaved
                                ? handleUnsavePost(post.id)
                                : handleSavePost(post.id)
                            }
                            variant="outline"
                            className={`px-3 py-2 transition-all duration-200 w-full lg:w-auto ${
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
                          className="px-3 py-2 w-full lg:w-auto"
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
            className="fixed top-16 lg:top-0 left-0 right-0 bottom-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center lg:left-64"
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
                This may take ~10–15 seconds.
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
                          onClick={() =>
                            handleCopyToClipboard(editedTitle, "title")
                          }
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
                          onClick={() =>
                            handleCopyToClipboard(editedPostText, "content")
                          }
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

      {/* Sonner Toaster */}
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          classNames: {
            toast:
              "bg-white text-gray-900 border border-gray-200 shadow-lg rounded-lg px-3 py-2 max-w-xs",
            content: "text-gray-900 text-sm",
            title: "text-gray-900 text-sm",
            description: "text-gray-700 text-xs",
            icon: "hidden",
            successIcon: "hidden",
            infoIcon: "hidden",
            warningIcon: "hidden",
            errorIcon: "hidden",
            loadingIcon: "hidden",
          },
        }}
      />
    </motion.div>
  );
}

export default Posts;

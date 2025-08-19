import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import staticDataService from "../services/staticData";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Toaster, toast } from "sonner";
import { CircleCheck } from "lucide-react";
import redditPng from "../assets/reddit.png";

function ViralTemplates() {
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSubredditDropdown, setShowSubredditDropdown] = useState(false);
  const subredditDropdownRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = "Templates | Leaad";
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showSubredditDropdown) return;
    function handleClickOutside(event) {
      if (
        subredditDropdownRef.current &&
        !subredditDropdownRef.current.contains(event.target)
      ) {
        // Close dropdown immediately and trigger smooth closing animation (same as button click)
        setShowSubredditDropdown(false);

        // Trigger the same smooth closing animation as the button click
        if (subredditDropdownRef.current) {
          const element = subredditDropdownRef.current;
          let scrollContainer =
            element.closest(".overflow-y-auto") ||
            element.closest('[class*="max-h"]') ||
            document.querySelector(".fixed.inset-0 .overflow-y-auto");

          if (scrollContainer) {
            const currentScroll = scrollContainer.scrollTop;
            // Same smooth closing animation
            animate(currentScroll, currentScroll - 80, {
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              onUpdate: (value) => {
                scrollContainer.scrollTop = Math.max(0, value);
              },
            });
          }
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubredditDropdown]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Template editing states
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPostText, setEditedPostText] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalPostText, setOriginalPostText] = useState("");

  // Get all viral posts once - static data is immediately available
  const allPosts = useMemo(() => staticDataService.getViralPosts(), []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return staticDataService.getViralPostsWithFilters({
      searchTerm,
      engagementFilter,
      sortBy,
    });
  }, [searchTerm, engagementFilter, sortBy]);

  const handleOpenTemplateModal = (template) => {
    setSelectedTemplate(template);
    setEditedTitle(template.postTitle || template.title || "");
    setEditedPostText(template.postText || template.originalPostText || "");
    setOriginalTitle(template.postTitle || template.title || "");
    setOriginalPostText(template.postText || template.originalPostText || "");
    setShowTemplateModal(true);
  };

  const handleCloseTemplateModal = () => {
    setShowTemplateModal(false);
    setSelectedTemplate(null);
    setEditedTitle("");
    setEditedPostText("");
    setOriginalTitle("");
    setOriginalPostText("");
  };

  const handleCopyToClipboard = async () => {
    const content = `${editedTitle}\n\n${editedPostText}`;
    try {
      await navigator.clipboard.writeText(content);
      toast("Template copied to clipboard!", {
        duration: 2000,
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast("Failed to copy to clipboard. Please try again.", {
        duration: 2000,
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
    }
  };

  const handleResetChanges = () => {
    setEditedTitle(originalTitle);
    setEditedPostText(originalPostText);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEngagementFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || engagementFilter !== "all" || sortBy !== "newest";

  // Helper to open Reddit create post in new tab
  const handleOpenRedditPost = (subreddit) => {
    if (!subreddit) return;
    window.open(`https://www.reddit.com/r/${subreddit}/submit`, "_blank");
    setShowSubredditDropdown(false);
  };

  return (
    <>
      <SEOHead title="Templates" url="https://leaad.co/app/templates" noindex />
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Viral Templates
            </h1>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6 bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF4500] focus:border-[#FF4500]"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              {/* Engagement Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Engagement:
                </label>
                <select
                  value={engagementFilter}
                  onChange={(e) => setEngagementFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF4500] focus:border-[#FF4500] text-sm min-w-0 max-w-32 sm:max-w-40"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF4500] focus:border-[#FF4500] text-sm min-w-0 max-w-32 sm:max-w-40"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-engaged">Most Engaged</option>
                  <option value="most-commented">Most Commented</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors self-start sm:self-center"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredPosts.length} of {allPosts.length} templates
            {hasActiveFilters && (
              <span className="ml-2 text-[#FF4500] font-medium">
                (filtered)
              </span>
            )}
          </div>
        </motion.div>

        {/* Viral Posts from Static Data */}
        {filteredPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mb-8"
          >
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + index * 0.05,
                    ease: "easeOut",
                  }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow flex flex-col h-52"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 h-16 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 pr-2 leading-tight">
                        {post.title ||
                          post.originalPostTitle ||
                          `Viral Post ${index + 1}`}
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700 flex-shrink-0">
                        Viral
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-sm text-gray-600 mb-3 flex-1 relative overflow-hidden">
                      <div className="line-clamp-1">
                        {post.originalPostText?.substring(0, 80) ||
                          "No content available"}
                      </div>
                      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent"></div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center space-x-4 mt-auto">
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {post.upvotes || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {post.comments || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleOpenTemplateModal(post)}
                        className="text-[#FF4500] hover:text-[#CC3700] text-xs font-medium flex items-center space-x-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit Template</span>
                      </button>
                      {post.originalPostUrl && (
                        <a
                          href={post.originalPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center space-x-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          <span>View Original</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : hasActiveFilters ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No viral posts available
            </h3>
            <p className="text-gray-500">Check back later for new templates</p>
          </div>
        )}

        {/* Template Editing Modal */}
        <AnimatePresence>
          {showTemplateModal && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCloseTemplateModal}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-gray-200 rounded-lg w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Only close button, no sticky header or divider */}
                <div className="flex justify-end px-6 pt-6">
                  <button
                    onClick={handleCloseTemplateModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6 pt-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editable Template Column */}
                    <div className="bg-white p-0">
                      {/* Title Textarea */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Template Title (Edit this section to make it your
                            own)
                          </label>
                          <motion.button
                            onClick={() => {
                              navigator.clipboard.writeText(editedTitle);
                              toast("Title copied to clipboard!", {
                                duration: 2000,
                                icon: (
                                  <CircleCheck className="w-4 h-4 text-green-600" />
                                ),
                              });
                            }}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none leading-snug"
                          placeholder="Enter your post title..."
                          style={{ minHeight: "2.5rem", maxHeight: "4.5rem" }}
                        />
                      </div>
                      {/* Post Textarea */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Template Content (Edit this section to make it your
                            own)
                          </label>
                          <motion.button
                            onClick={() => {
                              navigator.clipboard.writeText(editedPostText);
                              toast("Content copied to clipboard!", {
                                duration: 2000,
                                icon: (
                                  <CircleCheck className="w-4 h-4 text-green-600" />
                                ),
                              });
                            }}
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
                          rows={18}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                          placeholder="Enter your post content..."
                        />
                      </div>
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        {/* Post to Reddit Button and Dropdown */}
                        <div className="relative" ref={subredditDropdownRef}>
                          <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium mr-1"
                            onClick={(e) => {
                              setShowSubredditDropdown((prev) => {
                                const newState = !prev;

                                if (newState) {
                                  // Opening: Smooth scroll down
                                  setTimeout(() => {
                                    if (subredditDropdownRef.current) {
                                      const element =
                                        subredditDropdownRef.current;
                                      let scrollContainer =
                                        element.closest(".overflow-y-auto") ||
                                        element.closest('[class*="max-h"]') ||
                                        document.querySelector(
                                          ".fixed.inset-0 .overflow-y-auto"
                                        );

                                      if (scrollContainer) {
                                        const currentScroll =
                                          scrollContainer.scrollTop;
                                        // Store original position for closing animation
                                        subredditDropdownRef.current._originalScrollTop =
                                          currentScroll;

                                        // Scroll down more for better visibility
                                        animate(
                                          currentScroll,
                                          currentScroll + 160,
                                          {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            onUpdate: (value) => {
                                              scrollContainer.scrollTop = value;
                                            },
                                          }
                                        );
                                      }
                                    }
                                  }, 100);
                                } else {
                                  // Closing: Smooth scroll to compensate for dropdown height reduction
                                  if (subredditDropdownRef.current) {
                                    const element =
                                      subredditDropdownRef.current;
                                    let scrollContainer =
                                      element.closest(".overflow-y-auto") ||
                                      element.closest('[class*="max-h"]') ||
                                      document.querySelector(
                                        ".fixed.inset-0 .overflow-y-auto"
                                      );

                                    if (scrollContainer) {
                                      const currentScroll =
                                        scrollContainer.scrollTop;
                                      // Slower, more seamless scroll to match dropdown fade-out
                                      animate(
                                        currentScroll,
                                        currentScroll - 80,
                                        {
                                          duration: 0.4,
                                          ease: [0.25, 0.46, 0.45, 0.94], // Same smooth easing as opening
                                          onUpdate: (value) => {
                                            scrollContainer.scrollTop =
                                              Math.max(0, value);
                                          },
                                        }
                                      );
                                    }
                                  }
                                }

                                return newState;
                              });
                            }}
                          >
                            {/* Reddit Icon as image */}
                            <img
                              src={redditPng}
                              alt="Reddit"
                              className="w-5 h-5 mr-2 object-contain"
                              style={{ display: "inline-block" }}
                            />
                            Post to Reddit
                            {/* Chevron Down Icon */}
                            <svg
                              className="w-4 h-4 ml-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {/* Dropdown for recommended subreddits */}
                          <AnimatePresence>
                            {showSubredditDropdown &&
                              selectedTemplate?.recommendedSubreddits && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: "easeOut",
                                  }}
                                  className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                >
                                  <div className="py-2">
                                    {selectedTemplate.recommendedSubreddits.map(
                                      (sub, idx) => (
                                        <button
                                          key={sub}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF4500] transition-colors"
                                          onClick={() =>
                                            handleOpenRedditPost(
                                              sub.replace(/^r\//, "")
                                            )
                                          }
                                        >
                                          {sub.startsWith("r/")
                                            ? sub
                                            : `r/${sub}`}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </div>
                        {/* Reset Changes Button */}
                        <button
                          onClick={handleResetChanges}
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
                        </button>
                      </div>
                    </div>
                    {/* Original Post Column */}
                    <div className="bg-white p-0">
                      {/* Title Textarea */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Original Title
                          </label>
                          <motion.button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedTemplate.originalPostTitle ||
                                  selectedTemplate.title
                              );
                              toast("Title copied to clipboard!", {
                                duration: 2000,
                                icon: (
                                  <CircleCheck className="w-4 h-4 text-green-600" />
                                ),
                              });
                            }}
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
                          value={
                            selectedTemplate.originalPostTitle ||
                            selectedTemplate.title
                          }
                          readOnly
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 resize-none leading-snug"
                          style={{ minHeight: "2.5rem", maxHeight: "4.5rem" }}
                        />
                      </div>
                      {/* Post Textarea */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Original Content
                          </label>
                          <motion.button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedTemplate.originalPostText ||
                                  selectedTemplate.postText
                              );
                              toast("Content copied to clipboard!", {
                                duration: 2000,
                                icon: (
                                  <CircleCheck className="w-4 h-4 text-green-600" />
                                ),
                              });
                            }}
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
                          value={
                            selectedTemplate.originalPostText ||
                            selectedTemplate.postText
                          }
                          readOnly
                          rows={18}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 resize-none"
                          style={{ whiteSpace: "pre-wrap" }}
                        />
                      </div>
                      {/* How to use section */}
                      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="text-base font-semibold text-orange-900 mb-1">
                          How to use this template
                        </h4>
                        <ol className="list-decimal list-inside text-sm text-orange-900 space-y-1 pl-2">
                          <li>Copy the template above.</li>
                          <li>Edit it to fit your product or message.</li>
                          <li>Post it to your favorite subreddit.</li>
                          <li>
                            Follow subreddit rules and engage with the community
                            for best results.
                          </li>
                        </ol>
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
              toast: "max-w-xs p-3",
              closeButton: "hidden",
            },
          }}
        />
      </motion.div>
    </>
  );
}

export default ViralTemplates;

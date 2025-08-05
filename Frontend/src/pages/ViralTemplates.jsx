import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useApi";
import staticDataService from "../services/staticData";
import { motion, AnimatePresence } from "framer-motion";

function ViralTemplates() {
  const navigate = useNavigate();
  const [showProductModal, setShowProductModal] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // Get user's products
  const { data: productsData, isLoading: productsLoading } = useProducts();

  // Function to get product icon
  const getProductIcon = () => {
    return (
      <svg
        className="w-5 h-5 text-[#FF4500]"
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
    );
  };

  const handleGenerateRedditPost = (product) => {
    navigate("/reddit-posts", { state: { product } });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEngagementFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || engagementFilter !== "all" || sortBy !== "newest";

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Viral Templates
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-[#FF4500] text-white px-3 py-2 rounded-md hover:bg-[#CC3700] transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow-md"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Generate your own
            </button>
          </motion.div>
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
            <span className="ml-2 text-[#FF4500] font-medium">(filtered)</span>
          )}
        </div>
      </motion.div>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-[#FF4500] mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select a Product
                  </h3>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
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

              {productsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4500] mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading products...</p>
                </div>
              ) : productsData?.products && productsData.products.length > 0 ? (
                <div className="space-y-3">
                  {productsData.products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setShowProductModal(false);
                        handleGenerateRedditPost(product);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#FF4500]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          {getProductIcon()}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {product.target_audience ||
                              "No target audience specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products available
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You need to create a product first to generate posts.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors text-sm font-medium"
                  >
                    Create Product
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors flex flex-col h-52"
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
                    <Link
                      to={`/viral-templates/${post.id}`}
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Use as Template</span>
                    </Link>
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
    </motion.div>
  );
}

export default ViralTemplates;

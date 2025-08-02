import { useState, useMemo } from "react";
import { useViralPosts, useRedditPostGeneration } from "../hooks/useApi";

function ViralTemplates() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // TanStack Query hooks
  const { data: viralPosts = [], isLoading, error } = useViralPosts();
  const {
    formData,
    setFormData,
    generatePost,
    generateOptimisticPost,
    isGenerating,
    error: generationError,
  } = useRedditPostGeneration();

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = viralPosts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.originalPostText
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Engagement filter
    if (engagementFilter !== "all") {
      filtered = filtered.filter((post) => {
        const upvotes = post.upvotes || 0;
        const comments = post.comments || 0;

        switch (engagementFilter) {
          case "high":
            return upvotes > 1000 || comments > 100;
          case "medium":
            return (
              (upvotes >= 100 && upvotes <= 1000) ||
              (comments >= 10 && comments <= 100)
            );
          case "low":
            return upvotes < 100 && comments < 10;
          default:
            return true;
        }
      });
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "most-engaged":
          return (b.upvotes || 0) - (a.upvotes || 0);
        case "most-commented":
          return (b.comments || 0) - (a.comments || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [viralPosts, searchTerm, engagementFilter, sortBy]);

  const handleGeneratePost = async (e) => {
    e.preventDefault();
    try {
      const response = await generatePost(formData);
      setGeneratedPost(response.response);
      setShowGenerateForm(false);
      // Reset form
      setFormData({
        productName: "",
        productDescription: "",
        productTargetAudience: "",
        productMainBenefit: "",
        productWebsiteLink: "",
      });
    } catch (error) {
      console.error("Failed to generate Reddit post:", error);
      alert("Failed to generate Reddit post. Please try again.");
    }
  };

  const handleOptimisticGenerate = async (e) => {
    e.preventDefault();
    try {
      const response = await generateOptimisticPost(formData);
      setGeneratedPost(response.response);
      setShowGenerateForm(false);
      // Reset form
      setFormData({
        productName: "",
        productDescription: "",
        productTargetAudience: "",
        productMainBenefit: "",
        productWebsiteLink: "",
      });
    } catch (error) {
      console.error("Failed to generate Reddit post:", error);
      alert("Failed to generate Reddit post. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEngagementFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || engagementFilter !== "all" || sortBy !== "newest";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Viral Templates
        </h1>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="bg-[#3D348B] text-white px-4 py-3 rounded-lg hover:bg-[#2A1F6B] transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow-md"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Generate Reddit Post
        </button>
      </div>

      {/* Generated Post Display */}
      {generatedPost && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Generated Reddit Post
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {generatedPost}
            </p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="text-[#3D348B] hover:text-[#2A1F6B] text-sm font-medium">
              Copy to Clipboard
            </button>
            <button
              onClick={() => setGeneratedPost(null)}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3D348B] focus:border-[#3D348B]"
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3D348B] focus:border-[#3D348B] text-sm min-w-0 max-w-32 sm:max-w-40"
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3D348B] focus:border-[#3D348B] text-sm min-w-0 max-w-32 sm:max-w-40"
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
          Showing {filteredPosts.length} of {viralPosts.length} templates
          {hasActiveFilters && (
            <span className="ml-2 text-[#3D348B] font-medium">(filtered)</span>
          )}
        </div>
      </div>

      {/* Generate Post Form Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generate Reddit Post
            </h3>
            <form onSubmit={handleGeneratePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="productTargetAudience"
                  value={formData.productTargetAudience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Benefit
                </label>
                <textarea
                  name="productMainBenefit"
                  value={formData.productMainBenefit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Link
                </label>
                <input
                  type="url"
                  name="productWebsiteLink"
                  value={formData.productWebsiteLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 bg-[#3D348B] text-white px-4 py-2 rounded-md hover:bg-[#2A1F6B] transition-colors disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Viral Posts
          </h3>
          <p className="text-sm text-red-700">{error.message}</p>
        </div>
      )}

      {/* Viral Posts from API */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D348B]"></div>
          <p className="text-gray-500 mt-2">Loading viral posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id || index}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors flex flex-col h-52 ${
                  post.isOptimistic ? "opacity-75" : ""
                }`}
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
                      {post.isOptimistic ? "Generating..." : "Viral"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                    {post.description ||
                      post.originalPostText?.substring(0, 150) ||
                      "No description available"}
                  </p>

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
                    <button className="text-[#3D348B] hover:text-[#2A1F6B] text-xs font-medium flex items-center space-x-1">
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
              </div>
            ))}
          </div>
        </div>
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
            className="bg-[#3D348B] text-white px-4 py-2 rounded-md hover:bg-[#2A1F6B] transition-colors text-sm font-medium"
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
    </div>
  );
}

export default ViralTemplates;

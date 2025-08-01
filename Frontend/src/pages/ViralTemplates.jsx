import { useState } from "react";
import { useViralPosts, useRedditPostGeneration } from "../hooks/useApi";

function ViralTemplates() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Viral Templates
        </h1>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
        >
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
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
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

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Templates
          </h3>
          <p className="text-2xl font-semibold text-gray-900">89</p>
          <p className="text-xs text-gray-500">+5 this week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Active
          </h3>
          <p className="text-2xl font-semibold text-gray-900">67</p>
          <p className="text-xs text-gray-500">75% of total</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Viral Posts
          </h3>
          <p className="text-2xl font-semibold text-gray-900">
            {viralPosts.length}
          </p>
          <p className="text-xs text-gray-500">From API</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Avg. Engagement
          </h3>
          <p className="text-2xl font-semibold text-gray-900">12.4%</p>
          <p className="text-xs text-gray-500">+2.1% from last month</p>
        </div>
      </div>

      {/* Viral Posts from API */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-gray-500 mt-2">Loading viral posts...</p>
        </div>
      ) : viralPosts.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Viral Posts from Reddit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viralPosts.map((post, index) => (
              <div
                key={post.id || index}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors ${
                  post.isOptimistic ? "opacity-75" : ""
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 pr-4">
                      {post.title ||
                        post.originalPostTitle ||
                        `Viral Post ${index + 1}`}
                    </h3>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700 flex-shrink-0">
                      {post.isOptimistic ? "Generating..." : "Viral"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.description ||
                      post.originalPostText?.substring(0, 150) ||
                      "No description available"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
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

                  {post.recommendedSubreddits &&
                    post.recommendedSubreddits.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Recommended Subreddits:
                        </p>
                        <div className="flex flex-wrap gap-1 line-clamp-1">
                          {post.recommendedSubreddits
                            .slice(0, 3)
                            .map((subreddit, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                              >
                                {subreddit}
                              </span>
                            ))}
                          {post.recommendedSubreddits.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
                              +{post.recommendedSubreddits.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                      Use as Template
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                      Copy
                    </button>
                    {post.originalPostUrl && (
                      <a
                        href={post.originalPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        View Original
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No viral posts available</p>
        </div>
      )}
    </div>
  );
}

export default ViralTemplates;

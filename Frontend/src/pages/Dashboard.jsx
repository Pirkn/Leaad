import { useState } from "react";
import { useAnalyzeProduct, useHealthCheck } from "../hooks/useApi";

function Dashboard() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);

  // TanStack Query hooks
  const analyzeMutation = useAnalyzeProduct();
  const { data: healthData, isLoading: healthLoading } = useHealthCheck();

  const handleAnalyzeProduct = async (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    try {
      await analyzeMutation.mutateAsync(websiteUrl);
      setShowAnalysisForm(false);
    } catch (error) {
      console.error("Failed to analyze product:", error);
      alert("Failed to analyze product. Please check the URL and try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setShowAnalysisForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          Analyze Product
        </button>
      </div>

      {/* Health Status */}
      {healthData && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-700">
              API Status: {healthData.status}
            </span>
          </div>
        </div>
      )}

      {/* Product Analysis Form Modal */}
      {showAnalysisForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analyze Product Website
            </h3>
            <form onSubmit={handleAnalyzeProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={analyzeMutation.isPending}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {analyzeMutation.isPending
                    ? "Analyzing..."
                    : "Analyze Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnalysisForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Analysis Results */}
      {analyzeMutation.data && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Product Analysis Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </h4>
              <p className="text-sm text-gray-900">
                {analyzeMutation.data.target_audience}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-900">
                {analyzeMutation.data.description}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Problem Solved
              </h4>
              <p className="text-sm text-gray-900">
                {analyzeMutation.data.problem_solved}
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Use for Reddit Post
            </button>
            <button
              onClick={() => analyzeMutation.reset()}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {analyzeMutation.isError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Analysis Failed
          </h3>
          <p className="text-sm text-red-700">
            {analyzeMutation.error?.message || "Failed to analyze product"}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Leads
              </p>
              <p className="text-xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Converted
              </p>
              <p className="text-xl font-semibold text-gray-900">567</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Templates
              </p>
              <p className="text-xl font-semibold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 border border-orange-200 rounded-md bg-orange-50">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Viral Posts
              </p>
              <p className="text-xl font-semibold text-gray-900">234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New lead generated from viral template
              </p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Campaign "Summer Sale" completed
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New viral template created
              </p>
              <p className="text-xs text-gray-500">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

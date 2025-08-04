import { useState } from "react";
import {
  useAnalyzeProduct,
  useProductAnalysis,
  useCreateProduct,
} from "../hooks/useApi";

function ProductAnalysis() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [showResults, setShowResults] = useState(false);

  // TanStack Query hooks
  const analyzeMutation = useAnalyzeProduct();
  const createProductMutation = useCreateProduct();
  const {
    data: cachedAnalysis,
    isLoading: isCachedLoading,
    error: cachedError,
  } = useProductAnalysis(websiteUrl, showResults);

  const handleAnalyzeProduct = async (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    try {
      await analyzeMutation.mutateAsync(websiteUrl);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to analyze product:", error);
    }
  };

  const handleClearResults = () => {
    setShowResults(false);
    setWebsiteUrl("");
    setProductName("");
    analyzeMutation.reset();
  };

  const handleSaveProduct = async () => {
    if (!productName.trim() || !analysisData) {
      alert("Please enter a product name and analyze a product first.");
      return;
    }

    try {
      const productData = {
        name: productName,
        url: websiteUrl,
        description: analysisData.description,
        target_audience: analysisData.target_audience,
        problem_solved: analysisData.problem_solved,
      };

      await createProductMutation.mutateAsync(productData);

      // Clear form and show success message
      setProductName("");
      setShowResults(false);
      setWebsiteUrl("");
      analyzeMutation.reset();

      // You could add a success toast here
      alert("Product saved successfully!");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert(`Failed to save product: ${error.message || "Please try again."}`);
    }
  };

  // Use mutation data if available, otherwise use cached data
  const analysisData = analyzeMutation.data || cachedAnalysis;
  const isLoading = analyzeMutation.isPending || isCachedLoading;
  const error = analyzeMutation.error || cachedError;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Analysis
        </h1>
      </div>

      {/* Analysis Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Analyze Product Website
        </h2>
        <form onSubmit={handleAnalyzeProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the website URL of the product you want to analyze
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {error.message ||
                  "Failed to analyze product. Please check the URL and try again."}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#FF4500] text-white px-6 py-2 rounded-md hover:bg-[#CC3700] transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? "Analyzing..." : "Analyze Product"}
            </button>
            {analysisData && (
              <button
                type="button"
                onClick={handleClearResults}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Clear Results
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis Results
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Target Audience */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Target Audience
              </h3>
              <p className="text-sm text-gray-900 leading-relaxed">
                {analysisData.target_audience}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Product Description
              </h3>
              <p className="text-sm text-gray-900 leading-relaxed">
                {analysisData.description}
              </p>
            </div>

            {/* Problem Solved */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Problem Solved
              </h3>
              <p className="text-sm text-gray-900 leading-relaxed">
                {analysisData.problem_solved}
              </p>
            </div>
          </div>

          {/* Product Name Input */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-900 mb-3">
              Save Product
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter a name for this product"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProduct}
                  disabled={
                    createProductMutation.isPending || !productName.trim()
                  }
                  className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createProductMutation.isPending
                    ? "Saving..."
                    : "Save Product"}
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                  Generate Reddit Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!analysisData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to use Product Analysis
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              • Enter the website URL of any product or service you want to
              analyze
            </p>
            <p>
              • Our AI will automatically extract and analyze the product
              information
            </p>
            <p>
              • Get insights about target audience, description, and problems
              solved
            </p>
            <p>
              • Use the results to create better marketing content and Reddit
              posts
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductAnalysis;

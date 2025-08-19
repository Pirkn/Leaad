import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGenerateRedditPost } from "../hooks/useApi";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "../components/SEOHead";

function RedditPosts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [generatedPosts, setGeneratedPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasStartedRef = useRef(false);

  const generateRedditPostMutation = useGenerateRedditPost();

  // Get product data from navigation state
  const product = location.state?.product;

  useEffect(() => {
    if (!product) {
      setError("No product data provided");
      setIsLoading(false);
      return;
    }

    // Prevent multiple API calls
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const generatePosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await generateRedditPostMutation.mutateAsync({
          product_id: product.id,
        });

        // Parse the response if it's a string
        let postsData;
        if (typeof response.response === "string") {
          try {
            postsData = JSON.parse(response.response);
          } catch (parseError) {
            console.error("Failed to parse response:", parseError);
            setError("Failed to parse generated posts");
            return;
          }
        } else {
          postsData = response.response;
        }

        setGeneratedPosts(postsData);
      } catch (error) {
        console.error("Failed to generate Reddit posts:", error);
        setError(error.message || "Failed to generate Reddit posts");
      } finally {
        setIsLoading(false);
      }
    };

    generatePosts();
  }, [product]); // Only depend on product

  const handleBack = () => {
    navigate("/products");
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Copied to clipboard", {
          duration: 2000,
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
        toast("Failed to copy to clipboard", { duration: 2500 });
      });
  };

  const formatSubreddit = (subreddit) => {
    // Remove "r/" prefix if present and format nicely
    return subreddit
      .replace(/^r\//, "")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  return (
    <>
      <SEOHead
        title="Generated Reddit Posts"
        url="https://leaad.co/app/reddit-posts"
        noindex
      />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Products"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Generated Reddit Posts
              </h1>
              {product && (
                <p className="text-sm text-gray-600">for {product.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Generating Reddit posts...</p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Generating Posts
            </h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        )}

        {/* Generated Posts */}
        {!isLoading && !error && generatedPosts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(generatedPosts) ? (
              generatedPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FF4500] text-white">
                          {post["r/subreddit"]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatSubreddit(post["r/subreddit"])}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(`${post.Title}\n\n${post.Post}`)
                        }
                        className="text-[#FF4500] hover:text-[#CC3700] text-sm font-medium"
                      >
                        Copy Post
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Title
                      </h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                        {post.Title}
                      </p>
                    </div>

                    {/* Post Body */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Post Content
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {post.Post}
                        </p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    {post.Reasoning && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Reasoning
                        </h3>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                          <p className="text-sm text-blue-800">
                            {post.Reasoning}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts generated
                </h3>
                <p className="text-gray-500">
                  The response format was unexpected
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default RedditPosts;

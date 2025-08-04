import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGenerateKarmaComment, useGenerateKarmaPost } from "../hooks/useApi";
import karmaService from "../services/karmaService";

function Karma() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("comments");
  const [copiedText, setCopiedText] = useState("");
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);

  // API hooks for generating karma content
  const generateCommentMutation = useGenerateKarmaComment();
  const generatePostMutation = useGenerateKarmaPost();

  // State for storing generated content
  const [generatedComment, setGeneratedComment] = useState(null);
  const [generatedPost, setGeneratedPost] = useState(null);

  // Load stored data from karma service on component mount
  useEffect(() => {
    const storedContent = karmaService.getStoredKarmaContent();

    if (storedContent.comment) {
      setGeneratedComment(storedContent.comment);
    }
    if (storedContent.post) {
      setGeneratedPost(storedContent.post);
    }
  }, []);

  const handleCopyText = (text, type) => {
    // Convert markdown to plain text for copying
    const plainText = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/`(.*?)`/g, "$1") // Remove code markdown
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove link markdown, keep text
      .replace(/#{1,6}\s/g, "") // Remove header markdown
      .replace(/>\s/g, "") // Remove blockquote markdown
      .replace(/\n\s*-\s/g, "\n• ") // Convert markdown lists to bullet points
      .replace(/\n\s*\d+\.\s/g, "\n") // Remove numbered list markdown
      .trim();

    navigator.clipboard.writeText(plainText);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleCopyImage = async (imageUrl, type) => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a ClipboardItem with the image
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      });

      // Copy to clipboard
      await navigator.clipboard.write([clipboardItem]);

      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
      // Fallback to copying URL if image copy fails
      navigator.clipboard.writeText(imageUrl);
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    }
  };

  const handleGenerateComment = async () => {
    try {
      const result = await generateCommentMutation.mutateAsync();
      setGeneratedComment(result);
      localStorage.setItem("karma_comment", JSON.stringify(result));
    } catch (error) {
      console.error("Failed to generate comment:", error);
    }
  };

  const handleGeneratePost = async () => {
    try {
      const result = await generatePostMutation.mutateAsync();
      setGeneratedPost(result);
      localStorage.setItem("karma_post", JSON.stringify(result));
    } catch (error) {
      console.error("Failed to generate post:", error);
    }
  };

  const handleRefreshComments = async () => {
    try {
      setIsBackgroundGenerating(true);
      await karmaService.generateComment();

      // Reload comment content after generation
      const updatedContent = karmaService.getStoredKarmaContent();
      if (updatedContent.comment) {
        setGeneratedComment(updatedContent.comment);
      }
    } catch (error) {
      console.error("Failed to refresh karma comments:", error);
    } finally {
      setIsBackgroundGenerating(false);
    }
  };

  const handleRefreshPosts = async () => {
    try {
      setIsBackgroundGenerating(true);
      await karmaService.generatePost();

      // Reload post content after generation
      const updatedContent = karmaService.getStoredKarmaContent();
      if (updatedContent.post) {
        setGeneratedPost(updatedContent.post);
      }
    } catch (error) {
      console.error("Failed to refresh karma posts:", error);
    } finally {
      setIsBackgroundGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Karma Builder
            </h1>
          </div>
          <p className="text-gray-600">
            Generate optimized comments and posts to help build your Reddit
            karma safely.
          </p>
        </div>
        {isBackgroundGenerating && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm text-blue-800">
                Refreshing karma content... This may take 15-30 seconds.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "comments"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Comments
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Posts
        </button>
      </div>

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI-Generated Comments
                </h2>
              </div>
              <button
                onClick={handleRefreshComments}
                disabled={
                  generateCommentMutation.isPending || isBackgroundGenerating
                }
                className="bg-[#3D348B] text-white px-4 py-2 rounded-md hover:bg-[#2A1F6B] transition-colors disabled:opacity-50 text-sm font-medium flex items-center"
              >
                {generateCommentMutation.isPending || isBackgroundGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
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
                    Generate New Comments
                  </>
                )}
              </button>
            </div>

            {generatedComment ? (
              <div className="space-y-4">
                {(() => {
                  // Parse the response if it's a string, otherwise use as is
                  let comments = generatedComment;
                  if (
                    typeof generatedComment === "object" &&
                    generatedComment.response
                  ) {
                    try {
                      comments = JSON.parse(generatedComment.response);
                    } catch (e) {
                      console.error("Failed to parse comment response:", e);
                      comments = [];
                    }
                  }

                  if (Array.isArray(comments)) {
                    return comments.map((commentData, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            Comment #{index + 1}
                          </h3>
                          <button
                            onClick={() =>
                              handleCopyText(
                                commentData.comment,
                                `comment-${index}`
                              )
                            }
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                            {copiedText === `comment-${index}` ? (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                Copy comment
                              </>
                            )}
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Target Post:
                            </h4>
                            <a
                              href={commentData.post_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm break-all flex items-center"
                            >
                              {commentData.post_title}
                              <svg
                                className="w-4 h-4 ml-1"
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
                            </a>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Subreddit:
                            </h4>
                            <p className="text-gray-700">
                              r/{commentData.subreddit}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Generated Comment:
                            </h4>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                              {commentData.comment
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>"
                                )
                                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                                .replace(
                                  /`(.*?)`/g,
                                  '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>'
                                )
                                .split("\n")
                                .map((line, i) => (
                                  <div key={i} className="mb-1">
                                    {line.startsWith("- ") ? (
                                      <div className="flex items-start">
                                        <span className="mr-2 text-gray-500">
                                          •
                                        </span>
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: line
                                              .substring(2)
                                              .replace(
                                                /\*\*(.*?)\*\*/g,
                                                "<strong>$1</strong>"
                                              )
                                              .replace(
                                                /\*(.*?)\*/g,
                                                "<em>$1</em>"
                                              )
                                              .replace(
                                                /`(.*?)`/g,
                                                '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>'
                                              ),
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: line
                                            .replace(
                                              /\*\*(.*?)\*\*/g,
                                              "<strong>$1</strong>"
                                            )
                                            .replace(
                                              /\*(.*?)\*/g,
                                              "<em>$1</em>"
                                            )
                                            .replace(
                                              /`(.*?)`/g,
                                              '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>'
                                            ),
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-purple-600"
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
                              AI Reasoning:
                            </h4>
                            <p className="text-gray-600 text-sm italic">
                              {commentData.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    ));
                  } else {
                    // Handle single comment (fallback)
                    return (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            Generated Comment
                          </h3>
                          <button
                            onClick={() =>
                              handleCopyText(
                                generatedComment.response,
                                "comment"
                              )
                            }
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                            {copiedText === "comment" ? (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                Copy comment
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {generatedComment.response}
                        </p>
                      </div>
                    );
                  }
                })()}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    How to use:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Find a trending post in a relevant subreddit</li>
                    <li>• Copy the generated comment</li>
                    <li>• Paste and post it on Reddit</li>
                    <li>• Wait for upvotes to build karma</li>
                  </ul>
                </div>
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No comment generated yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Generate your first AI-optimized comment to start building
                  karma
                </p>
                <button
                  onClick={handleGenerateComment}
                  disabled={generateCommentMutation.isPending}
                  className="bg-[#3D348B] text-white px-6 py-3 rounded-lg hover:bg-[#2A1F6B] transition-colors disabled:opacity-50 flex items-center mx-auto"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Generate Comment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  AI-Generated Posts
                </h2>
              </div>
              <button
                onClick={handleRefreshPosts}
                disabled={
                  generatePostMutation.isPending || isBackgroundGenerating
                }
                className="bg-[#3D348B] text-white px-4 py-2 rounded-md hover:bg-[#2A1F6B] transition-colors disabled:opacity-50 text-sm font-medium flex items-center"
              >
                {generatePostMutation.isPending || isBackgroundGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
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
                    Generate New Post
                  </>
                )}
              </button>
            </div>

            {generatedPost ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">
                      Generated Post
                    </h3>
                    <button
                      onClick={() =>
                        handleCopyText(
                          `${generatedPost.title}\n\n${
                            generatedPost.description || ""
                          }`,
                          "post"
                        )
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      {copiedText === "post" ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
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
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Title:</h4>
                      <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                        {generatedPost.title}
                      </p>
                    </div>

                    {generatedPost.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Description:
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                          {generatedPost.description}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Subreddit:
                      </h4>
                      <p className="text-gray-700">
                        r/{generatedPost.subreddit}
                      </p>
                    </div>

                    {generatedPost.image_url && (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">
                            Generated Image:
                          </h4>
                          <button
                            onClick={() =>
                              handleCopyImage(generatedPost.image_url, "image")
                            }
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                            {copiedText === "image" ? (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                Copy Image
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <img
                            src={generatedPost.image_url}
                            alt="Generated post image"
                            className="max-w-xs h-auto rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    How to use:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Go to r/{generatedPost.subreddit}</li>
                    <li>• Create a new post</li>
                    <li>• Use the generated title and description</li>
                    <li>• Add the generated image if available</li>
                    <li>• Post and wait for karma to build</li>
                  </ul>
                </div>
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
                  No post generated yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Generate your first AI-optimized post to start building karma
                </p>
                <button
                  onClick={handleGeneratePost}
                  disabled={generatePostMutation.isPending}
                  className="bg-[#3D348B] text-white px-6 py-3 rounded-lg hover:bg-[#2A1F6B] transition-colors disabled:opacity-50 flex items-center mx-auto"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Generate Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Karma;

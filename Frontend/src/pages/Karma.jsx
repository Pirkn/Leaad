import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGenerateKarmaComment, useGenerateKarmaPost } from "../hooks/useApi";
import karmaService from "../services/karmaService";
import {
  Sparkles,
  MessageCircle,
  FileText,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      // Store in localStorage using karmaService for consistency
      karmaService.updateStoredKarmaContent("comment", result);
    } catch (error) {
      console.error("Failed to generate comment:", error);
    }
  };

  const handleGeneratePost = async () => {
    try {
      const result = await generatePostMutation.mutateAsync();
      setGeneratedPost(result);
      // Store in localStorage using karmaService for consistency
      karmaService.updateStoredKarmaContent("post", result);
    } catch (error) {
      console.error("Failed to generate post:", error);
    }
  };

  const handleRefreshComments = async () => {
    try {
      setIsBackgroundGenerating(true);
      const result = await karmaService.generateComment();

      // Update state with the new result
      setGeneratedComment(result);

      // Note: localStorage is already updated by karmaService.generateComment()
      console.log("Comment refreshed via karmaService");
    } catch (error) {
      console.error("Failed to refresh karma comments:", error);
    } finally {
      setIsBackgroundGenerating(false);
    }
  };

  const handleRefreshPosts = async () => {
    try {
      setIsBackgroundGenerating(true);
      const result = await karmaService.generatePost();

      // Update state with the new result
      setGeneratedPost(result);

      // Note: localStorage is already updated by karmaService.generatePost()
      console.log("Post refreshed via karmaService");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center mb-2"
          >
            <Sparkles
              className="w-8 h-8 text-orange-600 mr-3"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              Karma Builder
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-gray-600"
          >
            Generate optimized comments and posts to help build your Reddit
            karma safely.
          </motion.p>
        </div>
        <AnimatePresence>
          {isBackgroundGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
          Post
        </button>
      </div>

      {/* Comments Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "comments" && (
          <motion.div
            key="comments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <MessageCircle
                    className="w-6 h-6 text-blue-600 mr-3"
                    strokeWidth={1.5}
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI-Generated Comments
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefreshComments}
                  disabled={
                    generateCommentMutation.isPending || isBackgroundGenerating
                  }
                  className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors disabled:opacity-50 text-sm font-medium flex items-center"
                >
                  {generateCommentMutation.isPending ||
                  isBackgroundGenerating ? (
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
                      <RefreshCw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Generate New Comments
                    </>
                  )}
                </motion.button>
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
                      return (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                          {comments.map((commentData, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + index * 0.1,
                                ease: "easeOut",
                              }}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col h-full min-h-[400px]"
                            >
                              <div className="space-y-3 flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    Target Post:
                                  </h4>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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
                                        <Check
                                          className="w-4 h-4 mr-1"
                                          strokeWidth={1.5}
                                        />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy
                                          className="w-4 h-4 mr-1"
                                          strokeWidth={1.5}
                                        />
                                        Copy comment
                                      </>
                                    )}
                                  </motion.button>
                                </div>

                                <div>
                                  <a
                                    href={commentData.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm break-all flex items-center"
                                  >
                                    {commentData.post_title}
                                    <ExternalLink
                                      className="w-4 h-4 ml-1"
                                      strokeWidth={1.5}
                                    />
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

                                <div className="flex-1 flex flex-col">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    Generated Comment:
                                  </h4>
                                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded border border-gray-200 flex-1 min-h-[120px]">
                                    {commentData.comment
                                      .replace(/\*\*(.*?)\*\*/g, "$1")
                                      .replace(/\*(.*?)\*/g, "$1")
                                      .replace(/`(.*?)`/g, "$1")
                                      .split("\n")
                                      .map((line, i) => (
                                        <div key={i} className="mb-1">
                                          {line.startsWith("- ") ? (
                                            <div className="flex items-start">
                                              <span className="mr-2 text-gray-500">
                                                •
                                              </span>
                                              <span>{line.substring(2)}</span>
                                            </div>
                                          ) : (
                                            <span>{line}</span>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    AI Reasoning:
                                  </h4>
                                  <p className="text-gray-600 text-sm italic">
                                    {commentData.reasoning}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      );
                    } else {
                      // Handle single comment (fallback)
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-gray-900">
                              Generated Comment
                            </h3>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
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
                                  <Check
                                    className="w-4 h-4 mr-1"
                                    strokeWidth={1.5}
                                  />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy
                                    className="w-4 h-4 mr-1"
                                    strokeWidth={1.5}
                                  />
                                  Copy comment
                                </>
                              )}
                            </motion.button>
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {generatedComment.response}
                          </p>
                        </motion.div>
                      );
                    }
                  })()}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-blue-900 mb-2">
                      How to use:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Find a trending post in a relevant subreddit</li>
                      <li>• Copy the generated comment</li>
                      <li>• Paste and post it on Reddit</li>
                      <li>• Wait for upvotes to build karma</li>
                    </ul>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageCircle
                      className="w-8 h-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No comment generated yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Generate your first AI-optimized comment to start building
                    karma
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateComment}
                    disabled={generateCommentMutation.isPending}
                    className="bg-[#FF4500] text-white px-6 py-3 rounded-lg hover:bg-[#CC3700] transition-colors disabled:opacity-50 flex items-center mx-auto"
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
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "posts" && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FileText
                    className="w-6 h-6 text-green-600 mr-3"
                    strokeWidth={1.5}
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI-Generated Post
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefreshPosts}
                  disabled={
                    generatePostMutation.isPending || isBackgroundGenerating
                  }
                  className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors disabled:opacity-50 text-sm font-medium flex items-center"
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
                      <RefreshCw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Generate New Post
                    </>
                  )}
                </motion.button>
              </div>

              {generatedPost ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* First Column - Title, Subreddit, and Image */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Title:
                        </h4>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
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
                              <Check
                                className="w-4 h-4 mr-1"
                                strokeWidth={1.5}
                              />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy
                                className="w-4 h-4 mr-1"
                                strokeWidth={1.5}
                              />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                      <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                        {generatedPost.title}
                      </p>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Subreddit:
                        </h4>
                        <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          r/{generatedPost.subreddit}
                        </span>
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

                      {generatedPost.image_url && (
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-900">
                              Generated Image:
                            </h4>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCopyImage(
                                  generatedPost.image_url,
                                  "image"
                                )
                              }
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                              {copiedText === "image" ? (
                                <>
                                  <Check
                                    className="w-4 h-4 mr-1"
                                    strokeWidth={1.5}
                                  />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy
                                    className="w-4 h-4 mr-1"
                                    strokeWidth={1.5}
                                  />
                                  Copy Image
                                </>
                              )}
                            </motion.button>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <img
                              src={generatedPost.image_url}
                              alt="Generated post image"
                              className="max-w-[420px] h-auto rounded"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Second Column - How to use */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4 h-fit"
                      >
                        <h4 className="font-medium text-orange-900 mb-2">
                          How to use:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Go to r/{generatedPost.subreddit}</li>
                          <li>• Create a new post</li>
                          <li>• Use the generated title and description</li>
                          <li>• Add the generated image if available</li>
                          <li>• Post and wait for karma to build</li>
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4"
                      >
                        <h4 className="font-medium text-orange-900 mb-2">
                          Best Posting Times:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>
                            • <strong>Weekdays:</strong> 9 AM - 11 AM EST
                          </li>
                          <li>
                            • <strong>Weekends:</strong> 10 AM - 2 PM EST
                          </li>
                          <li>
                            • <strong>Avoid:</strong> 2 AM - 6 AM EST
                          </li>
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4"
                      >
                        <h4 className="font-medium text-orange-900 mb-2">
                          Reddit Best Practices:
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Read subreddit rules before posting</li>
                          <li>• Engage with comments on your posts</li>
                          <li>• Don't post too frequently (max 3-4/day)</li>
                          <li>• Be authentic and genuine in interactions</li>
                          <li>• Avoid karma farming or spam behavior</li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText
                      className="w-8 h-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No post generated yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Generate your first AI-optimized post to start building
                    karma
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGeneratePost}
                    disabled={generatePostMutation.isPending}
                    className="bg-[#FF4500] text-white px-6 py-3 rounded-lg hover:bg-[#CC3700] transition-colors disabled:opacity-50 flex items-center mx-auto"
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
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Karma;

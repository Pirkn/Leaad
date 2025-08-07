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
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";

function Karma() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("comments");
  const [copiedText, setCopiedText] = useState("");
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);

  // Individual copy states for each button
  const [copiedCommentStates, setCopiedCommentStates] = useState({});
  const [copiedPostState, setCopiedPostState] = useState(false);
  const [copiedImageState, setCopiedImageState] = useState(false);

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

    // Set individual copy states
    if (type.startsWith("comment-")) {
      setCopiedCommentStates((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedCommentStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } else if (type === "post") {
      setCopiedPostState(true);
      setTimeout(() => setCopiedPostState(false), 2000);
    }
  };

  const handleCopyImage = async (imageUrl, type) => {
    // Optimistically update UI immediately
    setCopiedImageState(true);
    setTimeout(() => setCopiedImageState(false), 2000);

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
    } catch (error) {
      console.error("Failed to copy image:", error);
      // Fallback: try to copy the image using a different approach
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(async (blob) => {
            try {
              const clipboardItem = new ClipboardItem({
                [blob.type]: blob,
              });
              await navigator.clipboard.write([clipboardItem]);
            } catch (err) {
              console.error("Failed to copy image blob:", err);
              // Final fallback: copy URL
              navigator.clipboard.writeText(imageUrl);
            }
          });
        };
        img.src = imageUrl;
      } catch (fallbackError) {
        console.error("Fallback image copy failed:", fallbackError);
        // Final fallback: copy URL
        navigator.clipboard.writeText(imageUrl);
      }
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
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Karma Builder</h1>
        <p className="text-gray-600 mt-2">
          Generate optimized comments and posts to help build your Reddit karma
          safely.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Filter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setActiveTab("comments")}
                  variant="ghost"
                  className={
                    activeTab === "comments"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  Comments
                </Button>

                <Button
                  onClick={() => setActiveTab("posts")}
                  variant="ghost"
                  className={
                    activeTab === "posts"
                      ? "bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
                      : "hover:bg-gray-100"
                  }
                >
                  Posts
                </Button>
              </div>

              {/* Right side - Generate buttons */}
              <div className="flex items-center space-x-3">
                {activeTab === "comments" && (
                  <Button
                    onClick={handleRefreshComments}
                    disabled={
                      generateCommentMutation.isPending ||
                      isBackgroundGenerating
                    }
                    className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      {generateCommentMutation.isPending ||
                      isBackgroundGenerating
                        ? "Generating..."
                        : "Generate Comments"}
                    </span>
                  </Button>
                )}

                {activeTab === "posts" && (
                  <Button
                    onClick={handleRefreshPosts}
                    disabled={
                      generatePostMutation.isPending || isBackgroundGenerating
                    }
                    className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      {generatePostMutation.isPending || isBackgroundGenerating
                        ? "Generating..."
                        : "Generate Post"}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Background Generation Notification */}
          <AnimatePresence>
            {isBackgroundGenerating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
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
                          <div className="grid grid-cols-1 gap-4">
                            {comments.map((commentData, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.3 + index * 0.05,
                                  ease: "easeOut",
                                }}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                              >
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Target Post
                                      </h3>
                                      <a
                                        href={commentData.post_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm break-all flex items-center"
                                      >
                                        {commentData.post_title}
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                      </a>
                                    </div>
                                    <Button
                                      onClick={() =>
                                        handleCopyText(
                                          commentData.comment,
                                          `comment-${index}`
                                        )
                                      }
                                      variant="outline"
                                      className="px-3 py-2"
                                    >
                                      {copiedCommentStates[
                                        `comment-${index}`
                                      ] ? (
                                        <>
                                          <Check className="w-4 h-4 mr-2" />
                                          <span>Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-4 h-4 mr-2" />
                                          <span>Copy Comment</span>
                                        </>
                                      )}
                                    </Button>
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle className="w-4 h-4" />
                                      <span>r/{commentData.subreddit}</span>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Generated Comment:
                                    </h4>
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200">
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
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      AI Reasoning:
                                    </h4>
                                    <p className="text-gray-600 text-sm italic">
                                      {commentData.reasoning}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        );
                      } else {
                        // Handle single comment (fallback)
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Generated Comment
                              </h3>
                              <Button
                                onClick={() =>
                                  handleCopyText(
                                    generatedComment.response,
                                    "comment"
                                  )
                                }
                                variant="outline"
                                className="px-3 py-2"
                              >
                                {copiedCommentStates["comment"] ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    <span>Copy Comment</span>
                                  </>
                                )}
                              </Button>
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No comments generated yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Generate your first AI-optimized comment to start building
                      karma
                    </p>
                    <Button
                      onClick={handleGenerateComment}
                      disabled={generateCommentMutation.isPending}
                      className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      <span>Generate Comment</span>
                    </Button>
                  </motion.div>
                )}
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
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Generated Post
                            </h3>
                            <Button
                              onClick={() =>
                                handleCopyText(
                                  `${generatedPost.title}\n\n${
                                    generatedPost.description || ""
                                  }`,
                                  "post"
                                )
                              }
                              variant="outline"
                              className="px-3 py-2"
                            >
                              {copiedPostState ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  <span>Copy</span>
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Title:
                              </h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                                {generatedPost.title}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Subreddit:
                              </h4>
                              <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                r/{generatedPost.subreddit}
                              </span>
                            </div>

                            {generatedPost.description && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Description:
                                </h4>
                                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
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
                                  <Button
                                    onClick={() =>
                                      handleCopyImage(
                                        generatedPost.image_url,
                                        "image"
                                      )
                                    }
                                    variant="outline"
                                    className="px-3 py-2"
                                  >
                                    {copiedImageState ? (
                                      <>
                                        <Check className="w-4 h-4 mr-2" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        <span>Copy Image</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                  <img
                                    src={generatedPost.image_url}
                                    alt="Generated post image"
                                    className="max-w-full h-auto rounded"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Second Column - How to use */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="space-y-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
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
                          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
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
                          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No post generated yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Generate your first AI-optimized post to start building
                      karma
                    </p>
                    <Button
                      onClick={handleGeneratePost}
                      disabled={generatePostMutation.isPending}
                      className="bg-[#FF4500] hover:bg-[#CC3700] text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      <span>Generate Post</span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Karma;

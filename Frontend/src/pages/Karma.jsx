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
  CircleCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { useKarmaContext } from "../contexts/KarmaContext";
import { Toaster, toast } from "sonner";

function Karma() {
  const { user } = useAuth();
  const {
    isKarmaGenerating,
    karmaGeneratingMode,
    startKarmaGeneration,
    stopKarmaGeneration,
  } = useKarmaContext();
  const [activeTab, setActiveTab] = useState("comments");
  const [copiedText, setCopiedText] = useState("");
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);

  // Individual copy states for each button
  const [copiedCommentStates, setCopiedCommentStates] = useState({});
  const [copiedPostState, setCopiedPostState] = useState(false);
  const [copiedTitleState, setCopiedTitleState] = useState(false);
  const [copiedImageState, setCopiedImageState] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // API hooks for generating karma content
  const generateCommentMutation = useGenerateKarmaComment();
  const generatePostMutation = useGenerateKarmaPost();

  // State for storing generated content
  const [generatedComment, setGeneratedComment] = useState(null);
  const [generatedPost, setGeneratedPost] = useState(null);

  // Load stored data on component mount
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
    // Prevent spam clicking
    if (isCopying) return;

    setIsCopying(true);

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

    // Show toast notification
    toast("Copied to clipboard", {
      duration: 2000,
      icon: <CircleCheck className="w-4 h-4 text-green-600" />,
    });

    // Set individual copy states
    if (type.startsWith("comment-")) {
      setCopiedCommentStates((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedCommentStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } else if (type === "post") {
      setCopiedPostState(true);
      setTimeout(() => setCopiedPostState(false), 2000);
    } else if (type === "title") {
      setCopiedTitleState(true);
      setTimeout(() => setCopiedTitleState(false), 2000);
    }

    // Reset copying state after 2 seconds
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleCopyImage = async (imageUrl, type) => {
    // Prevent spam clicking
    if (isCopying) return;

    setIsCopying(true);

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

      // Show success toast
      toast("Copied to clipboard", {
        duration: 2000,
        icon: <CircleCheck className="w-4 h-4 text-green-600" />,
      });
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
              toast("Copied to clipboard", {
                duration: 2000,
                icon: <CircleCheck className="w-4 h-4 text-green-600" />,
              });
            } catch (err) {
              console.error("Failed to copy image blob:", err);
              // Final fallback: copy URL
              navigator.clipboard.writeText(imageUrl);
              toast("Copied to clipboard", {
                duration: 2000,
                icon: <CircleCheck className="w-4 h-4 text-green-600" />,
              });
            }
          });
        };
        img.src = imageUrl;
      } catch (fallbackError) {
        console.error("Fallback image copy failed:", fallbackError);
        // Final fallback: copy URL
        navigator.clipboard.writeText(imageUrl);
        toast("Copied to clipboard", {
          duration: 2000,
          icon: <CircleCheck className="w-4 h-4 text-green-600" />,
        });
      }
    }

    // Reset copying state after 2 seconds
    setTimeout(() => setIsCopying(false), 2000);
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
      startKarmaGeneration("comments");
      const result = await karmaService.generateComment();

      // Update state with the new result
      setGeneratedComment(result);

      // Note: localStorage is already updated by karmaService.generateComment()
      console.log("Comment refreshed via karmaService");
    } catch (error) {
      console.error("Failed to refresh karma comments:", error);
    } finally {
      setIsBackgroundGenerating(false);
      stopKarmaGeneration();
    }
  };

  const handleRefreshPosts = async () => {
    try {
      setIsBackgroundGenerating(true);
      startKarmaGeneration("posts");
      const result = await karmaService.generatePost();

      // Update state with the new result
      setGeneratedPost(result);

      // Note: localStorage is already updated by karmaService.generatePost()
      console.log("Post refreshed via karmaService");
    } catch (error) {
      console.error("Failed to refresh karma posts:", error);
    } finally {
      setIsBackgroundGenerating(false);
      stopKarmaGeneration();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const shouldAnimate = !(isBackgroundGenerating || isKarmaGenerating);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldAnimate ? { duration: 0.3, ease: "easeOut" } : { duration: 0 }
      }
      className="p-6"
    >
      {/* Sticky Header */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={
          shouldAnimate ? { duration: 0.3, delay: 0.05 } : { duration: 0 }
        }
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
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldAnimate ? { duration: 0.3, delay: 0.1 } : { duration: 0 }
          }
          className="space-y-6"
        >
          {/* Filter Card */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldAnimate ? { duration: 0.3, delay: 0.2 } : { duration: 0 }
            }
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setActiveTab("comments");
                  }}
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
                  onClick={() => {
                    setActiveTab("posts");
                  }}
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

          {/* Comments Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "comments" && (
              <motion.div
                key="comments"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
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
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                          Target Post
                                        </h3>
                                      </div>
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
                                    <div className="flex items-center space-x-2 ml-4">
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
                                      <Button
                                        onClick={() =>
                                          window.open(
                                            `https://www.reddit.com/r/${commentData.subreddit}/submit`,
                                            "_blank"
                                          )
                                        }
                                        variant="outline"
                                        className="px-3 py-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-2"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                                        </svg>
                                        Post to r/{commentData.subreddit}
                                      </Button>
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
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
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
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Generated Post
                            </h3>
                            <Button
                              onClick={() =>
                                window.open(
                                  `https://www.reddit.com/r/${generatedPost.subreddit}/submit`,
                                  "_blank"
                                )
                              }
                              variant="outline"
                              className="px-3 py-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                              </svg>
                              Post to r/{generatedPost.subreddit}
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                Title:
                              </h4>
                              <div className="relative">
                                <p className="text-gray-700 bg-gray-50 p-3 pr-10 rounded border border-gray-200">
                                  {generatedPost.title}
                                </p>
                                <button
                                  onClick={() =>
                                    handleCopyText(generatedPost.title, "title")
                                  }
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {copiedTitleState ? (
                                    <Check className="w-5 h-5" />
                                  ) : (
                                    <Copy className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
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
                                <h4 className="font-medium text-gray-900 mb-1">
                                  Generated Image:
                                </h4>
                                <div className="relative">
                                  <div className="bg-gray-50 p-3 pr-12 rounded border border-gray-200">
                                    <img
                                      src={generatedPost.image_url}
                                      alt="Generated post image"
                                      className="max-w-full h-auto rounded block"
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleCopyImage(
                                        generatedPost.image_url,
                                        "image"
                                      )
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    {copiedImageState ? (
                                      <Check className="w-5 h-5" />
                                    ) : (
                                      <Copy className="w-5 h-5" />
                                    )}
                                  </button>
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

      {/* Background Generation Overlay */}
      <AnimatePresence>
        {(isBackgroundGenerating || isKarmaGenerating) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
            style={{ clipPath: "inset(0 0 0 16rem)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-sm text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              {(karmaGeneratingMode || activeTab) === "comments" ? (
                <>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Generating your comments...
                  </h3>
                  <p className="text-sm text-gray-500">
                    This may take ~15–30 seconds.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Generating your post...
                  </h3>
                  <p className="text-sm text-gray-500">
                    This may take ~15–30 seconds.
                  </p>
                </>
              )}
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
  );
}

export default Karma;

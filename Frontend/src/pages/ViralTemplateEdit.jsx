import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import staticDataService from "../services/staticData";
import Snackbar from "@mui/material/Snackbar";
import { motion, AnimatePresence } from "framer-motion";

function ViralTemplateEdit() {
  const { templateId } = useParams();

  // Get template data immediately - no useEffect needed for static data
  const templateData = staticDataService.getViralPostById(templateId);

  const [template] = useState(templateData);
  const [editedTitle, setEditedTitle] = useState(
    templateData?.postTitle || templateData?.title || ""
  );
  const [editedPostText, setEditedPostText] = useState(
    templateData?.postText || templateData?.originalPostText || ""
  );
  const [originalTitle, setOriginalTitle] = useState(
    templateData?.postTitle || templateData?.title || ""
  );
  const [originalPostText, setOriginalPostText] = useState(
    templateData?.postText || templateData?.originalPostText || ""
  );

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCopyToClipboard = async () => {
    const content = `${editedTitle}\n\n${editedPostText}`;
    try {
      await navigator.clipboard.writeText(content);
      setSnackbarMessage("Template copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setSnackbarMessage("Failed to copy to clipboard. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleResetChanges = () => {
    setEditedTitle(originalTitle);
    setEditedPostText(originalPostText);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!template) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Template not found
          </h3>
          <p className="text-gray-500">
            The requested template could not be found.
          </p>
          <Link
            to="/viral-templates"
            className="mt-4 inline-block bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-2xl font-semibold text-gray-900"
              >
                {template.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-sm text-gray-600 mt-1"
              >
                Edit your viral post template
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Link
              to="/viral-templates"
              className="text-[#FF4500] hover:text-[#CC3700] text-sm font-medium flex items-center"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Templates
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Editable Template Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">
                Editable Template
              </h2>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
              Template
            </span>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Title
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editedTitle);
                  setSnackbarMessage("Title copied to clipboard!");
                  setSnackbarOpen(true);
                }}
                className="text-gray-400 hover:text-[#FF4500] transition-colors"
                title="Copy title to clipboard"
              >
                <svg
                  className="w-4 h-4"
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
              </button>
            </div>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
              placeholder="Enter your post title..."
            />
          </div>

          {/* Post Text Textarea */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Content
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editedPostText);
                  setSnackbarMessage("Content copied to clipboard!");
                  setSnackbarOpen(true);
                }}
                className="text-gray-400 hover:text-[#FF4500] transition-colors"
                title="Copy content to clipboard"
              >
                <svg
                  className="w-4 h-4"
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
              </button>
            </div>
            <textarea
              value={editedPostText}
              onChange={(e) => setEditedPostText(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500] resize-none"
              placeholder="Enter your post content..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCopyToClipboard}
              className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#CC3700] transition-colors text-sm font-medium flex items-center"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy to Clipboard
            </button>
            <button
              onClick={handleResetChanges}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Changes
            </button>
          </div>
        </motion.div>

        {/* Original Post Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
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
              <h2 className="text-lg font-semibold text-gray-900">
                Original Post
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                Original
              </span>
              {template.originalPostUrl && (
                <a
                  href={template.originalPostUrl}
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

          {/* Original Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Title
            </label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {template.originalPostTitle || template.title}
            </div>
          </div>

          {/* Original Post Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Content
            </label>
            <textarea
              value={template.originalPostText || template.postText}
              readOnly
              rows={12}
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 resize-none"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Recommended Subreddits */}
      {template.recommendedSubreddits &&
        template.recommendedSubreddits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-6 bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Subreddits
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {template.recommendedSubreddits.map((subreddit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-900 border border-orange-300"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {subreddit}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </motion.div>
  );
}

export default ViralTemplateEdit;

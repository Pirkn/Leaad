import React from "react";
import { useLocation } from "react-router-dom";

const PageLoader = ({ children, isLoading = false }) => {
  const location = useLocation();

  const getLoadingMessage = (pathname) => {
    const messages = {
      "/dashboard": "Loading dashboard...",
      "/leads": "Loading leads...",
      "/viral-templates": "Loading viral templates...",
      "/products": "Loading products...",
      "/product-analysis": "Loading product analysis...",
      "/reddit-posts": "Loading Reddit posts...",
      "/posts": "Loading posts...",
      "/karma": "Loading karma...",
      "/settings": "Loading settings...",
    };

    // Handle dynamic routes like /viral-templates/:templateId
    if (
      pathname.startsWith("/viral-templates/") &&
      pathname !== "/viral-templates"
    ) {
      return "Loading template editor...";
    }

    return messages[pathname] || "Loading page...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
          <p className="text-gray-600 text-sm font-medium">
            {getLoadingMessage(location.pathname)}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default PageLoader;

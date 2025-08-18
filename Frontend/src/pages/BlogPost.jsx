import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import { getBlogPostById, getBlogPosts } from "../services/blogService";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const foundPost = getBlogPostById(id);
      if (foundPost) {
        setPost(foundPost);
        console.log("Found post:", foundPost);
        console.log("Post category:", foundPost.category);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || "Check out this article";

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${post.title} - Leaad Blog`}
        description={post.excerpt}
        keywords={`${post.category.toLowerCase()}, reddit marketing, lead generation, SaaS marketing, ${post.title.toLowerCase()}`}
        url={`https://leaad.co/blog/${post.id}`}
      />
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </button>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
                {post.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tighter leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                  onError={(e) =>
                    console.error("Image failed to load:", post.image)
                  }
                  onLoad={() =>
                    console.log("Image loaded successfully:", post.image)
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Article
                </button>
                <button
                  onClick={() => {
                    const shareSection =
                      document.getElementById("share-section");
                    const offset = 300; // Add 100px offset from the top
                    const elementPosition = shareSection.offsetTop - offset;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Render plain text content */}
              <div className="blog-content whitespace-pre-line">
                {post.content}
              </div>
            </motion.div>

            {/* Share Section */}
            <motion.div
              id="share-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share this article
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShare("twitter")}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tighter">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(() => {
                  const allPosts = getBlogPosts();
                  const otherPosts = allPosts
                    .filter((p) => p.id !== post.id)
                    .slice(0, 2);

                  console.log("All posts:", allPosts.length);
                  console.log("Other posts to show:", otherPosts.length);

                  return otherPosts.map((otherPost) => (
                    <article
                      key={otherPost.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/blog/${otherPost.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={otherPost.image}
                          alt={otherPost.title}
                          className="w-full h-32 object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-1 bg-white text-gray-700 text-xs font-medium rounded">
                          {otherPost.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight line-clamp-2">
                          {otherPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {otherPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{otherPost.readTime}</span>
                          <span>
                            {new Date(otherPost.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tighter">
                Get More Reddit Marketing Insights
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of SaaS founders and marketers who get our weekly
                insights on Reddit marketing and lead generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;

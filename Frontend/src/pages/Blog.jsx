import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import {
  getBlogPosts,
  getFeaturedPost,
  getPostsByCategory,
  searchPosts,
} from "../services/blogService";

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Use service functions to get blog content
  const blogPosts = getBlogPosts() || [];

  const categories = [
    "All",
    "Lead Generation",
    "Marketing Strategy",
    "Research",
    "Community",
    "AI & Technology",
    "Case Study",
  ];

  // Filter posts based on search term and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort posts based on selected sort option
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  const featuredPost = getFeaturedPost();
  const regularPosts = sortedPosts.filter((post) => !post.featured);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || sortBy !== "newest";

  return (
    <>
      <SEOHead
        title="Blog - Reddit Marketing & Lead Generation Insights"
        description="Expert insights on Reddit marketing, lead generation strategies, and AI-powered growth tactics for SaaS founders and startups."
        keywords="reddit marketing blog, lead generation tips, SaaS marketing, reddit strategy, AI marketing, startup growth"
        url="https://leaad.co/blog"
      />
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">
                Reddit Marketing & Lead Generation Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Expert insights, strategies, and case studies to help you master
                Reddit marketing and generate qualified leads for your business.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>

              {/* Sort and Clear Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="category">Category A-Z</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white border-gray-900"
                      : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredPosts.length} of {blogPosts.length} articles
              {hasActiveFilters && " (filtered)"}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && blogPosts.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full mb-4">
                      Featured Article
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tighter">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(featuredPost.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                  <div
                    className="relative cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                  >
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tighter">
                Latest Articles
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-4 left-4 px-2 py-1 bg-white text-gray-700 text-xs font-medium rounded">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigate(`/blog/${post.id}`)}
                          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {hasActiveFilters
                      ? "No articles match your filters"
                      : "No articles found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {hasActiveFilters
                      ? "Try adjusting your search terms or category selection"
                      : "We couldn't find any articles matching your criteria"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tighter">
                Get the Latest Reddit Marketing Insights
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

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Blog;

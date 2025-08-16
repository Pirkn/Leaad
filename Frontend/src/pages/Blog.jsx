import { useState } from "react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Sample blog posts - you can replace with real data
  const blogPosts = [
    {
      id: 1,
      title: "How to Generate 100+ Qualified Leads from Reddit in 30 Days",
      excerpt:
        "Discover the proven strategies that helped SaaS founders generate hundreds of qualified leads using Reddit marketing techniques and AI-powered tools.",
      author: "Leaad Team",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Lead Generation",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      featured: true,
    },
    {
      id: 2,
      title: "The Complete Guide to Reddit Marketing for SaaS Startups",
      excerpt:
        "Learn how to navigate Reddit's unique culture, build authentic relationships, and convert discussions into paying customers for your SaaS business.",
      author: "Leaad Team",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "Marketing Strategy",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      title: "5 Reddit Subreddits Every SaaS Founder Should Monitor",
      excerpt:
        "Find the most active and relevant subreddits where your target audience hangs out and discusses problems your product can solve.",
      author: "Leaad Team",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Research",
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Building Authentic Engagement on Reddit: Dos and Don'ts",
      excerpt:
        "Master the art of genuine Reddit engagement without coming across as spammy or promotional. Learn the unwritten rules of Reddit culture.",
      author: "Leaad Team",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "Community",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    },
    {
      id: 5,
      title: "AI-Powered Lead Generation: The Future of Marketing",
      excerpt:
        "Explore how artificial intelligence is revolutionizing lead generation and why traditional methods are becoming obsolete for modern businesses.",
      author: "Leaad Team",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "AI & Technology",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    },
    {
      id: 6,
      title:
        "Case Study: How We Helped a SaaS Company Generate 500 Leads in 60 Days",
      excerpt:
        "Real results from a real client. See how strategic Reddit marketing combined with AI tools transformed their lead generation process.",
      author: "Leaad Team",
      date: "2024-01-03",
      readTime: "15 min read",
      category: "Case Study",
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    },
  ];

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

  const featuredPost = sortedPosts.find((post) => post.featured);
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
        {featuredPost && (
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
                    <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
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
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
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
                      <button className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors">
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

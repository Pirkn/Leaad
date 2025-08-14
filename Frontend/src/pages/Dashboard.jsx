import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  useHealthCheck,
  useLeads,
  useRedditPosts,
  useProducts,
} from "../hooks/useApi";
import { usePostsContext } from "../contexts/PostsContext";
import { useLeadsContext } from "../contexts/LeadsContext";
import staticDataService from "../services/staticData";
import {
  TrendingUp,
  Users,
  FileText,
  Package,
  MessageCircle,
  Eye,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Activity,
  Sparkles,
  Flame,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, onboardingComplete, onboardingStatusLoading, loading } =
    useAuth();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (user && !loading && !onboardingStatusLoading && !onboardingComplete) {
      navigate("/onboarding");
    }
  }, [user, loading, onboardingComplete, onboardingStatusLoading, navigate]);

  // Show loading while checking authentication or onboarding status
  if (loading || onboardingStatusLoading || !user) {
    return null;
  }

  // API hooks for real data
  const { data: healthData, isLoading: healthLoading } = useHealthCheck();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: posts, isLoading: postsLoading } = useRedditPosts();
  const { data: productsResponse, isLoading: productsLoading } = useProducts();
  const { newlyGeneratedPosts } = usePostsContext();
  const { newlyGeneratedLeads } = useLeadsContext();

  // Get viral templates count
  const viralTemplates = staticDataService.getViralPosts();
  const viralTemplatesCount = viralTemplates.length;

  // Calculate real metrics
  const allLeads = [...(leads || []), ...newlyGeneratedLeads];
  const totalLeads = allLeads.length;
  const unreadLeads = allLeads.filter((lead) => !lead.read)?.length || 0;
  const allPosts = [...(posts || []), ...newlyGeneratedPosts];
  const totalPosts = allPosts.length;
  const unreadPosts = allPosts.filter((post) => !post.read)?.length || 0;
  const hasProduct = productsResponse?.products?.length > 0;
  const product = productsResponse?.products?.[0];

  // Debug logging
  console.log("Dashboard Data:", {
    leads: leads?.length || 0,
    newlyGeneratedLeads: newlyGeneratedLeads?.length || 0,
    allLeads: allLeads?.length || 0,
    posts: posts?.length || 0,
    newlyGeneratedPosts: newlyGeneratedPosts?.length || 0,
    allPosts: allPosts?.length || 0,
    recentLeads: allLeads.slice(0, 3),
    recentPosts: allPosts.slice(0, 3),
  });

  // Debug individual lead structure
  if (allLeads.length > 0) {
    console.log("Sample lead structure:", allLeads[0]);
    console.log("Lead date fields:", {
      date: allLeads[0].date, // Actual Reddit post date
      created_at: allLeads[0].created_at, // When lead was generated
      hasDate: !!allLeads[0].date,
      hasCreatedAt: !!allLeads[0].created_at,
    });

    // Debug sorting
    const sampleLeads = allLeads.slice(0, 3);
    console.log(
      "Sample leads before sorting:",
      sampleLeads.map((l) => ({
        id: l.id,
        date: l.date, // Reddit post date
        created_at: l.created_at, // Lead generation date
        finalDate: l.created_at, // Using created_at for sorting
      }))
    );

    const sortedSample = sampleLeads.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    console.log(
      "Sample leads after sorting:",
      sortedSample.map((l) => ({
        id: l.id,
        date: l.date, // Reddit post date
        created_at: l.created_at, // Lead generation date
        finalDate: l.created_at, // Using created_at for sorting
      }))
    );
  }

  // Calculate engagement metrics
  const totalUpvotes = viralTemplates.reduce(
    (sum, template) => sum + (template.upvotes || 0),
    0
  );
  const totalComments = viralTemplates.reduce(
    (sum, template) => sum + (template.comments || 0),
    0
  );
  const avgEngagement =
    viralTemplates.length > 0
      ? Math.round((totalUpvotes + totalComments) / viralTemplates.length)
      : 0;

  // Get recent activity (last 3 leads and posts, sorted by created_at for leads)
  const recentLeads =
    allLeads
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      })
      .slice(0, 3) || [];
  const recentPosts =
    allPosts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3) || [];

  const handleAnalyzeProduct = () => {
    navigate("/products");
  };

  const handleViewLeads = (leadId = null) => {
    if (leadId) {
      navigate(`/leads?highlight=${leadId}`);
    } else {
      navigate("/leads");
    }
  };

  const handleViewPosts = (postId = null) => {
    if (postId) {
      navigate(`/posts?highlight=${postId}`);
    } else {
      navigate("/posts");
    }
  };

  const handleViewTemplates = () => {
    navigate("/viral-templates");
  };

  const handleViewKarma = () => {
    navigate("/karma");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays < 1;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="sticky top-0 z-10 bg-white py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-200 mb-6 -mt-4 sm:-mt-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {!productsLoading && !hasProduct && (
              <Button
                onClick={handleAnalyzeProduct}
                className="bg-[#FF4500] hover:bg-[#CC3700] text-white text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Package className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={handleViewLeads}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Leads
                    </p>
                    {leadsLoading ? (
                      <Skeleton className="h-6 w-8" />
                    ) : (
                      <p className="text-xl font-semibold text-gray-900">
                        {totalLeads}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                {unreadLeads > 0 ? (
                  <span className="text-xs text-gray-500">
                    {unreadLeads} new leads
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    {totalLeads === 0 ? "No leads yet" : "All caught up"}
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={handleViewPosts}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Generated Posts
                    </p>
                    {postsLoading ? (
                      <Skeleton className="h-6 w-8" />
                    ) : (
                      <p className="text-xl font-semibold text-gray-900">
                        {totalPosts}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                {unreadPosts > 0 ? (
                  <span className="text-xs text-gray-500">
                    {unreadPosts} new posts
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    {totalPosts === 0 ? "No posts yet" : "All caught up"}
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={handleViewTemplates}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 border border-orange-200 rounded-md bg-orange-50">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Viral Templates
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {viralTemplatesCount}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Avg engagement: {avgEngagement}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={handleViewLeads}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 border border-blue-200 rounded-md bg-blue-50">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      This Week
                    </p>
                    {leadsLoading || postsLoading ? (
                      <Skeleton className="h-6 w-8" />
                    ) : (
                      <p className="text-xl font-semibold text-gray-900">
                        {(() => {
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                          const recentLeads =
                            leads?.filter(
                              (lead) => new Date(lead.created_at) >= oneWeekAgo
                            )?.length || 0;

                          const recentPosts =
                            posts?.filter(
                              (post) => new Date(post.created_at) >= oneWeekAgo
                            )?.length || 0;

                          return recentLeads + recentPosts;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">New leads & posts</span>
              </div>
            </motion.div>
          </div>

          {/* Product Status */}
          {productsLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </motion.div>
          ) : !hasProduct ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-orange-900 mb-1">
                    No product configured
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    Add your product to start generating leads and Reddit posts.
                  </p>
                  <Button
                    onClick={handleAnalyzeProduct}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Add Your Product
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : product ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Monitoring: {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Active since{" "}
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAnalyzeProduct}
                  variant="outline"
                  className="text-sm w-full sm:w-auto"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ) : null}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.35 }}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={handleViewLeads}
                variant="outline"
                size="sm"
                className="justify-start"
                disabled={!hasProduct}
              >
                <Users className="w-4 h-4 mr-2" />
                View Leads
              </Button>
              <Button
                onClick={handleViewPosts}
                variant="outline"
                size="sm"
                className="justify-start"
                disabled={!hasProduct}
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Posts
              </Button>
              <Button
                onClick={handleViewTemplates}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <Flame className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
              <Button
                onClick={handleViewKarma}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Build Karma
              </Button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Leads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Leads
                </h2>
                <Button
                  onClick={handleViewLeads}
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {leadsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 border border-gray-100 rounded-md bg-gray-50"
                      >
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentLeads.length > 0 ? (
                  <div className="relative">
                    {recentLeads.map((lead, index) => (
                      <div
                        key={lead.id}
                        className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          index === 2 ? "opacity-75 hover:opacity-90" : ""
                        } ${index < 2 ? "border-b border-gray-100" : ""}`}
                        onClick={() => handleViewLeads(lead.id)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            lead.read ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lead.title || lead.selftext || "Lead"}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(lead.created_at)}</span>
                            {isNew(lead.created_at) && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentLeads.length === 3 && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No leads yet</p>
                    {hasProduct && (
                      <Button
                        onClick={handleViewLeads}
                        size="sm"
                        className="mt-2 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Generate Leads
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.45 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Posts
                </h2>
                <Button
                  onClick={handleViewPosts}
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {postsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 border border-gray-100 rounded-md bg-gray-50"
                      >
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentPosts.length > 0 ? (
                  <div className="relative">
                    {recentPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          index === 2 ? "opacity-75 hover:opacity-90" : ""
                        } ${index < 2 ? "border-b border-gray-100" : ""}`}
                        onClick={() => handleViewPosts(post.id)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            post.read ? "bg-gray-400" : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <MessageCircle className="w-3 h-3" />
                            <span>r/{post.subreddit}</span>
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentPosts.length === 3 && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No posts yet</p>
                    {hasProduct && (
                      <Button
                        onClick={handleViewPosts}
                        size="sm"
                        className="mt-2 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Create Posts
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  Pro Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Generate leads regularly to find new opportunities</li>
                  <li>• Use viral templates to create engaging Reddit posts</li>
                  <li>
                    • Build karma with our AI-generated comments and posts
                  </li>
                  <li>• Monitor your product mentions across Reddit</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;

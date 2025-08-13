import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAnalyzeProduct,
  useOnboardingLeadGeneration,
} from "../hooks/useApi";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Target,
  MessageSquare,
  TrendingUp,
  Users,
  Globe,
  Rocket,
  Star,
  Clock,
  User,
  ExternalLink,
  Calendar,
  MessageCircle,
  ArrowUp,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";

// Mock data for demo leads
const mockLeads = [
  {
    id: 1,
    title: "Looking for a simple waitlist solution for my SaaS",
    author: "startup_founder_2024",
    subreddit: "SaaS",
    date: "2024-01-15T10:30:00Z",
    score: 47,
    num_comments: 23,
    selftext:
      "I'm about to launch my new productivity app and need a quick way to collect emails for early access. Anyone know of tools that don't require coding?",
    url: "https://reddit.com/r/SaaS/comments/example1",
    comment:
      "I'd recommend checking out WaitlistNow - it's specifically designed for this. You can create a professional waitlist page in minutes without any coding. It has built-in analytics and email collection, plus it integrates with most email marketing tools. Perfect for validating your SaaS idea before the full launch.",
  },
  {
    id: 2,
    title: "Best tools for collecting pre-launch signups?",
    author: "indie_maker_pro",
    subreddit: "entrepreneur",
    date: "2024-01-14T15:45:00Z",
    score: 89,
    num_comments: 34,
    selftext:
      "Building a new app and want to start building an audience before launch. What are the best tools you've used for collecting email signups and managing waitlists?",
    url: "https://reddit.com/r/entrepreneur/comments/example2",
    comment:
      "WaitlistNow has been a game-changer for my pre-launch strategy. Super easy to set up, looks professional, and the analytics help you track interest. Plus you can customize it to match your brand perfectly. Much better than trying to build something from scratch.",
  },
  {
    id: 3,
    title: "How do you validate your SaaS idea before building?",
    author: "tech_entrepreneur",
    subreddit: "startups",
    date: "2024-01-13T09:20:00Z",
    score: 156,
    num_comments: 67,
    selftext:
      "I have an idea for a B2B SaaS but want to validate demand before spending months building it. What's the best approach to test market interest?",
    url: "https://reddit.com/r/startups/comments/example3",
    comment:
      "One of the fastest ways is to create a landing page with a waitlist. I use WaitlistNow for this - you can have a professional-looking page up in minutes and start collecting emails from interested users. The analytics show you exactly how much interest you're getting, which helps with validation.",
  },
];

const steps = [
  {
    id: 1,
    title: "Let's find your users",
    subtitle:
      "We'll analyze your website to understand your target audience and find relevant leads",
    icon: Target,
    action: "Analyze Product",
  },
  {
    id: 2,
    title: "Why Reddit is perfect for leads",
    subtitle:
      "While most businesses chase social media trends, Reddit offers something different: genuine intent and real problems.",
    icon: Target,
    action: "Continue",
  },
  {
    id: 3,
    title: "Scanning Reddit for your leads",
    subtitle:
      "Our AI is actively searching through thousands of Reddit discussions to find people actively seeking solutions like yours",
    icon: Sparkles,
    action: "Scanning...",
  },
  {
    id: 4,
    title: "Here are your first leads!",
    subtitle:
      "We found real people discussing problems your product solves. These are actual Reddit posts from the last 48 hours.",
    icon: TrendingUp,
    action: "See More Leads",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productUrl, setProductUrl] = useState("");
  const [hasUserEditedUrl, setHasUserEditedUrl] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState(null);
  const [copiedReplyId, setCopiedReplyId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualData, setManualData] = useState({
    description: "",
    target_audience: "",
    problem_solved: "",
  });
  const [generatedLeads, setGeneratedLeads] = useState([]);
  const [leadSubreddits, setLeadSubreddits] = useState([]);
  const [isGeneratingLeads, setIsGeneratingLeads] = useState(false);
  const [hasTriggeredLeadGeneration, setHasTriggeredLeadGeneration] =
    useState(false);

  const analyzeProductMutation = useAnalyzeProduct();
  const isAnalyzing = analyzeProductMutation.isPending;
  const onboardingLeadsMutation = useOnboardingLeadGeneration();

  const deriveNameFromUrl = (url) => {
    if (!url) return "Product";
    try {
      const { hostname } = new URL(url);
      const host = hostname.replace(/^www\./i, "");
      const firstPart = host.split(".")[0] || "product";
      return firstPart
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    } catch (e) {
      return "Product";
    }
  };

  const triggerOnboardingLeadGeneration = (productData) => {
    if (!productData || hasTriggeredLeadGeneration) return;
    setHasTriggeredLeadGeneration(true);
    setIsGeneratingLeads(true);
    onboardingLeadsMutation.mutate(productData, {
      onSuccess: (data) => {
        setGeneratedLeads(data?.generated_leads || []);
        setLeadSubreddits(data?.subreddits || []);
      },
      onSettled: () => setIsGeneratingLeads(false),
    });
  };

  // Auto-advance to step 4 when leads are ready
  useEffect(() => {
    if (currentStep === 3 && generatedLeads.length > 0 && !isGeneratingLeads) {
      // Small delay to show the completion state briefly
      const timer = setTimeout(() => {
        setCurrentStep(4);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, generatedLeads.length, isGeneratingLeads]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productUrl.trim()) return;

    // Show manual input fields immediately when analyze is clicked
    setShowManualInput(true);

    try {
      // Use the same endpoint as Products.jsx
      const analysisResult = await analyzeProductMutation.mutateAsync(
        productUrl.trim()
      );

      // Populate the manual input fields with the analyzed data
      setManualData({
        description: analysisResult.description || "",
        target_audience: analysisResult.target_audience || "",
        problem_solved: analysisResult.problem_solved || "",
      });

      setProductAnalysis(analysisResult);

      // Start generating onboarding leads in background
      triggerOnboardingLeadGeneration({
        name: analysisResult?.name || deriveNameFromUrl(productUrl),
        description: analysisResult?.description,
        target_audience: analysisResult?.target_audience,
        problem_solved: analysisResult?.problem_solved,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      // Keep the manual fields open so user can fill them manually if API fails
      alert("Analysis failed. Please fill in the details manually.");
    }
  };

  const handleCopyReply = async (replyText, leadId) => {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopiedReplyId(leadId);
      setTimeout(() => setCopiedReplyId(null), 2000);
    } catch (err) {
      console.error("Failed to copy reply:", err);
    }
  };

  const handleViewReply = (leadId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
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

  const handleNext = () => {
    if (currentStep === 5) {
      navigate("/signup");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipToSignup = () => {
    navigate("/signup");
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Back to Homepage Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          ← Back to Homepage
        </Button>
      </div>

      {/* Skip to Sign In Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => navigate("/signin")}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          Skip to Sign In
        </Button>
      </div>

      {/* Step Counter - Outside main container */}
      <div className="w-full py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          <Progress
            value={(currentStep / steps.length) * 100}
            className="h-2 transition-all duration-1000 ease-out"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center pt-6">
        <div className="max-w-4xl mx-auto px-6 py-8 relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tighter">
                {currentStepData.title}
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto text-center leading-relaxed tracking-tight">
                {currentStepData.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-900 mb-3">
                        Your website:
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <Input
                          type="url"
                          value={productUrl}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Check if user is deleting from https:// (which means they've edited it)
                            if (
                              productUrl.startsWith("https://") &&
                              value.length < productUrl.length
                            ) {
                              setHasUserEditedUrl(true);
                            }

                            // Auto-add https:// only if:
                            // 1. User hasn't edited the URL before
                            // 2. Value doesn't already start with http:// or https://
                            // 3. User is typing (not deleting)
                            if (
                              !hasUserEditedUrl &&
                              value &&
                              value.length > productUrl.length &&
                              !value.startsWith("http://") &&
                              !value.startsWith("https://")
                            ) {
                              value = "https://" + value;
                            }

                            setProductUrl(value);
                          }}
                          placeholder="https://your-product.com"
                          className="pl-12 pr-32"
                          required
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 text-sm hover:bg-gray-100"
                          disabled={!productUrl.trim() || isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 mr-1 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-1" />
                              {currentStepData.action}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {!showManualInput && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-center"
                        >
                          <button
                            type="button"
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
                          >
                            or enter details manually
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  <AnimatePresence>
                    {showManualInput && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                          marginTop: 0,
                          paddingTop: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginTop: 24,
                          paddingTop: 24,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          marginTop: 0,
                          paddingTop: 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="border-t border-gray-200 overflow-hidden"
                      >
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.08,
                                delayChildren: 0.2,
                              },
                            },
                          }}
                          className="space-y-4"
                        >
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" },
                              },
                            }}
                          >
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Product Description
                            </label>
                            <Textarea
                              value={manualData.description}
                              onChange={(e) =>
                                setManualData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder={
                                isAnalyzing
                                  ? "Analyzing your product..."
                                  : "Describe what your product does..."
                              }
                              rows={3}
                              disabled={isAnalyzing}
                            />
                          </motion.div>

                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" },
                              },
                            }}
                          >
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Target Audience
                            </label>
                            <Textarea
                              value={manualData.target_audience}
                              onChange={(e) =>
                                setManualData((prev) => ({
                                  ...prev,
                                  target_audience: e.target.value,
                                }))
                              }
                              placeholder={
                                isAnalyzing
                                  ? "Identifying target audience..."
                                  : "Who is your ideal customer?"
                              }
                              rows={2}
                              disabled={isAnalyzing}
                            />
                          </motion.div>

                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" },
                              },
                            }}
                          >
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                              Problem Solved
                            </label>
                            <Textarea
                              value={manualData.problem_solved}
                              onChange={(e) =>
                                setManualData((prev) => ({
                                  ...prev,
                                  problem_solved: e.target.value,
                                }))
                              }
                              placeholder={
                                isAnalyzing
                                  ? "Analyzing problem solved..."
                                  : "What problem does your product solve?"
                              }
                              rows={2}
                              disabled={isAnalyzing}
                            />
                          </motion.div>

                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" },
                              },
                            }}
                          >
                            <Button
                              onClick={() => {
                                // Process manual data and move to next step
                                setProductAnalysis({
                                  description: manualData.description,
                                  target_audience: manualData.target_audience,
                                  problem_solved: manualData.problem_solved,
                                });
                                // Kick off onboarding lead generation in background with manual inputs
                                triggerOnboardingLeadGeneration({
                                  name: deriveNameFromUrl(productUrl),
                                  description: manualData.description,
                                  target_audience: manualData.target_audience,
                                  problem_solved: manualData.problem_solved,
                                });
                                setCurrentStep(2); // Proceed to step 2 after entering details
                              }}
                              disabled={
                                !manualData.description.trim() ||
                                !manualData.target_audience.trim() ||
                                !manualData.problem_solved.trim()
                              }
                              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3"
                            >
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
              >
                <motion.div
                  className="space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                >
                  <motion.div
                    className="space-y-4"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                  >
                    <motion.div
                      className="flex items-start space-x-4"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                    >
                      <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tighter">
                          People actively seeking solutions
                        </h4>
                        <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                          Reddit users post specific problems they need solved,
                          making them perfect prospects for your product.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start space-x-4"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                    >
                      <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tighter">
                          Authentic pain points
                        </h4>
                        <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                          Real discussions reveal the exact language and
                          frustrations your target audience uses.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start space-x-4"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                    >
                      <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tighter">
                          Untapped opportunity
                        </h4>
                        <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                          Most businesses ignore Reddit, giving you access to
                          qualified leads without competition.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6"
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.6,
                        },
                      },
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tighter">
                          How Leaad makes this effortless
                        </h4>
                        <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                          Leaad scans Reddit 24/7 to surface buying signals,
                          pain points, and leads you can act on right now. We
                          discover people actively seeking solutions like yours,
                          then provide optimized comments and posts designed to
                          convert them into customers.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
                      <span className="text-base text-gray-700 font-medium">
                        Searching through thousands of Reddit discussions
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                      <span className="text-base text-gray-700 font-medium">
                        Identifying people actively seeking solutions
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                      <span className="text-base text-gray-700 font-medium">
                        Finding qualified leads in real-time
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Demo Leads */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tighter">
                      Your First Leads
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Live Results
                    </span>
                  </div>

                  <div className="relative space-y-3">
                    {(generatedLeads?.length
                      ? generatedLeads.slice(0, 2)
                      : mockLeads.slice(0, 2)
                    ).map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-white border border-gray-200 rounded-xl p-6 transition-shadow ${
                          index === 1
                            ? "opacity-50 pointer-events-none"
                            : "hover:shadow-sm"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight">
                              {lead.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span className="font-medium">
                                  {lead.author}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {formatDate(lead.date)}</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                            r/{lead.subreddit}
                          </span>
                        </div>

                        {/* Content */}
                        <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-3">
                          {lead.selftext}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ArrowUp className="w-4 h-4" />
                            <span className="font-medium">
                              {lead.score} upvotes
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">
                              {lead.num_comments} comments
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => window.open(lead.url, "_blank")}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                            disabled={index === 1}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>View on Reddit</span>
                          </Button>
                          <Button
                            onClick={() => handleViewReply(lead.id)}
                            variant="outline"
                            className="flex-1"
                            disabled={index === 1}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            <span>
                              {expandedReplies.has(lead.id)
                                ? "Hide Reply"
                                : "View AI Reply"}
                            </span>
                          </Button>
                        </div>

                        {/* Reply Section */}
                        <AnimatePresence>
                          {expandedReplies.has(lead.id) && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0,
                                paddingTop: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                marginTop: 16,
                                paddingTop: 16,
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0,
                                paddingTop: 0,
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="border-t border-gray-200 overflow-hidden"
                            >
                              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="flex items-start space-x-3 mb-4">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h5 className="text-sm font-semibold text-gray-900 tracking-tight">
                                        AI Generated Reply
                                      </h5>
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        Personalized
                                      </span>
                                    </div>
                                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap tracking-tight">
                                      {lead.comment}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-3">
                                  <Button
                                    onClick={() =>
                                      handleCopyReply(lead.comment, lead.id)
                                    }
                                    variant="outline"
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                                  >
                                    {copiedReplyId === lead.id ? (
                                      <Check className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Copy className="w-4 h-4 mr-2" />
                                    )}
                                    {copiedReplyId === lead.id
                                      ? "Copied!"
                                      : "Copy Reply"}
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}

                    {/* Fade to background effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none"></div>
                  </div>
                </div>

                <div className="text-center py-6">
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed tracking-tight">
                    Get access to <strong>unlimited leads</strong> and{" "}
                    <strong>AI-generated replies</strong> with your free trial.
                  </p>
                  <Button
                    onClick={() => navigate("/signin")}
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep > 1 && currentStep < 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: currentStep === 2 ? 1.0 : 0.6, // Wait for content animations to complete
              }}
              className="flex justify-between items-center mt-8"
            >
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="flex items-center px-8 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === 2 && (
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gray-900 hover:bg-gray-800 text-white flex items-center px-8 py-3"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;

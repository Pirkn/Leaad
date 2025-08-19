"use client";
import {
  Target,
  MessageSquare,
  TrendingUp,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  CircleCheck,
  Star,
  Globe,
  Link as LinkIcon,
  Sparkles,
  DollarSign,
  Rocket,
  Shield,
  Award,
  Menu,
  X,
  ChevronRight,
  CirclePercent,
  Clock,
  Dumbbell,
  WandSparkles,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Import all images and videos for immediate loading
import heroBackgroundImage from "/src/assets/herobg.webp";
import backgroundTextureImage from "/src/assets/background.webp";
import macbookImage from "/src/assets/macbook-air-medium.webp";
import postsVideo from "/src/assets/posts.webm";
import templatesVideo from "/src/assets/templates.webm";
import karmaVideo from "/src/assets/karma.webm";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(1px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(1px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(1px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading, onboardingComplete, onboardingStatusLoading } =
    useAuth();
  const [showDeferred, setShowDeferred] = useState(false);

  useEffect(() => {
    // Force scroll to top immediately when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Also try to prevent scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Defer below-the-fold sections until idle to reduce main-thread work
    const idleCb = (cb) =>
      window.requestIdleCallback
        ? window.requestIdleCallback(cb, { timeout: 1200 })
        : setTimeout(cb, 600);
    const cancelIdle = (id) =>
      window.cancelIdleCallback
        ? window.cancelIdleCallback(id)
        : clearTimeout(id);
    const id = idleCb(() => setShowDeferred(true));
    return () => cancelIdle(id);
  }, []);

  // RootRedirect controls redirection for '/'. Avoid duplicating that logic here.

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePrimaryCta = () => {
    if (!user || loading) return navigate("/signup");
    if (onboardingComplete) return navigate("/dashboard");
    return navigate("/onboarding");
  };

  const handleSecondaryCta = () => {
    if (!user || loading) return navigate("/signin");
    if (onboardingComplete) return navigate("/onboarding");
    return navigate("/dashboard");
  };

  return (
    <>
      <SEOHead
        title="AI-Powered Reddit Lead Generation for SaaS & Startups"
        description="Generate qualified leads from Reddit with AI. Find people actively seeking solutions like yours, get personalized comments, and convert Reddit discussions into customers. Perfect for SaaS founders and startups."
        keywords="reddit lead generation, SaaS marketing, startup marketing, AI lead generation, reddit marketing, B2B leads, product marketing, customer acquisition, reddit automation, lead finding"
        url="https://leaad.co"
        preloadImages={[heroBackgroundImage]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Leaad",
          description:
            "AI-powered Reddit lead generation platform for SaaS and startups",
          url: "https://leaad.co",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://leaad.co/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero Section with Floating Elements */}
        <section className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Texture for Hero Section */}
          <div className="absolute inset-0 w-full h-full">
            <picture>
              <source srcSet={heroBackgroundImage} type="image/webp" />
              <img
                src={heroBackgroundImage}
                alt=""
                className="w-full h-full object-cover"
                fetchPriority="high"
                decoding="async"
                width="1920"
                height="1080"
                sizes="100vw"
              />
            </picture>
          </div>

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium shadow-sm"
                  variants={itemVariants}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  AI-Powered Lead Generation
                </motion.div>
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tighter"
                  variants={itemVariants}
                >
                  Get Your Product <br /> in Front of the Right People <br />{" "}
                  Without Guessing
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4 tracking-tight"
                  variants={itemVariants}
                >
                  We help you show up where it matters. From product analysis to
                  comment generation, we handle the entire process so you can
                  focus on building.
                </motion.p>
                <motion.div
                  className="flex justify-center items-center mb-12"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 pl-5 pr-3 py-2 text-base font-medium rounded-lg flex items-center justify-center"
                      onClick={handlePrimaryCta}
                    >
                      {user && !loading
                        ? onboardingComplete
                          ? "Go to Dashboard"
                          : "Continue Onboarding"
                        : "Find your next users"}
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="hidden sm:flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500"
                  variants={itemVariants}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    AI-powered insights
                  </motion.div>
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Instant results
                  </motion.div>
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Free plan available
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Hero Laptop Mockup with Enhanced Styling */}
        <motion.section
          className="pb-4 px-4 sm:px-6 lg:px-8 relative"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background Texture */}
          <div className="absolute inset-x-0 -top-10 w-full h-full opacity-30">
            <img
              src={backgroundTextureImage}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="1920"
              height="1080"
              style={{ minHeight: "600px" }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center relative">
              {/* Upward orange glow with subtle noise behind the laptop */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex justify-center items-start z-0"
              >
                <div
                  className="w-[min(1600px,95vw)] h-[500px] -translate-y-20 rounded-full blur-[120px] opacity-30"
                  style={{
                    background:
                      "radial-gradient(75% 80% at 50% 0%, rgba(255,193,7,0.5) 0%, rgba(255,152,0,0.35) 25%, rgba(251,146,60,0.25) 50%, rgba(244,63,94,0.15) 70%, transparent 85%)",
                  }}
                />
              </div>
              <motion.img
                src={macbookImage}
                alt="Leaad AI Platform Demo"
                className="relative z-10 mx-auto max-w-full h-auto"
                style={{ maxHeight: "1000px" }}
                decoding="async"
                width="1600"
                height="1000"
                sizes="(min-width: 1024px) 900px, 90vw"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.section>

        {/* Core Features Section (deferred render to reduce FCP/TBT) */}
        {showDeferred && (
          <section
            id="features"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative"
          >
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-16 pt-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tighter"
                  variants={itemVariants}
                >
                  Everything you need to reach your audience
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 tracking-tight"
                  variants={itemVariants}
                >
                  From lead discovery to customer conversion, we've got you
                  covered
                </motion.p>
              </motion.div>

              <div className="space-y-24">
                {[
                  {
                    icon: MessageSquare,
                    title: "Say the right thing, the first time",
                    description:
                      "We turn your product into scroll-stopping content that feels native and hits the right pain points—every time.",
                    bullets: [
                      "Custom-written posts based on your audience and product",
                      "Crafted to resonate—not just fill space",
                      "Built to drive replies, clicks, and conversions",
                    ],
                    demoPlaceholder: "Post Generation Demo",
                  },
                  {
                    icon: TrendingUp,
                    title: "Steal the structure of what already works",
                    description:
                      "We studied the posts that take off—and turned them into plug-and-play templates that don't miss.",
                    bullets: [
                      "Format, tone, and flow based on proven hits",
                      "Just fill in your product and hit go",
                      "Optimized to be shareable and actionable",
                    ],
                    demoPlaceholder: "Viral Templates Demo",
                  },
                  {
                    icon: Shield,
                    title: "Fit in before you stand out",
                    description:
                      "We help you build an active Reddit presence—so when you post, people listen.",
                    bullets: [
                      "Karma builder to boost your credibility",
                      "Avoid low-effort bans and buried posts",
                      "Show up like someone worth listening to",
                    ],
                    demoPlaceholder: "Karma Builder Demo",
                  },
                  {
                    icon: Zap,
                    title: "The internet talks. We listen.",
                    description:
                      "We scan Reddit 24/7 to surface buying signals, pain points, and leads you can act on right now.",
                    bullets: [
                      "Real-time alerts when someone needs what you're building",
                      "Targeted threads you can reply to—or use for messaging",
                      "Find high-intent users before your competitors do",
                    ],
                    demoPlaceholder: "Lead Engine Demo",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`grid lg:grid-cols-5 gap-16 items-center pb-20 ${
                      index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                    } ${index < 3 ? "border-b-2 border-gray-200" : ""}`}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {/* Content */}
                    <div
                      className={`${
                        index % 2 === 1
                          ? "lg:col-start-4 lg:col-span-2"
                          : "lg:col-span-2"
                      }`}
                    >
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tighter">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed tracking-tight">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Demo Placeholder */}
                    <div
                      className={`${
                        index % 2 === 1
                          ? "lg:col-start-1 lg:col-span-3"
                          : "lg:col-span-3"
                      }`}
                    >
                      {index === 0 ? (
                        // Posts feature video for the first feature
                        <motion.div
                          className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-full flex items-center justify-center overflow-hidden"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover rounded-lg"
                          >
                            <source src={postsVideo} type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                      ) : index === 1 ? (
                        // Viral Templates feature video for the second feature
                        <motion.div
                          className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-full flex items-center justify-center overflow-hidden"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover rounded-lg"
                          >
                            <source src={templatesVideo} type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                      ) : index === 2 ? (
                        // Karma Builder feature video for the third feature
                        <motion.div
                          className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-full flex items-center justify-center overflow-hidden"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover rounded-lg"
                          >
                            <source src={karmaVideo} type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                      ) : (
                        // Regular demo placeholder for other features
                        <motion.div
                          className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 w-full flex items-center justify-center"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <feature.icon className="w-8 h-8 text-orange-500" />
                            </div>
                            <p className="text-gray-500 font-medium">
                              {feature.demoPlaceholder}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              Demo GIF placeholder
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works - Linear-inspired Design (deferred) */}
        {showDeferred && (
          <section
            id="how-it-works"
            className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white relative"
          >
            {/* Background blend to pricing section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-gray-50 pointer-events-none"></div>
            <div className="max-w-5xl mx-auto">
              <motion.div
                className="text-center mb-20 pt-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium shadow-sm"
                  variants={itemVariants}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Simple Process
                </motion.div>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter"
                  variants={itemVariants}
                >
                  How It Works
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 max-w-2xl mx-auto tracking-tight leading-relaxed px-4"
                  variants={itemVariants}
                >
                  From product analysis to lead generation in just 3 simple
                  steps. Our AI handles the heavy lifting while you focus on
                  closing deals.
                </motion.p>
              </motion.div>

              <motion.div
                className="space-y-12 sm:space-y-16 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {[
                  {
                    number: "01",
                    title: "Enter Your Product",
                    description:
                      "Input your product URL and our AI instantly analyzes your target audience, problems solved, and creates the perfect positioning strategy.",
                  },
                  {
                    number: "02",
                    title: "We Find Your Leads",
                    description:
                      "We scan Reddit 24/7 to surface people actively seeking solutions like yours, then provide optimized engagement strategies.",
                  },
                  {
                    number: "03",
                    title: "Interact and Convert",
                    description:
                      "Engage with your found leads using AI-generated, personalized responses that build relationships and convert prospects into customers.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: index * 0.15,
                    }}
                  >
                    {/* Desktop Layout - Hidden on Mobile */}
                    <div className="hidden sm:block">
                      {/* Step Number */}
                      <div className="absolute -left-4 top-0 px-4">
                        <span className="text-7xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors duration-300">
                          {step.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="ml-24 pl-8 transition-colors duration-300">
                        <div className="mb-4">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tighter">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed tracking-tight">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout - Step Number Above Text */}
                    <div className="sm:hidden text-center mb-6">
                      <span className="text-7xl font-bold text-gray-200">
                        {step.number}
                      </span>
                    </div>
                    <div className="sm:hidden text-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tighter">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        {step.description}
                      </p>
                    </div>

                    {/* Subtle background highlight on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>

                    {/* Simple horizontal divider between steps (except for the last step) */}
                    {index < 2 && (
                      <div className="w-full h-px bg-gray-200 mt-8 sm:mt-10"></div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Pricing Section (deferred) */}
        {showDeferred && (
          <section
            id="pricing"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative"
          >
            {/* Background blend from how it works section */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-gray-50 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-16 pt-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium shadow-sm"
                  variants={itemVariants}
                >
                  <CirclePercent className="w-4 h-4 mr-2" />
                  Transparent Pricing
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tighter"
                  variants={itemVariants}
                >
                  Simple, Transparent Pricing
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 max-w-2xl mx-auto tracking-tight"
                  variants={itemVariants}
                >
                  Start generating leads today with our powerful AI platform
                </motion.p>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Free Plan */}
                <motion.div
                  className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-500 ease-out relative p-8 shadow-sm hover:shadow-lg transform hover:scale-[1.005] flex flex-col"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="mb-">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Free
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Perfect for individuals and early stage founders
                    </p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">
                        $0
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        / month
                      </span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-8"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                      onClick={handlePrimaryCta}
                    >
                      {user && !loading
                        ? onboardingComplete
                          ? "Open Dashboard"
                          : "Resume Onboarding"
                        : "Get Started Free"}
                    </Button>
                  </motion.div>

                  <ul className="space-y-4 flex-grow">
                    {[
                      "1 product analysis",
                      "10 leads per month",
                      "10 post generations",
                      "Basic support",
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20, filter: "blur(2px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{
                          delay: index * 0.06,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      >
                        <CircleCheck className="w-5 h-5 text-gray-900 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  className="bg-gradient-to-br from-black to-gray-800 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-500 ease-out relative p-8 shadow-sm hover:shadow-lg transform hover:scale-[1.005] flex flex-col"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Popular Tag */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-s bg-gray-900 px-3 py-1 text-white"
                      >
                        Popular
                      </Badge>
                    </motion.div>
                  </div>

                  <div className="mb-">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Premium
                    </h3>
                    <p className="text-sm text-gray-300 mb-6">
                      Everything you need to generate leads at scale
                    </p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">$19</span>
                      <span className="text-sm text-gray-400 ml-1">
                        / month
                      </span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-8"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      onClick={handlePrimaryCta}
                    >
                      {user && !loading ? "Manage Plan" : "Upgrade to Premium"}
                    </Button>
                  </motion.div>

                  <ul className="space-y-4 flex-grow">
                    {[
                      "Unlimited product analyses",
                      "Unlimited lead generation",
                      "Unlimited AI comments",
                      "Advanced karma builder",
                      "Viral template library",
                      "Priority support",
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20, filter: "blur(2px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{
                          delay: index * 0.06,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      >
                        <CircleCheck className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                        <span className="text-gray-200 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Social Proof with Enhanced Cards (deferred) */}
        {showDeferred && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="inline-flex items-center px-3 py-1 mb-4 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium"
                  variants={itemVariants}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Customer Success
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tighter"
                  variants={itemVariants}
                >
                  Trusted by Growth-Focused Entrepreneurs
                </motion.h2>
              </motion.div>
              <motion.div
                className="grid md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {[
                  {
                    quote:
                      "This tool completely transformed how I generate leads. I went from spending hours manually searching to getting qualified leads in minutes.",
                    name: "John Smith",
                    role: "SaaS Founder",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    quote:
                      "The karma builder feature is genius. I built authentic engagement and never got flagged as spam. My conversion rate increased by 300%.",
                    name: "Maria Rodriguez",
                    role: "E-commerce Owner",
                    image:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    quote:
                      "The AI-generated comments are so natural, nobody can tell they're automated. I'm getting more leads than ever before.",
                    name: "David Lee",
                    role: "Digital Marketer",
                    image:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-8 shadow-sm hover:shadow-md relative flex flex-col"
                    variants={itemVariants}
                  >
                    <p className="text-gray-600 mb-6 tracking-tight leading-relaxed flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=6366f1&color=fff&size=150`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section (deferred) */}
        {showDeferred && (
          <section
            id="faq"
            className="py-28 px-6 sm:px-8 lg:px-12 bg-white relative"
          >
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
            <div className="max-w-4xl mx-auto mb-10">
              <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="inline-flex items-center px-3 py-1 mb-4 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium"
                  variants={itemVariants}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  FAQ
                </motion.div>
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tighter"
                  variants={itemVariants}
                >
                  Frequently Asked Questions
                </motion.h2>
                <motion.p
                  className="text-base text-gray-600 max-w-2xl mx-auto tracking-tight"
                  variants={itemVariants}
                >
                  Everything you need to know about using Leaad for effective
                  marketing
                </motion.p>
              </motion.div>
              <Accordion type="single" collapsible className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      Is there a free plan available?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        Yes! We offer a completely free plan that includes basic
                        lead generation features, limited lead discovery, and
                        access to our core platform. You can start generating
                        leads immediately without any cost or credit card
                        required.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      How does Karma Builder work?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        Karma Builder is our AI-powered tool that helps you
                        build genuine Reddit presence and credibility. It
                        generates relevant comments and posts for karma
                        building. This helps you establish a legitimate Reddit
                        presence before engaging with potential leads.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      Will I get banned from Reddit?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        No, you won't get banned. Leaad AI operates within
                        Reddit's guidelines and uses only publicly available
                        data. We don't automate posting, messaging, or any
                        actions that could violate terms of service. Our tools
                        are designed for research and lead discovery, not
                        automation of social media actions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      How does Leaad actually work?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        Leaad works by scanning reddit conversations in
                        real-time to identify people actively discussing
                        problems your product or service can solve. We use AI to
                        analyze intent, engagement patterns, and buying signals
                        to find high-quality leads.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      How are the posts generated?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        Our AI analyzes trending topics, viral content patterns,
                        and your target audience's interests to generate post
                        ideas and templates. The AI studies what makes content
                        go viral in your niche and helps you create posts that
                        are more likely to engage your audience and generate
                        leads. You maintain full control over the final content.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-b border-gray-200 pb-3 mb-3"
                >
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="px-0 py-2 text-left text-lg font-medium text-gray-900 hover:no-underline">
                      How quickly can I start seeing results?
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <p className="text-base text-gray-600 leading-relaxed tracking-tight">
                        Most users start finding qualified leads within the
                        first 2-6 hours of using Leaad. Results typically
                        improve significantly after the first week. You'll see
                        immediate value from our post generator, viral post
                        templates and karma building tools.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </Accordion>
            </div>
          </section>
        )}

        {/* Enhanced CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mx-auto">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-black"></div>

          {/* Orange Sun Gradient at Top */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: `
                radial-gradient(ellipse 900px 400px at 50% 0%, 
                  rgba(255, 152, 0, 0.4) 0%, 
                  rgba(255, 193, 7, 0.3) 25%, 
                  rgba(251, 146, 60, 0.2) 50%, 
                  rgba(244, 63, 94, 0.1) 75%, 
                  transparent 100%)
              `,
                filter: "contrast(1.2) saturate(1.3)",
              }}
            ></div>
          </div>

          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
              }}
            ></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 text-white border border-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
              Start reaching the right people
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto tracking-tight">
              Transform your growth strategy with smart, targeted distribution
              that actually works.
            </p>
            <div className="flex justify-center">
              <div>
                <button
                  className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  onClick={handlePrimaryCta}
                >
                  {user && !loading
                    ? onboardingComplete
                      ? "Go to Dashboard"
                      : "Continue Onboarding"
                    : "Try it for free"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

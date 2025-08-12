"use client";
import {
  Target,
  MessageSquare,
  TrendingUp,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Link,
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
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Import all images and videos for immediate loading
import logoImage from "/src/assets/logo.png";
import heroBackgroundImage from "/src/assets/herobg.png";
import backgroundTextureImage from "/src/assets/background.png";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 5);
    };

    window.addEventListener("scroll", handleScroll);

    // Force scroll to top immediately when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Also try to prevent scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = (action) => {
    if (user) {
      // If user is authenticated, redirect to dashboard
      navigate("/dashboard");
    } else if (action === "/signup" || action === "/signin") {
      // For signup/signin CTAs, redirect to onboarding first
      navigate("/onboarding");
    } else {
      // For other actions, proceed with the original action
      navigate(action);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        className={`bg-white/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled ? "shadow-[0_4px_32px_rgba(0,0,0,0.10)]" : "shadow-none"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-32 relative">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Left column - Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={logoImage} alt="Leaad Logo" className="w-5 h-5" />
              <span className="text-xl font-semibold text-gray-900 mt-0.5">
                Leaad
              </span>
            </motion.div>

            {/* Center column - Navigation */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => scrollToSection("features")}
                >
                  Features
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => scrollToSection("how-it-works")}
                >
                  How it Works
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => scrollToSection("pricing")}
                >
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => scrollToSection("faq")}
                >
                  FAQ
                </Button>
              </div>
            </div>

            {/* Right column - Buttons */}
            <div className="hidden md:flex items-center justify-end">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleAuthAction("/signin")}
                  >
                    {user ? "Dashboard" : "Log in"}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-normal"
                    onClick={() => handleAuthAction("/signup")}
                  >
                    {user ? "Dashboard" : "Get Started"}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 rounded-b-lg"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="py-4 px-4 space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  <motion.button
                    onClick={() => {
                      scrollToSection("features");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900 transition-colors py-2 w-full text-left"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    Features
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      scrollToSection("how-it-works");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900 transition-colors py-2 w-full text-left"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    How it Works
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      scrollToSection("pricing");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900 transition-colors py-2 w-full text-left"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    Pricing
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      scrollToSection("faq");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900 transition-colors py-2 w-full text-left"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    FAQ
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pt-2"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 mb-3"
                      onClick={() => {
                        handleAuthAction("/signin");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {user ? "Dashboard" : "Sign In"}
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-normal"
                      onClick={() => {
                        handleAuthAction("/signup");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {user ? "Dashboard" : "Get Started"}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section with Floating Elements */}
      <section className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Texture for Hero Section */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={heroBackgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
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
                    onClick={() => handleAuthAction("/signup")}
                  >
                    {user ? "Go to Dashboard" : "Find your next users"}
                    <ChevronRight className="ml-2 w-4 h-4" />
                    {/* <ArrowRight className="ml-2 w-4 h-4" /> */}
                  </button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500"
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
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Core Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
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
              From lead discovery to customer conversion, we've got you covered
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
                  "We help you build an active presence—so when you post, people listen.",
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
                    <motion.div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 h-96 flex items-center justify-center overflow-hidden">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source src={postsVideo} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </motion.div>
                  ) : index === 1 ? (
                    // Viral Templates feature video for the second feature
                    <motion.div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 h-96 flex items-center justify-center overflow-hidden">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source src={templatesVideo} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </motion.div>
                  ) : index === 2 ? (
                    // Karma Builder feature video for the third feature
                    <motion.div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 h-96 flex items-center justify-center overflow-hidden">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source src={karmaVideo} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </motion.div>
                  ) : (
                    // Regular demo placeholder for other features
                    <motion.div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 h-96 flex items-center justify-center">
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

      {/* How It Works with Enhanced Design */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-24"
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
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tighter"
              variants={itemVariants}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto tracking-tight"
              variants={itemVariants}
            >
              From product analysis to lead generation in just 3 simple steps.
              Our AI handles the heavy lifting while you focus on closing deals.
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-40 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                number: "01",
                icon: Link,
                title: "Enter Your Product",
                description:
                  "Input your product URL and our AI instantly analyzes your target audience, problems solved, and creates the perfect positioning strategy.",
              },
              {
                number: "02",
                icon: Sparkles,
                title: "We Find Your Leads",
                description:
                  "We scan Reddit 24/7 to surface people actively seeking solutions like yours, then provide optimized engagement strategies.",
              },
              {
                number: "03",
                icon: TrendingUp,
                title: "Interact and Convert",
                description:
                  "Engage with your found leads using AI-generated, personalized responses that build relationships and convert prospects into customers.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
                whileInView={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
              >
                {/* Step Number and Icon */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-bold text-gray-200">
                      {step.number}
                    </span>
                  </div>

                  {/* Content aligned to the same level */}
                  <div className="flex-1 ml-20">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
                      {step.title}
                      {index === 0 && (
                        <Link className="w-6 h-6 text-gray-400" />
                      )}
                      {index === 1 && (
                        <Dumbbell className="w-6 h-6 text-gray-400" />
                      )}
                      {index === 2 && (
                        <WandSparkles className="w-6 h-6 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-md text-gray-600 leading-relaxed tracking-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with Enhanced Card */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
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
              className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 relative p-8 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex flex-col"
              variants={itemVariants}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Perfect for getting started
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Limited product analyses",
                  "15 leads per month",
                  "15 post generations",
                  "Basic support",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
                {["No karma builder", "No viral templates"].map(
                  (feature, index) => (
                    <motion.li
                      key={index + 4}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 4) * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <X className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-500">{feature}</span>
                    </motion.li>
                  )
                )}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => handleAuthAction("/signup")}
                >
                  Get Started Free
                </Button>
              </motion.div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-amber-500 hover:border-amber-400 transition-all duration-300 relative p-8 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex flex-col"
              variants={itemVariants}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  3-Day Free Trial
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$15</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Everything you need to generate leads at scale
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Unlimited Lead Generation",
                  "Unlimited product analyses",
                  "Unlimited AI Comments",
                  "Advanced karma builder",
                  "Viral template library",
                  "Priority support",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto"
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => handleAuthAction("/signup")}
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-gray-600 mb-4">Start with a 3-day free trial.</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-amber-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                24/7 customer support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof with Enhanced Cards */}
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
                initials: "JS",
              },
              {
                quote:
                  "The karma builder feature is genius. I built authentic engagement and never got flagged as spam. My conversion rate increased by 300%.",
                name: "Maria Rodriguez",
                role: "E-commerce Owner",
                initials: "MR",
              },
              {
                quote:
                  "The AI-generated comments are so natural, nobody can tell they're automated. I'm getting more leads than ever before.",
                name: "David Lee",
                role: "Digital Marketer",
                initials: "DL",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-300 p-8 shadow-sm hover:shadow-lg relative"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 tracking-tight">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-white relative"
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto">
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
              className="text-sm text-gray-600 max-w-2xl mx-auto tracking-tight"
              variants={itemVariants}
            >
              Everything you need to know about using Leaad for effective
              marketing
            </motion.p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  What is social media lead generation and how can Leaad AI
                  help?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Social media lead generation involves finding and engaging
                    with potential customers on platforms like Reddit and
                    Twitter. Leaad AI automates this process by analyzing your
                    product, finding relevant posts where your solution
                    naturally fits, and generating authentic comments that don't
                    look like spam. This helps you build genuine relationships
                    while promoting your product effectively.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  How does Leaad AI's karma building system work?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Our karma builder helps you establish credibility on
                    platforms like Reddit by providing proven templates and
                    comment suggestions for non-promotional posts. This builds
                    your account's reputation organically, so when you do share
                    your product, you're seen as a trusted community member
                    rather than a spammer. The system tracks your progress and
                    suggests the optimal mix of helpful and promotional content.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  Can Leaad AI generate comments for my specific product and
                  posts?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Our AI analyzes your product link to understand your target
                    audience, value proposition, and key benefits. Then it scans
                    relevant posts and generates contextual comments that
                    naturally introduce your solution. Each comment is tailored
                    to the specific post and conversation, ensuring it feels
                    authentic and helpful rather than promotional.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-4"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  What's included in the free trial for lead generation?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Our 3-day free trial includes unlimited product analyses,
                    unlimited AI-generated comments, access to advanced karma
                    building templates, and Reddit + Twitter platform support.
                    You can test all core features without providing a credit
                    card. This gives you enough resources to see real results
                    and understand how the platform can transform your lead
                    generation efforts.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-5"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  How do the AI assistants work for social media marketing?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Our AI assistants work in parallel to maximize your lead
                    generation efficiency. One assistant analyzes your product
                    and identifies your ideal customer profile, another scans
                    thousands of posts to find perfect opportunities, and a
                    third generates natural, contextual comments. They work
                    together seamlessly, reducing what used to take hours of
                    manual work into a 15-second automated process.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-6"
                className="border border-gray-200 rounded-lg mb-4"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  Is my lead generation data secure with Leaad AI?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed tracking-tight">
                    Yes, we take data security very seriously. All your product
                    information, generated comments, and account data are
                    encrypted and stored securely. We never share your data with
                    third parties, and you maintain full control over your
                    information. Our platform is SOC 2 compliant and follows
                    industry best practices for data protection and privacy.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-2xl border-x-2 border-gray-200 mx-auto">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium shadow-sm">
            <Rocket className="w-4 h-4 mr-2" />
            Ready to Get Started?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">
            Start reaching the right people
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto tracking-tight">
            Transform your growth strategy with smart, targeted distribution
            that actually works.
          </p>
          <div className="flex justify-center">
            <div>
              <button
                className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                onClick={() => handleAuthAction("/signup")}
              >
                Try it for free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={logoImage}
                  alt="Leaad"
                  className="w-5 h-5 brightness-0 invert"
                />
                <span className="text-xl font-bold text-white mt-0.5">
                  Leaad
                </span>
              </motion.div>
              <p className="text-gray-300 text-sm">
                AI-powered lead generation for the modern entrepreneur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">
                Product
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">
                Company
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">
                Support
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">
                Connect
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LeadGen AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

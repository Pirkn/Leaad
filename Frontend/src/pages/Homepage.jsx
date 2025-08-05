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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = (action) => {
    if (user) {
      // If user is authenticated, redirect to dashboard
      navigate("/dashboard");
    } else {
      // If user is not authenticated, proceed with the original action
      navigate(action);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                LeadGen AI
              </span>
            </motion.div>
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8 ml-8">
                <motion.a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  How it Works
                </motion.a>
                <motion.a
                  href="#pricing"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Pricing
                </motion.a>
                <motion.a
                  href="#faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  FAQ
                </motion.a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                  onClick={() => handleAuthAction("/signin")}
                >
                  {user ? "Dashboard" : "Sign In"}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  onClick={() => handleAuthAction("/signup")}
                >
                  {user ? "Dashboard" : "Get Started"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Floating Elements */}
      <section className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200 rounded-full text-sm font-medium shadow-sm"
                variants={itemVariants}
              >
                <Rocket className="w-4 h-4 mr-2" />
                AI-Powered Lead Generation
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                variants={itemVariants}
              >
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent relative">
                  Generate Leads
                  {/* <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-60"></div> */}
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                From product analysis to comment generation, we handle the
                entire lead generation process so you can focus on closing
                deals. Turn social platforms into your personal sales funnel.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleAuthAction("/signup")}
                  >
                    {user ? "Go to Dashboard" : "Start Generating Leads"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 bg-transparent"
                  >
                    <button className="px-8 py-5 text-lg">Watch Demo</button>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-6 text-sm text-gray-500"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free 3-day trial
                </motion.div>
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative">
            <motion.img
              src="/src/assets/macbook-air-medium.png"
              alt="LeadGen AI Platform Demo"
              className="mx-auto max-w-full h-auto"
              style={{ maxHeight: "800px" }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section with Enhanced Cards */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Modern Lead Generation Tools
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Our AI-powered platform automates every step of the lead
              generation process
            </motion.p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Target,
                title: "Smart Product Analysis",
                description:
                  "Just paste your product link and our AI analyzes your target audience, problems solved, and creates the perfect positioning strategy.",
              },
              {
                icon: MessageSquare,
                title: "AI Comment Generation",
                description:
                  "Get perfectly crafted, natural-sounding comments that don't look like spam. Each one is tailored to the specific post and context.",
              },
              {
                icon: TrendingUp,
                title: "Karma Builder System",
                description:
                  "Build authentic karma with our proven templates and comment suggestions. Never get flagged as a bot again.",
              },
              {
                icon: Zap,
                title: "15-Second Post Discovery",
                description:
                  "Our AI scans thousands of posts in seconds to find the perfect opportunities where your product naturally fits.",
              },
              {
                icon: BarChart3,
                title: "Viral Template Library",
                description:
                  "Access proven comment templates that have generated thousands of leads. Each template is optimized for maximum engagement.",
              },
              {
                icon: Globe,
                title: "Multi-Platform Ready",
                description:
                  "Starting with Reddit, expanding to Twitter and beyond. One tool for all your social lead generation needs.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-300 group p-8 shadow-sm hover:shadow-xl relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-bl-full"></div>
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works with Enhanced Design */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              From product analysis to lead generation in just 3 simple steps.
              Our AI handles the heavy lifting while you focus on closing deals.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Connection Lines */}
            <motion.div
              className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-200 to-red-200 transform -translate-y-1/2"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.6, // Delay to appear after cards are rendered
              }}
              viewport={{ once: true, margin: "-100px" }}
            ></motion.div>

            {[
              {
                number: "01",
                icon: Link,
                title: "Paste Your Product Link",
                description:
                  "Simply input your product URL and our AI instantly analyzes your target audience, problems solved, and creates the perfect positioning strategy.",
              },
              {
                number: "02",
                icon: Sparkles,
                title: "Let Us Do The Hard Work",
                description:
                  "Receive perfectly crafted, natural-sounding comments tailored to each post. No spam detection, just authentic engagement that converts.",
              },
              {
                number: "03",
                icon: TrendingUp,
                title: "Build Karma (If Needed)",
                description:
                  "Low karma? Use our karma builder with AI-created posts and fitting comments to build authentic credibility before promoting your product.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:border-orange-300 transition-all duration-300 group shadow-sm hover:shadow-lg relative"
                variants={itemVariants}
              >
                <div className="flex items-center gap-5 mb-6">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className="w-6 h-6 text-orange-500" />
                  </motion.div>
                  <span className="text-5xl font-semibold text-gray-200">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with Enhanced Card */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Transparent Pricing
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Start generating leads today with our powerful AI platform
            </motion.p>
          </motion.div>
          <motion.div
            className="max-w-md mx-auto"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Pro Plan */}
            <motion.div className="bg-white rounded-2xl border-2 border-orange-500 hover:border-orange-600 transition-all duration-300 relative p-8 shadow-xl hover:shadow-2xl transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  3-Day Free Trial
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Everything you need to generate leads at scale
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited product analyses",
                  "Unlimited AI-generated comments",
                  "Advanced karma builder",
                  "Reddit + Twitter support",
                  "Viral template library",
                  "Priority support",
                  "All platform integrations",
                  "Custom templates",
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
            <p className="text-gray-600 mb-4">
              Start with a 3-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
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
              className="inline-flex items-center px-3 py-1 mb-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              <Star className="w-4 h-4 mr-2" />
              Customer Success
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
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
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              FAQ
            </motion.div>
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Everything you need to know about using LeadGen for effective
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
                  What is social media lead generation and how can LeadGen AI
                  help?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    Social media lead generation involves finding and engaging
                    with potential customers on platforms like Reddit and
                    Twitter. LeadGen AI automates this process by analyzing your
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
                  How does LeadGen AI's karma building system work?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
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
                  Can LeadGen AI generate comments for my specific product and
                  posts?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
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
                  <p className="text-gray-600 leading-relaxed">
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
                  <p className="text-gray-600 leading-relaxed">
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
                  Is my lead generation data secure with LeadGen AI?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
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
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-2xl border-x-2 border-gray-200 border-t mx-auto"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200 rounded-full text-sm font-medium shadow-sm"
            variants={itemVariants}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Ready to Get Started?
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Boost Your Lead Generation
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Discover how we can significantly enhance your lead generation
            efforts, resulting in faster growth and increased sales.
          </motion.p>
          <motion.div className="flex justify-center" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="px-16 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => handleAuthAction("/signup")}
              >
                <button className="flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  LeadGen AI
                </span>
              </motion.div>
              <p className="text-gray-600">
                AI-powered lead generation for the modern entrepreneur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Features
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Pricing
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    API
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    About
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Blog
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Careers
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Help Center
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Contact
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Privacy
                  </motion.a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 LeadGen AI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

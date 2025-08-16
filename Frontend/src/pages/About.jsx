import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import aboutPhoto from "../assets/aboutPhoto.webp";
import {
  Target,
  Zap,
  BarChart3,
  Users,
  Rocket,
  Shield,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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
  hidden: { opacity: 0, y: 20, filter: "blur(1px)" },
  visible: {
    opacity: 1,
    y: 0,
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

function About() {
  return (
    <>
      <SEOHead
        title="About Leaad"
        description="Learn about Leaad's mission to revolutionize lead generation through AI-powered Reddit marketing. Discover how we help SaaS founders and startups find qualified leads."
        keywords="about leaad, reddit marketing company, AI lead generation, SaaS marketing platform, startup marketing tools"
        url="https://leaad.co/about"
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <motion.div
                className="text-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300 rounded-full text-sm font-medium shadow-sm"
                  variants={itemVariants}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Our Story
                </motion.div>
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tighter"
                  variants={itemVariants}
                >
                  Revolutionizing Lead Generation
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mb-8 leading-relaxed tracking-tight"
                  variants={itemVariants}
                >
                  We're building the future of marketing by combining
                  cutting-edge AI technology with proven Reddit strategies to
                  help SaaS founders and startups find qualified leads without
                  the guesswork.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base font-medium rounded-lg flex items-center justify-center"
                    onClick={() => (window.location.href = "/#features")}
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Image */}
              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <div className="w-full max-w-md lg:max-w-lg flex justify-end">
                  <motion.img
                    src={aboutPhoto}
                    alt="Leaad AI Platform on iPhone"
                    className="w-full h-auto max-w-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Spacing between Hero and Mission */}
        <div className="h-16"></div>

        {/* Mission Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
          {/* Background blend from hero section */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-gray-50 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                Our Mission
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 tracking-tight leading-relaxed"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                To democratize lead generation by making AI-powered marketing
                tools accessible to every entrepreneur, regardless of their
                technical expertise or budget.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {[
                {
                  icon: Target,
                  title: "Targeted Growth",
                  description:
                    "We help you find the exact people who need your solution, eliminating wasted marketing spend.",
                },
                {
                  icon: Zap,
                  title: "AI-Powered Insights",
                  description:
                    "Our advanced AI analyzes millions of Reddit conversations to surface high-intent opportunities.",
                },
                {
                  icon: BarChart3,
                  title: "Data-Driven Results",
                  description:
                    "Every decision is backed by real-time analytics and proven conversion patterns.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
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

        {/* What We Do Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
          {/* Background blend from mission section */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-white pointer-events-none"></div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                What We Do
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 tracking-tight leading-relaxed"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                From lead discovery to customer conversion, we handle the entire
                process so you can focus on building your product.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {[
                {
                  icon: Users,
                  title: "Lead Discovery",
                  description:
                    "We scan Reddit 24/7 to surface people actively seeking solutions like yours, then provide optimized engagement strategies.",
                  features: [
                    "Real-time Reddit monitoring",
                    "Intent-based lead scoring",
                    "Subreddit targeting",
                    "Engagement opportunity alerts",
                  ],
                },
                {
                  icon: Rocket,
                  title: "Content Generation",
                  description:
                    "Our AI creates compelling posts and comments that feel native to Reddit and drive genuine engagement.",
                  features: [
                    "AI-powered post creation",
                    "Viral template library",
                    "Audience-specific messaging",
                    "Engagement optimization",
                  ],
                },
                {
                  icon: Shield,
                  title: "Karma Building",
                  description:
                    "We help you build authentic Reddit presence and credibility before engaging with potential leads.",
                  features: [
                    "Credibility establishment",
                    "Community integration",
                    "Spam prevention",
                    "Trust building",
                  ],
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-8"
                  initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {service.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center space-x-3"
                            initial={{
                              opacity: 0,
                              x: -10,
                              filter: "blur(1px)",
                            }}
                            whileInView={{
                              opacity: 1,
                              x: 0,
                              filter: "blur(0px)",
                            }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                              duration: 0.4,
                              delay: 0.6 + index * 0.1 + featureIndex * 0.05,
                              ease: "easeOut",
                            }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
          {/* Background blend from what we do section */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-gray-50 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                Our Values
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 tracking-tight leading-relaxed"
                initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                The principles that guide everything we build and every decision
                we make.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {[
                {
                  icon: Globe,
                  title: "Accessibility",
                  description:
                    "Making powerful marketing tools available to everyone, not just enterprise companies.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description:
                    "Delivering results that exceed expectations through continuous innovation and refinement.",
                },
                {
                  icon: Users,
                  title: "Community",
                  description:
                    "Building genuine relationships and helping entrepreneurs succeed together.",
                },
                {
                  icon: Zap,
                  title: "Innovation",
                  description:
                    "Pushing the boundaries of what's possible with AI and marketing automation.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
          {/* Background blend from values section */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-gray-900 pointer-events-none"></div>

          {/* Smoother gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

          {/* Blurred overlay for smooth effect */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 text-white border border-white/20 rounded-full text-sm font-medium backdrop-blur-sm"
              initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter"
              initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Join the future of lead generation
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto tracking-tight"
              initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Start finding qualified leads today with our AI-powered platform.
            </motion.p>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                onClick={() => (window.location.href = "/signup")}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default About;

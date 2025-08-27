import React from "react";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CircleCheck } from "lucide-react";
import { CirclePercent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, loading, onboardingComplete } = useAuth();

  const handlePrimaryCta = () => {
    if (!user || loading) return navigate("/signup");
    if (onboardingComplete) return navigate("/dashboard");
    return navigate("/onboarding");
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pricing - Leaad",
    description:
      "Choose the perfect plan for your Reddit lead generation needs. Premium plan with 3-day free trial available.",
    url: "https://leaad.co/pricing",
    mainEntity: {
      "@type": "Article",
      name: "Pricing Plans",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

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

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Pricing - Leaad | Reddit Lead Generation Plans & Pricing"
        description="Choose the perfect plan for your Reddit lead generation needs. Premium plan with transparent pricing and 3-day free trial."
        keywords="pricing, plans, lead generation, Reddit marketing, subscription, free trial"
        structuredData={structuredData}
      />

      <Navigation />

      {/* Pricing Cards */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        {/* Background blend from how it works section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-white pointer-events-none"></div>
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
            className="grid grid-cols-1 gap-8 max-w-md mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
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
                  <span className="text-sm text-gray-400 ml-1">/ month</span>
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
                  {user && !loading ? "Manage Plan" : "Start 3‑day free trial"}
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
              <div className="mt-6 text-xs text-gray-300">
                3‑day free trial included. Cancel anytime before renewal.
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your subscription at
                any time. Changes take effect immediately.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens after my free trial ends?
              </h3>
              <p className="text-gray-600">
                After your 3-day free trial, you'll be charged the monthly
                subscription fee.{" "}
                <strong>Cancel anytime before the deadline </strong>
                to avoid charges. We won't charge you if you cancel during the
                trial period.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes! We offer flexible refunds for wrong purchases, service
                issues, and cases where our service doesn't meet your
                expectations.{" "}
                <a
                  href="/legal/refund-policy"
                  className="text-blue-600 hover:underline"
                >
                  Learn more about our flexible refund policy
                </a>
                .
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees! All plans include instant access to our platform.
                You can start receiving leads immediately after signing up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Generating Leads?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already using Leaad to find their next
            customers on Reddit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
              onClick={handlePrimaryCta}
            >
              {user && !loading ? "Manage Plan" : "Start Free Trial"}
            </Button>
          </div>
        </div>
      </div>

      {/* Legal Links Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Important Legal Information
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a
                href="/legal/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/legal/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/legal/refund-policy"
                className="hover:text-gray-900 transition-colors"
              >
                Refund Policy
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              By using our service, you agree to our terms and policies.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;

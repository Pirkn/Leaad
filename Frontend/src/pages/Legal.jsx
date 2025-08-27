import React from "react";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Legal = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Legal - Leaad",
    description:
      "Access all legal documents and policies for Leaad, including terms of service, privacy policy, refund policy, and more.",
    url: "https://leaad.co/legal",
    mainEntity: {
      "@type": "Article",
      name: "Legal Documents",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

  const legalDocuments = [
    {
      title: "Terms of Service",
      description: "Our terms and conditions for using the Leaad platform",
      link: "/legal/terms",
      icon: "📋",
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      link: "/legal/privacy",
      icon: "🔒",
    },
    {
      title: "Refund Policy",
      description: "Our comprehensive refund policy and cancellation policy",
      link: "/legal/refund-policy",
      icon: "💰",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Legal - Leaad | Terms, Privacy, Refund Policy & Legal Documents"
        description="Access all legal documents and policies for Leaad, including terms of service, privacy policy, and comprehensive refund policy with delivery terms."
        keywords="legal, terms of service, privacy policy, refund policy, legal documents, Leaad legal"
        structuredData={structuredData}
      />

      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Legal Documents
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Access all legal documents, policies, and terms for the Leaad
              platform. We believe in transparency and clear communication.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Legal Documents Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {legalDocuments.map((document, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={document.link}
                className="group bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-900 transition-all duration-300 h-full flex flex-col"
              >
                <div className="text-center flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700">
                    {document.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700">
                    {document.description}
                  </p>
                  <div className="mt-auto pt-6 text-blue-600 font-medium group-hover:text-blue-700">
                    Read More →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h2
              className="text-2xl font-semibold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Company Information
            </motion.h2>
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ESİLAH AV MALZEMELERİ
              </h3>
              <p className="text-gray-700 mb-4">
                Leaad is operated by ESİLAH AV MALZEMELERİ, providing AI-powered
                Reddit lead generation services to businesses and entrepreneurs
                worldwide.
              </p>
              <p className="text-gray-700">
                For any legal inquiries or questions about our policies, please
                contact our support team at{" "}
                <a
                  href="mailto:support@leaad.co"
                  className="text-blue-600 hover:underline"
                >
                  support@leaad.co
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Questions About Our Legal Documents?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Our support team is here to help clarify any legal questions or
            concerns.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link
              to="/contact"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Legal;

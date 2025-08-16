import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Calendar,
  FileText,
} from "lucide-react";

const Privacy = () => {
  const privacySections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, company) when you create an account",
        "Usage data and analytics to improve our services",
        "Reddit data that you authorize us to access",
        "Communication data when you contact our support team",
      ],
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our lead generation services",
        "Analyze usage patterns to improve user experience",
        "Send important updates about our services",
        "Respond to your support requests and inquiries",
        "Ensure compliance with legal obligations",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information",
        "Limited sharing with trusted service providers",
        "Compliance with legal requirements when necessary",
        "Aggregated, anonymized data for analytics purposes",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission",
        "Secure servers with regular security audits",
        "Access controls and authentication measures",
        "Regular backup and disaster recovery procedures",
      ],
    },
    {
      icon: Globe,
      title: "Data Retention",
      content: [
        "Account data retained while your account is active",
        "Usage data retained for up to 2 years",
        "Reddit data deleted upon account deletion",
        "Legal compliance data retained as required by law",
      ],
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request correction of inaccurate data",
        "Request deletion of your account and data",
        "Opt-out of marketing communications",
        "Data portability upon request",
      ],
    },
  ];

  const legalSections = [
    {
      title: "Cookies and Tracking",
      content:
        "We use essential cookies to provide our services and optional analytics cookies to improve user experience. You can control cookie preferences through your browser settings.",
    },
    {
      title: "Third-Party Services",
      content:
        "We may use third-party services for analytics, payment processing, and customer support. These services have their own privacy policies and data handling practices.",
    },
    {
      title: "International Data Transfers",
      content:
        "Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.",
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of any material changes via email or through our platform.",
    },
    {
      title: "Contact Information",
      content:
        "If you have questions about this privacy policy or our data practices, please contact us at privacy@leaad.co or through our contact form.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Privacy Policy - How We Protect Your Data"
        description="Learn how Leaad collects, uses, and protects your personal information. We're committed to transparency and data security."
        keywords="privacy policy, data protection, GDPR compliance, data security, personal information, leaad privacy"
        url="https://leaad.co/privacy"
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-gray-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're committed to protecting your privacy and being transparent
                about how we collect, use, and safeguard your information.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Version 1.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tighter">
                Introduction
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Leaad, we believe in transparency and protecting your
                  privacy. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our
                  Reddit lead generation platform.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy. We are committed
                  to ensuring that your privacy is protected and will only use
                  your information in ways that are described in this policy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This policy applies to all users of our platform, including
                  visitors, registered users, and customers. If you have any
                  questions about this policy, please contact us.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Privacy Principles Grid */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tighter text-center">
                Our Privacy Principles
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privacySections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <section.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-gray-600 text-sm leading-relaxed flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Legal Details */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tighter">
                Additional Legal Information
              </h2>

              <div className="space-y-8">
                {legalSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* GDPR Compliance */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tighter">
                GDPR Compliance
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  For users in the European Union, we comply with the General
                  Data Protection Regulation (GDPR). This means you have
                  additional rights regarding your personal data:
                </p>
                <ul className="space-y-2 text-gray-600 leading-relaxed">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Right to be informed:</strong> You have the right to
                    be informed about how we collect and use your personal data.
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Right of access:</strong> You can request a copy of
                    the personal data we hold about you.
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Right to rectification:</strong> You can request
                    that we correct any inaccurate personal data.
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Right to erasure:</strong> You can request that we
                    delete your personal data in certain circumstances.
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Right to data portability:</strong> You can request
                    a copy of your data in a machine-readable format.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tighter">
                Questions About Privacy?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                If you have any questions about this privacy policy or how we
                handle your data, please don't hesitate to reach out to our
                privacy team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/contact")}
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </button>
                <button
                  onClick={() =>
                    window.open("mailto:privacy@leaad.co", "_blank")
                  }
                  className="px-6 py-3 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Email Privacy Team
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

export default Privacy;

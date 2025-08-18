import { useState } from "react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Settings,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 5000);
  };

  return (
    <>
      <SEOHead
        title="Help & Contact - Get Support & Contact Leaad"
        description="Get help with Leaad, find answers to common questions, and contact our support team. We're here to help you succeed with Reddit lead generation."
        keywords="help center, contact leaad, support, FAQ, reddit marketing help, lead generation support, customer service"
        url="https://leaad.co/contact"
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
                Help & Contact
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions, learn best practices, and get
                in touch with our support team. We're here to help you succeed.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tighter">
                  Send us a message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Message sent successfully!
                    </h3>
                    <p className="text-green-700">
                      We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tighter">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Email Support
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      For immediate assistance, you can reach us directly at:
                    </p>
                    <div className="text-lg font-medium text-gray-900 mb-4">
                      support@leaad.co
                    </div>
                    <button
                      onClick={() =>
                        window.open("mailto:support@leaad.co", "_blank")
                      }
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    >
                      Send Email
                    </button>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Response Time
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      We typically respond to all inquiries within 24 hours
                      during business days. For urgent matters, please email us
                      directly.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• General inquiries: 24 hours</p>
                      <p>• Technical support: 4-8 hours</p>
                      <p>• Account issues: 2-4 hours</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM PST
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tighter">
                Still need help?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to
                help you get the most out of Leaad.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    window.open("mailto:support@leaad.co", "_blank")
                  }
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Email Support
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

export default Contact;

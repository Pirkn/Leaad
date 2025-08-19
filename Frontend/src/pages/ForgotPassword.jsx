import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (success) {
    return (
      <>
        <SEOHead
          title="Password Reset Sent"
          description="Password reset email has been sent. Check your inbox to reset your Leaad account password and regain access to your AI-powered lead generation tools."
          keywords="password reset, forgot password, leaad account, email sent"
          url="https://leaad.co/forgot-password"
          noindex
        />
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-md w-full space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <motion.div
                  className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-green-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <motion.h2
                  className="mt-6 text-center text-2xl font-semibold text-gray-900"
                  variants={itemVariants}
                >
                  Check your email
                </motion.h2>
                <motion.p
                  className="mt-2 text-center text-sm text-gray-600"
                  variants={itemVariants}
                >
                  We've sent a password reset link to <strong>{email}</strong>
                </motion.p>
                <motion.p
                  className="mt-4 text-center text-sm text-gray-500"
                  variants={itemVariants}
                >
                  If you don't see it, check your spam folder.
                </motion.p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Go Back</span>
                </motion.button>
                <div>
                  <Link
                    to="/signin"
                    className="font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Forgot Password"
        description="Reset your Leaad account password. Enter your email address and we'll send you a secure link to regain access to your AI-powered lead generation tools."
        keywords="forgot password, reset password, leaad account, password recovery"
        url="https://leaad.co/forgot-password"
        noindex
      />
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-md w-full space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.div
                className="mx-auto h-12 w-12 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/src/assets/logo.png"
                  alt="Leaad Logo"
                  className="h-10 w-10"
                />
              </motion.div>
              <motion.h2
                className="mt-6 text-center text-2xl font-semibold text-gray-900"
                variants={itemVariants}
              >
                Reset your password
              </motion.h2>
              <motion.p
                className="mt-2 text-center text-sm text-gray-600"
                variants={itemVariants}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </motion.p>
            </motion.div>

            <motion.form
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              {error && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 sm:text-sm transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {loading ? "Sending..." : "Send reset link"}
                </motion.button>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Go Back</span>
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

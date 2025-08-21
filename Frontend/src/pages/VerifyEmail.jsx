import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import SEOHead from "../components/SEOHead";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back to signup
      navigate("/signup");
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await verifyOTP(email, otp);

      if (data?.user) {
        setSuccess("Email verified successfully! Redirecting...");
        // Navigate to dashboard - the auth context will handle onboarding status check
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Verification code resent! Check your email.");
        setCountdown(60); // Start 60 second countdown
        setOtp(""); // Clear the OTP input
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignUp = () => {
    navigate("/signup");
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

  return (
    <>
      <SEOHead
        title="Verify Your Email"
        description="Enter the verification code sent to your email to complete your account setup."
        keywords="verify email, email verification, OTP, account setup"
        url="https://leaad.co/verify-email"
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
                <Mail className="h-10 w-10 text-gray-900" />
              </motion.div>
              <motion.h2
                className="mt-6 text-center text-2xl font-semibold text-gray-900"
                variants={itemVariants}
              >
                Verify your email
              </motion.h2>
              <motion.p
                className="mt-2 text-center text-sm text-gray-600"
                variants={itemVariants}
              >
                We've sent a 6-digit verification code to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </motion.p>
            </motion.div>

            <motion.div className="mt-8 space-y-6" variants={itemVariants}>
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

              {success && (
                <motion.div
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {success}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter the 6-digit code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    className="gap-2"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <>
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
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </motion.button>
              </motion.div>

              <motion.div
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleBackToSignUp}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Sign Up</span>
                </motion.button>

                <motion.button
                  onClick={handleResendOTP}
                  disabled={resendLoading || countdown > 0}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : resendLoading
                      ? "Sending..."
                      : "Resend code"}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;

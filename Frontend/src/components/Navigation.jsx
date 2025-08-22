import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "/src/assets/logo.png";

const Navigation = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, onboardingComplete } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = (action) => {
    if (user && !loading) {
      if (onboardingComplete) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } else if (action === "/signup" || action === "/signin") {
      navigate(action);
    } else {
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

  const handleSectionNavigation = (sectionId) => {
    if (isHomepage) {
      // If we're on homepage, just scroll to section
      scrollToSection(sectionId);
    } else {
      // If we're on another page, navigate to homepage first, then scroll
      navigate("/");
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  const handleLogoClick = () => {
    if (isHomepage) {
      // If we're already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If we're on another page, navigate to homepage
      navigate("/");
    }
  };

  return (
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
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleLogoClick}
          >
            <img src={logoImage} alt="Leaad Logo" className="w-5 h-5" />
            <span className="text-xl font-semibold text-gray-900 mt-0.5">
              Leaad
            </span>
          </motion.div>

          {/* Center column - Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleSectionNavigation("features")}
                >
                  Features
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleSectionNavigation("how-it-works")}
                >
                  How it Works
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleSectionNavigation("pricing")}
                >
                  Pricing
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleSectionNavigation("faq")}
                >
                  FAQ
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right column - Buttons */}
          <div className="hidden lg:flex items-center justify-end">
            <div className="flex items-center space-x-3">
              {/* Only show ghost button if user is not signed in OR if onboarding is complete */}
              {(!user || loading || onboardingComplete) && (
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
                    {user && !loading
                      ? onboardingComplete
                        ? "Dashboard"
                        : "Complete Setup"
                      : "Log in"}
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-normal"
                  onClick={() => handleAuthAction("/signup")}
                >
                  {user && !loading
                    ? onboardingComplete
                      ? "Dashboard"
                      : "Complete Setup"
                    : "Get Started"}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden col-start-3 justify-self-end">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 rounded-b-lg"
              >
                <div className="py-4 px-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleSectionNavigation("features");
                      toggleMobileMenu();
                    }}
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleSectionNavigation("how-it-works");
                      toggleMobileMenu();
                    }}
                  >
                    How it Works
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleSectionNavigation("pricing");
                      toggleMobileMenu();
                    }}
                  >
                    Pricing
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleSectionNavigation("faq");
                      toggleMobileMenu();
                    }}
                  >
                    FAQ
                  </Button>

                  <div className="pt-2 border-t border-gray-200">
                    {/* Only show ghost button if user is not signed in OR if onboarding is complete */}
                    {(!user || loading || onboardingComplete) && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => {
                          handleAuthAction("/signin");
                          toggleMobileMenu();
                        }}
                      >
                        {user && !loading
                          ? onboardingComplete
                            ? "Dashboard"
                            : "Complete Setup"
                          : "Log in"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="w-full mt-2 px-4 py-2 rounded-md bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-normal"
                      onClick={() => {
                        handleAuthAction("/signup");
                        toggleMobileMenu();
                      }}
                    >
                      {user && !loading
                        ? onboardingComplete
                          ? "Dashboard"
                          : "Complete Setup"
                        : "Get Started"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;

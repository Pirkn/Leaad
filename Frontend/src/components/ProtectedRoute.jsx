import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { user, loading, onboardingComplete, onboardingStatusLoading } =
    useAuth();
  const location = useLocation();

  console.log("ProtectedRoute state:", {
    user: !!user,
    loading,
    onboardingComplete,
    onboardingStatusLoading,
    requireOnboarding,
    pathname: location.pathname,
  });

  // Show loading only if we're checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to homepage
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If onboarding is required and we're still checking onboarding status, show loading
  if (requireOnboarding && onboardingStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If onboarding is required and not completed, redirect to onboarding
  if (requireOnboarding && !onboardingComplete) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

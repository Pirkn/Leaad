import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { KarmaProvider } from "./contexts/KarmaContext";
import { LeadsProvider } from "./contexts/LeadsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import ViralTemplates from "./pages/ViralTemplates";
import ViralTemplateEdit from "./pages/ViralTemplateEdit";
import Products from "./pages/Products";
import ProductAnalysis from "./pages/ProductAnalysis";
import RedditPosts from "./pages/RedditPosts";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Karma from "./pages/Karma";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Homepage from "./pages/Homepage";
import Onboarding from "./pages/Onboarding";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Component to handle root path redirects
const RootRedirect = () => {
  const { user, loading, onboardingComplete, onboardingStatusLoading } =
    useAuth();

  // Don't redirect while loading
  if (loading) {
    return <Homepage />;
  }

  if (user && !onboardingStatusLoading) {
    if (onboardingComplete) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <Homepage />;
};

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <LeadsProvider>
          <KarmaProvider>
            <Router>
              <ScrollToTop />
              <Toaster
                position="bottom-right"
                theme="light"
                toastOptions={{
                  classNames: {
                    toast:
                      "bg-white text-gray-900 border border-gray-200 shadow-lg rounded-lg px-3 py-2 max-w-xs",
                    content: "text-gray-900 text-sm",
                    title: "text-gray-900 text-sm",
                    description: "text-gray-700 text-xs",
                    icon: "hidden",
                    successIcon: "hidden",
                    infoIcon: "hidden",
                    warningIcon: "hidden",
                    errorIcon: "hidden",
                    loadingIcon: "hidden",
                  },
                }}
              />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/success" element={<Success />} />
                <Route path="/failure" element={<Failure />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Protected routes that require onboarding completion */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute requireOnboarding={false}>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Dashboard />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Leads />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/viral-templates"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <ViralTemplates />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/viral-templates/:templateId"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <ViralTemplateEdit />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Products />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product-analysis"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <ProductAnalysis />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reddit-posts"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <RedditPosts />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Posts />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/karma"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Karma />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <div className="flex-1 overflow-auto">
                          <Settings />
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </KarmaProvider>
        </LeadsProvider>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;

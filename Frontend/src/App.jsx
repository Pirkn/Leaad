import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import ViralTemplates from "./pages/ViralTemplates";
import Products from "./pages/Products";
import ProductAnalysis from "./pages/ProductAnalysis";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route
            path="/"
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
    </AuthProvider>
  );
}

export default App;

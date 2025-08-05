import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useApi";
import {
  Package,
  Link,
  FileText,
  Activity,
  ShieldCheck,
  TriangleAlert,
  CircleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Products() {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // API hooks
  const { data: productsResponse, isLoading, error } = useProducts();
  const products = productsResponse?.products || [];
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Get the first product (assuming single product setup)
  const product = products[0];

  const handleAddProduct = () => {
    navigate("/product-analysis");
  };

  const handleEdit = (product) => {
    // TODO: Implement edit functionality
    alert("Edit functionality not implemented yet. Coming soon!");
  };

  const handleSave = async (updatedProduct) => {
    // TODO: Implement save functionality
    alert("Save functionality not implemented yet. Coming soon!");
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert(
        `Failed to delete product: ${error.message || "Please try again."}`
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Product
          </h3>
          <p className="text-sm text-red-700">
            {error.message ||
              "Failed to load product details. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // No Product State
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No product configured
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by adding your first product
          </p>
          <button
            onClick={handleAddProduct}
            className="bg-[#FF4500] text-white px-6 py-3 rounded-lg hover:bg-[#CC3700] transition-all duration-200 flex items-center mx-auto shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Your First Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Details
        </h1>
      </motion.div>

      {/* Main Content - Centered Cards */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Your Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Your Product
                  </h2>
                  <p className="text-gray-600 text-sm">
                    This is the product that Leaad monitors Reddit for to find
                    relevant leads and discussions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(product)}
                className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-xs"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </div>
          </motion.div>

          {/* Free Tier Notice */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TriangleAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-900 font-medium">
                  Free tier: 0/1 product edits used
                </p>
                <p className="text-blue-700 text-sm">
                  Upgrade to premium for unlimited edits
                </p>
              </div>
            </div>
          </div> */}

          {/* Product Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Product Information
              </h2>
              <p className="text-gray-600 text-sm">
                The details of your monitored product
              </p>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <p className="text-gray-900">
                    {product.name || "WaitlistNow"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 -mx-6 px-6"></div>

              {/* Website URL */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Link className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <div className="mt-1">
                    <a
                      href={product.url || "https://www.waitlistsnow.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {product.url || "https://www.waitlistsnow.com"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 -mx-6 px-6"></div>

              {/* Product Description */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {product.description ||
                      "WaitlistNow is a no-code platform that allows you to create and launch professional waitlist pages in minutes. With its powerful customization tools, you can design a unique waitlist page that perfectly fits your brand and start building your future audience instantly. Avoid wasting time coding waitlist pages and instead focus on growing your main product. WaitlistNow offers advanced analytics, real-time updates, and a limited launch offer, making it the perfect solution to validate your SaaS idea and grow your email list."}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 -mx-6 px-6"></div>

              {/* Problem Solved */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Problem Solved
                  </label>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {product.problem_solved ||
                      "Addresses the challenge of validating new product or SaaS ideas and building an early audience without requiring coding skills or significant development time."}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 -mx-6 px-6"></div>

              {/* Target Audience */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {product.target_audience ||
                      "Entrepreneurs, SaaS founders, and individuals launching new product ideas."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monitoring Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Monitoring Details
              </h2>
              <p className="text-gray-600 text-sm">
                Information about the monitoring process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Divider */}
              <div className="col-span-1 md:col-span-2 border-t border-gray-200 -mx-6 px-6"></div>

              {/* Started Monitoring */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Started monitoring
                  </label>
                  <p className="text-gray-900">
                    {formatDate(product.created_at || new Date())}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Monitoring
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works information tip */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CircleAlert className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-900 text-sm">
                    <strong>How it works:</strong> Leaad continuously monitors
                    Reddit for mentions of your product, relevant discussions,
                    and potential leads. When it finds relevant content, it will
                    notify you and provide insights to help you engage with the
                    community effectively.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={deleteProductMutation.isPending}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Products;

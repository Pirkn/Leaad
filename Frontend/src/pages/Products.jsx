import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
  useAnalyzeProduct,
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
import { Toaster, toast } from "sonner";
import { Button } from "../components/ui/button";

function Products() {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    url: "",
    description: "",
    target_audience: "",
    problem_solved: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // API hooks
  const { data: productsResponse, isLoading, error } = useProducts();
  const products = productsResponse?.products || [];
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const analyzeProductMutation = useAnalyzeProduct();

  // Get the first product (assuming single product setup)
  const product = products[0];

  const handleAddProduct = () => {
    navigate("/product-analysis");
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormValues({
      name: product.name || "",
      url: product.url || "",
      description: product.description || "",
      target_audience: product.target_audience || "",
      problem_solved: product.problem_solved || "",
    });
  };

  const handleSave = async () => {
    if (!product?.id) return;
    try {
      await updateProductMutation.mutateAsync({
        productId: product.id,
        productData: { ...formValues },
      });
      setEditingProduct(null);
      toast("Product saved", { duration: 2000 });
    } catch (error) {
      toast(error.message || "Failed to save product", { duration: 2500 });
    }
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

  const handleReanalyzeProduct = async () => {
    if (!product?.url) {
      toast("No product URL available for reanalysis", { duration: 2500 });
      return;
    }

    try {
      console.log("Starting reanalysis for URL:", product.url);
      const result = await analyzeProductMutation.mutateAsync(product.url);
      console.log("Analysis result:", result);

      // Use the returned values from generate-product-details
      if (result) {
        console.log("New data to save:", result);

        // Immediately update form values to display the new data
        setFormValues({
          name: product.name, // Keep existing name
          url: product.url, // Keep existing URL
          description: result.description,
          target_audience: result.target_audience,
          problem_solved: result.problem_solved,
        });

        // Call edit-product endpoint with the new analysis data
        const updateResult = await updateProductMutation.mutateAsync({
          productId: product.id,
          productData: {
            name: product.name, // Keep existing name
            url: product.url, // Keep existing URL
            description: result.description,
            target_audience: result.target_audience,
            problem_solved: result.problem_solved,
          },
        });
        console.log("Update result:", updateResult);

        toast("Product reanalyzed and saved successfully", { duration: 2000 });
      } else {
        console.log("No product_details in result:", result);
        toast("No product details received from analysis", { duration: 2500 });
      }
    } catch (error) {
      console.error("Reanalysis error:", error);
      toast(error.message || "Failed to reanalyze product", { duration: 2500 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Details
        </h1>
      </div>

      {/* Main Content - Centered Cards */}
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
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
        ) : !product ? (
          <div className="flex items-center justify-center min-h-[400px]">
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
        ) : (
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
              </div>
            </motion.div>

            {/* Product Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Product Information
                    </h2>
                    <p className="text-gray-600 text-sm">
                      The details of your monitored product
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingProduct !== product.id && (
                      <button
                        onClick={handleReanalyzeProduct}
                        disabled={analyzeProductMutation.isPending}
                        className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzeProductMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>Reanalyze Product</span>
                          </>
                        )}
                      </button>
                    )}
                    {editingProduct === product.id ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleSave}
                          disabled={updateProductMutation.isPending}
                          variant="outline"
                          className="border-green-500 hover:border-green-600 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 h-9 text-sm"
                        >
                          {updateProductMutation.isPending
                            ? "Saving..."
                            : "Save"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-red-300 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 h-9 text-sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
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
                    )}
                  </div>
                </div>
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
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[0.95rem]"
                        value={formValues.name}
                        onChange={(e) =>
                          setFormValues((v) => ({ ...v, name: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="text-gray-900">
                        {product.name || "WaitlistNow"}
                      </p>
                    )}
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
                    {editingProduct === product.id ? (
                      <input
                        type="url"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[0.95rem]"
                        value={formValues.url}
                        onChange={(e) =>
                          setFormValues((v) => ({ ...v, url: e.target.value }))
                        }
                      />
                    ) : (
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
                    )}
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
                    {editingProduct === product.id ? (
                      <textarea
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[0.95rem]"
                        rows={4}
                        value={formValues.description}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            description: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {product.description ||
                          "WaitlistNow is a no-code platform that allows you to create and launch professional waitlist pages in minutes. With its powerful customization tools, you can design a unique waitlist page that perfectly fits your brand and start building your future audience instantly. Avoid wasting time coding waitlist pages and instead focus on growing your main product. WaitlistNow offers advanced analytics, real-time updates, and a limited launch offer, making it the perfect solution to validate your SaaS idea and grow your email list."}
                      </p>
                    )}
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
                    {editingProduct === product.id ? (
                      <textarea
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[0.95rem]"
                        rows={3}
                        value={formValues.problem_solved}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            problem_solved: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {product.problem_solved ||
                          "Addresses the challenge of validating new product or SaaS ideas and building an early audience without requiring coding skills or significant development time."}
                      </p>
                    )}
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
                    {editingProduct === product.id ? (
                      <textarea
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[0.95rem]"
                        rows={3}
                        value={formValues.target_audience}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            target_audience: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {product.target_audience ||
                          "Entrepreneurs, SaaS founders, and individuals launching new product ideas."}
                      </p>
                    )}
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
                      and potential leads. When it finds relevant content, it
                      will notify you and provide insights to help you engage
                      with the community effectively.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
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

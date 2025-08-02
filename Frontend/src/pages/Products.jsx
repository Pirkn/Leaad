import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
  useGenerateRedditPost,
} from "../hooks/useApi";

function Products() {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [generatingForProduct, setGeneratingForProduct] = useState(null);

  // API hooks
  const { data: productsResponse, isLoading, error } = useProducts();
  const products = productsResponse?.products || [];
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const generateRedditPostMutation = useGenerateRedditPost();

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

  const handleGenerateRedditPost = async (product) => {
    try {
      setGeneratingForProduct(product.id);
      const response = await generateRedditPostMutation.mutateAsync({
        product_id: product.id,
      });
      setGeneratedPost({
        product: product,
        content: response.response,
      });
      setGeneratingForProduct(null);
    } catch (error) {
      console.error("Failed to generate Reddit post:", error);
      alert(
        `Failed to generate Reddit post: ${
          error.message || "Please try again."
        }`
      );
      setGeneratingForProduct(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          onClick={handleAddProduct}
          className="bg-[#3D348B] text-white px-4 py-3 rounded-lg hover:bg-[#2A1F6B] transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow-md"
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
          Add Product
        </button>
      </div>

      {/* Generated Post Display */}
      {generatedPost && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Reddit Post for {generatedPost.product.name}
            </h3>
            <button
              onClick={() => setGeneratedPost(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {generatedPost.content}
            </p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="text-[#3D348B] hover:text-[#2A1F6B] text-sm font-medium">
              Copy to Clipboard
            </button>
            <button className="text-[#3D348B] hover:text-[#2A1F6B] text-sm font-medium">
              Use as Template
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#3D348B] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Products
          </h3>
          <p className="text-sm text-red-700">
            {error.message || "Failed to load products. Please try again."}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <div>
          {products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
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
                No products yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first product
              </p>
              <button
                onClick={handleAddProduct}
                className="bg-[#3D348B] text-white px-6 py-3 rounded-lg hover:bg-[#2A1F6B] transition-all duration-200 flex items-center mx-auto shadow-sm hover:shadow-md"
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#3D348B] transition-colors flex flex-col h-[500px]"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Added {formatDate(product.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={true}
                          className="p-1.5 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit functionality coming soon"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(product.id)}
                          disabled={deleteProductMutation.isPending}
                          className="p-1.5 bg-red-100 rounded text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                          title="Delete product"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    {/* Website */}
                    {product.url && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Website
                          </p>
                        </div>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#3D348B] hover:text-[#2A1F6B] break-all block bg-purple-50 px-3 py-2 rounded-md border border-purple-100 hover:bg-purple-100 transition-colors flex items-center"
                        >
                          {product.url}
                        </a>
                      </div>
                    )}

                    {/* Target Audience */}
                    {product.target_audience && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-2"
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
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Target Audience
                          </p>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-1">
                          {product.target_audience}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {product.description && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Description
                          </p>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-3">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {/* Problem Solved */}
                    {product.problem_solved && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-2"
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
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Problem Solved
                          </p>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-3">
                          {product.problem_solved}
                        </p>
                      </div>
                    )}

                    {/* Spacer to push button to bottom */}
                    <div className="flex-1"></div>

                    {/* Generate Reddit Post Button */}
                    <div className="pt-3 border-t border-gray-100 mt-auto">
                      <button
                        onClick={() => handleGenerateRedditPost(product)}
                        disabled={
                          generatingForProduct === product.id ||
                          generateRedditPostMutation.isPending
                        }
                        className="w-full bg-[#3D348B] text-white px-3 py-2 rounded-md hover:bg-[#2A1F6B] transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingForProduct === product.id ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-2 animate-spin"
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
                            Generating...
                          </>
                        ) : (
                          <>
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
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Generate Reddit Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md mx-4">
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
          </div>
        </div>
      )}
    </div>
  );
}

// TODO: Edit Product Form Component - To be implemented
// function EditProductForm({ product, onSave, onCancel, isUpdating }) {
//   // Implementation coming soon
// }

export default Products;

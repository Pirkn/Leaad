import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useApi";

function Products() {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // API hooks
  const { data: productsResponse, isLoading, error } = useProducts();
  const products = productsResponse?.products || [];
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

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

  const handleGenerateRedditPost = (product) => {
    navigate("/reddit-posts", { state: { product } });
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#3D348B] transition-colors flex flex-col h-60 shadow-sm hover:shadow-md"
                >
                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description with fade effect */}
                    <div className="flex-1 relative">
                      <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                        {product.description || "No description available"}
                      </p>
                      {/* Fade overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Action Buttons */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        disabled={true}
                        className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        title="Edit functionality coming soon"
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
                      <button
                        onClick={() => setShowDeleteModal(product.id)}
                        disabled={deleteProductMutation.isPending}
                        className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-md border border-red-300 hover:bg-red-200 transition-colors disabled:opacity-50 text-sm"
                        title="Delete product"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>

                    {/* Visit Link */}
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                        title="Visit product website"
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Visit
                      </a>
                    )}
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

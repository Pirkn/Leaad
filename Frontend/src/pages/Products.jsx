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
  const { data: products = [], isLoading, error } = useProducts();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleAddProduct = () => {
    navigate("/product-analysis");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (updatedProduct) => {
    try {
      await updateProductMutation.mutateAsync({
        productId: updatedProduct.id,
        productData: updatedProduct,
      });
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
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
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          Add Product
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
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

      {/* Products List */}
      {!isLoading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg">
          {products.length === 0 ? (
            <div className="p-8 text-center">
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
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="p-6">
                  {editingProduct?.id === product.id ? (
                    <EditProductForm
                      product={editingProduct}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isUpdating={updateProductMutation.isPending}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            Added {formatDate(product.createdAt)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Website
                            </p>
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-orange-600 hover:text-orange-700 break-all"
                            >
                              {product.url}
                            </a>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Target Audience
                            </p>
                            <p className="text-sm text-gray-900">
                              {product.targetAudience}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Description
                            </p>
                            <p className="text-sm text-gray-900">
                              {product.description}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Problem Solved
                            </p>
                            <p className="text-sm text-gray-900">
                              {product.problemSolved}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={updateProductMutation.isPending}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(product.id)}
                          disabled={deleteProductMutation.isPending}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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

// Edit Product Form Component
function EditProductForm({ product, onSave, onCancel, isUpdating }) {
  const [formData, setFormData] = useState({
    name: product.name,
    url: product.url,
    description: product.description,
    problemSolved: product.problemSolved,
    targetAudience: product.targetAudience,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formData });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Solved
          </label>
          <textarea
            value={formData.problemSolved}
            onChange={(e) => handleChange("problemSolved", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <textarea
            value={formData.targetAudience}
            onChange={(e) => handleChange("targetAudience", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isUpdating}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Products;

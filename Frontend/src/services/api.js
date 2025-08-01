import { authService } from "./supabase";

const API_BASE_URL = "http://localhost:5000";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get current session token
  async getAuthToken() {
    return await authService.getAccessToken();
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getAuthToken();
    return !!token;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get authentication token
    const token = await this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.error("Authentication failed - token may be expired");
          // You could trigger a sign-out here if needed
          // await authService.signOut();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }

  // Product endpoints
  async generateProductDetails(productWebsiteLink) {
    return this.request("/generate-product-details", {
      method: "POST",
      body: JSON.stringify({
        product_website_link: productWebsiteLink,
      }),
    });
  }

  // Reddit endpoints
  async generateRedditPost(productData) {
    return this.request("/generate-reddit-post", {
      method: "POST",
      body: JSON.stringify({
        product_name: productData.productName,
        product_description: productData.productDescription,
        product_target_audience: productData.productTargetAudience,
        product_main_benefit: productData.productMainBenefit,
        product_website_link: productData.productWebsiteLink,
      }),
    });
  }

  async getViralPosts() {
    return this.request("/get-viral-posts");
  }

  // Product management endpoints
  async getProducts() {
    return this.request("/products");
  }

  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();

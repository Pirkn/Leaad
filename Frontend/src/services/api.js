import { authService } from "./supabase";

<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

=======
>>>>>>> origin/main
class ApiService {
  constructor() {
    // Get config dynamically to avoid circular dependency issues
    this.baseURL = this.getBaseUrl();
  }

  getBaseUrl() {
    // Fallback to environment variable directly to avoid circular dependency
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
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
    // Enforce HTTPS in production
    if (import.meta.env.PROD && !this.baseURL.startsWith("https://")) {
      throw new Error("HTTPS is required in production environment");
    }

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
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        import.meta.env.VITE_API_TIMEOUT || 30000
      );

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.error("Authentication failed - token may be expired");
          // You could trigger a sign-out here if needed
          // await authService.signOut();
        }

        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("API request timed out");
        throw new Error("Request timed out. Please try again.");
      }
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

  // Onboarding lead generation (no auth required)
  async onboardingLeadGeneration(productData) {
    return this.request("/onboarding-lead-generation", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Onboarding status endpoints
  async getOnboardingStatus() {
    return this.request("/get-onboarding-status");
  }

  async setOnboardingComplete() {
    return this.request("/set-onboarding-complete", {
      method: "POST",
    });
  }

  // Reddit endpoints
  async generateRedditPost(productData) {
    return this.request("/generate-reddit-post", {
      method: "POST",
      body: JSON.stringify({
        product_id: productData.product_id,
      }),
    });
  }

  async getRedditPosts() {
    return this.request("/get-reddit-posts");
  }

  // Karma endpoints
  async generateKarmaComment() {
    return this.request("/create_karma_comment", {
      method: "POST",
    });
  }

  async generateKarmaPost() {
    return this.request("/create_karma_post", {
      method: "POST",
    });
  }

  // Removed getViralPosts - now using static data instead of API calls

  // Product management endpoints
  async getProducts() {
    return this.request("/products");
  }

  async createProduct(productData) {
    return this.request("/create_product", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // TODO: Implement update product functionality
  async updateProduct(productId, productData) {
    return this.request("/edit-product", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        ...productData,
      }),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: "DELETE",
    });
  }

  // Lead endpoints
  async generateLeads(productId) {
    return this.request("/lead-generation", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
      }),
    });
  }

  async getLeads() {
    return this.request("/get-leads");
  }

  async markLeadAsRead(leadId) {
    return this.request("/mark-lead-as-read", {
      method: "POST",
      body: JSON.stringify({
        lead_id: leadId,
      }),
    });
  }

  async markLeadAsUnread(leadId) {
    return this.request("/mark-lead-as-unread", {
      method: "POST",
      body: JSON.stringify({
        lead_id: leadId,
      }),
    });
  }

  // Reddit post save/unsave endpoints
  async markRedditPostAsSaved(postId) {
    return this.request("/mark-reddit-post-as-read", {
      method: "POST",
      body: JSON.stringify({
        post_id: postId,
      }),
    });
  }

  async markRedditPostAsUnsaved(postId) {
    return this.request("/mark-reddit-post-as-unread", {
      method: "POST",
      body: JSON.stringify({
        post_id: postId,
      }),
    });
  }
}

export default new ApiService();

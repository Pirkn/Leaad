import apiService from './api';

class BillingService {
  constructor() {
    this.api = apiService;
  }

  /**
   * Create a Paddle checkout session for subscription
   * @param {Object} options - Checkout options
   * @param {string} options.return_url - URL to return to after checkout
   * @param {string} options.success_url - URL to redirect on successful payment
   * @param {string} options.cancel_url - URL to redirect on cancellation
   * @returns {Promise<Object>} Checkout session data
   */
  async createCheckout(options = {}) {
    try {
      console.log('=== Billing Service Debug ===');
      console.log('Creating checkout with options:', options);
      
      const requestBody = {
        return_url: options.return_url || window.location.origin + '/dashboard',
        success_url: options.success_url || window.location.origin + '/dashboard?subscription=active',
        cancel_url: options.cancel_url || window.location.origin + '/pricing?canceled=true'
      };
      
      console.log('Request body:', requestBody);
      console.log('API base URL:', this.api.baseURL);
      
      const response = await this.api.request('/billing/create-checkout', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      console.log('Checkout response:', response);
      return response;
    } catch (error) {
      console.error('=== Billing Service Error ===');
      console.error('Error creating checkout:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Try to get more details from the error
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  /**
   * Get current subscription status for the authenticated user
   * @returns {Promise<Object>} Subscription status data
   */
  async getSubscriptionStatus() {
    try {
      const response = await this.api.request('/billing/subscription-status', {
        method: 'GET'
      });

      return response;
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      // Return default status if API fails
      return {
        subscription_status: 'free',
        activated_at: null,
        canceled_at: null
      };
    }
  }

  /**
   * Redirect user to Paddle checkout
   * @param {Object} options - Checkout options
   */
  async redirectToCheckout(options = {}) {
    try {
      const checkoutData = await this.createCheckout(options);
      
      if (checkoutData.checkout_url) {
        // Store transaction ID in session storage for reference
        sessionStorage.setItem('paddle_transaction_id', checkoutData.transaction_id);
        
        // Redirect to Paddle checkout
        window.location.href = checkoutData.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Failed to redirect to checkout:', error);
      throw error;
    }
  }

  /**
   * Check if user has active subscription
   * @returns {Promise<boolean>} True if user has active subscription
   */
  async hasActiveSubscription() {
    try {
      const status = await this.getSubscriptionStatus();
      return status.subscription_status === 'pro';
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  /**
   * Get subscription details for display
   * @returns {Promise<Object>} Subscription details
   */
  async getSubscriptionDetails() {
    try {
      const status = await this.getSubscriptionStatus();
      
      return {
        isActive: status.subscription_status === 'pro',
        isCanceled: status.subscription_status === 'canceled',
        isPaused: status.subscription_status === 'paused',
        isFree: status.subscription_status === 'free',
        activatedAt: status.activated_at,
        canceledAt: status.canceled_at,
        status: status.subscription_status
      };
    } catch (error) {
      console.error('Failed to get subscription details:', error);
      return {
        isActive: false,
        isCanceled: false,
        isPaused: false,
        isFree: true,
        activatedAt: null,
        canceledAt: null,
        status: 'free'
      };
    }
  }

  /**
   * Handle checkout success (called after successful payment)
   * @param {string} transactionId - Paddle transaction ID
   */
  async handleCheckoutSuccess(transactionId) {
    try {
      // Clear stored transaction ID
      sessionStorage.removeItem('paddle_transaction_id');
      
      // You could make an API call here to verify the transaction
      // For now, we'll just log it
      console.log('Checkout successful for transaction:', transactionId);
      
      return true;
    } catch (error) {
      console.error('Failed to handle checkout success:', error);
      throw error;
    }
  }

  /**
   * Handle checkout cancellation
   */
  async handleCheckoutCancel() {
    try {
      // Clear stored transaction ID
      sessionStorage.removeItem('paddle_transaction_id');
      
      console.log('Checkout was cancelled');
      return true;
    } catch (error) {
      console.error('Failed to handle checkout cancellation:', error);
      throw error;
    }
  }
}

export const billingService = new BillingService();

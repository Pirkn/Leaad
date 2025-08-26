import React, { createContext, useContext, useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { useAuth } from './AuthContext';

const BillingContext = createContext();

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    isActive: false,
    isCanceled: false,
    isPaused: false,
    isFree: true,
    activatedAt: null,
    canceledAt: null,
    status: 'free'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load subscription details when user changes
  useEffect(() => {
    if (user && !authLoading) {
      loadSubscriptionDetails();
    } else if (!user) {
      // Reset to default state when user logs out
      setSubscriptionDetails({
        isActive: false,
        isCanceled: false,
        isPaused: false,
        isFree: true,
        activatedAt: null,
        canceledAt: null,
        status: 'free'
      });
    }
  }, [user, authLoading]);

  const loadSubscriptionDetails = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const details = await billingService.getSubscriptionDetails();
      setSubscriptionDetails(details);
    } catch (err) {
      console.error('Failed to load subscription details:', err);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const startCheckout = async (options = {}) => {
    if (!user) {
      throw new Error('You must be logged in to start checkout');
    }

    setLoading(true);
    setError(null);

    try {
      await billingService.redirectToCheckout(options);
    } catch (err) {
      console.error('Failed to start checkout:', err);
      setError(err.message || 'Failed to start checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await loadSubscriptionDetails();
  };

  const hasActiveSubscription = () => {
    return subscriptionDetails.isActive;
  };

  const hasProAccess = () => {
    return subscriptionDetails.isActive;
  };

  const getSubscriptionStatus = () => {
    return subscriptionDetails.status;
  };

  const getSubscriptionDetails = () => {
    return subscriptionDetails;
  };

  const handleCheckoutSuccess = async (transactionId) => {
    try {
      await billingService.handleCheckoutSuccess(transactionId);
      // Refresh subscription details after successful checkout
      await loadSubscriptionDetails();
    } catch (err) {
      console.error('Failed to handle checkout success:', err);
      setError('Failed to process successful checkout');
    }
  };

  const handleCheckoutCancel = async () => {
    try {
      await billingService.handleCheckoutCancel();
    } catch (err) {
      console.error('Failed to handle checkout cancellation:', err);
    }
  };

  const value = {
    // State
    subscriptionDetails,
    loading,
    error,
    
    // Actions
    startCheckout,
    refreshSubscription,
    handleCheckoutSuccess,
    handleCheckoutCancel,
    
    // Computed values
    hasActiveSubscription,
    hasProAccess,
    getSubscriptionStatus,
    getSubscriptionDetails,
    
    // Utility functions
    loadSubscriptionDetails
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};

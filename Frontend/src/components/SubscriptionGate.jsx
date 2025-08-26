import React from 'react';
import { useBilling } from '../contexts/BillingContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Lock, Star } from 'lucide-react';

const SubscriptionGate = ({ 
  children, 
  feature = "this feature",
  showUpgradePrompt = true,
  fallback = null 
}) => {
  const { subscriptionDetails, loading, startCheckout } = useBilling();

  const handleUpgrade = async () => {
    try {
      await startCheckout({
        return_url: window.location.origin + '/dashboard',
        success_url: window.location.origin + '/dashboard?subscription=active',
        cancel_url: window.location.origin + '/pricing?canceled=true'
      });
    } catch (error) {
      console.error('Failed to start checkout:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has active subscription, show the content
  if (subscriptionDetails.isActive) {
    return children;
  }

  // If fallback is provided, show it
  if (fallback) {
    return fallback;
  }

  // If upgrade prompt is disabled, don't show anything
  if (!showUpgradePrompt) {
    return null;
  }

  // Show upgrade prompt
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl">Premium Feature</CardTitle>
          <CardDescription>
            {feature} is available exclusively to Premium subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Unlimited lead generation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Advanced AI comments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Viral template library</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Priority support</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            3-day free trial • Cancel anytime • $19/month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionGate;

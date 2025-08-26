import React from 'react';
import { useBilling } from '../contexts/BillingContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ExternalLink
} from 'lucide-react';

const SubscriptionStatus = () => {
  const { 
    subscriptionDetails, 
    loading, 
    error,
    startCheckout,
    refreshSubscription
  } = useBilling();

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = () => {
    if (subscriptionDetails.isActive) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (subscriptionDetails.isCanceled) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    } else if (subscriptionDetails.isPaused) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Crown className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    if (subscriptionDetails.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (subscriptionDetails.isCanceled) {
      return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
    } else if (subscriptionDetails.isPaused) {
      return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Free</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading subscription details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Current Plan</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Plan Type:</span>
            <span className="font-medium">
              {subscriptionDetails.isActive ? 'Premium' : 'Free'}
            </span>
          </div>

          {subscriptionDetails.isActive && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Activated:</span>
                <span className="font-medium">
                  {formatDate(subscriptionDetails.activatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium">$19/month</span>
              </div>
            </>
          )}

          {subscriptionDetails.isCanceled && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Canceled:</span>
              <span className="font-medium">
                {formatDate(subscriptionDetails.canceledAt)}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          {subscriptionDetails.isActive ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                You have access to all premium features including unlimited lead generation, 
                AI comments, and advanced analytics.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://vendors.paddle.com/', '_blank')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshSubscription}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Upgrade to Premium to unlock unlimited lead generation, AI comments, 
                and advanced features.
              </p>
              <Button 
                onClick={handleUpgrade}
                className="w-full"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;

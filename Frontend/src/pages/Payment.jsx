import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get('_ptxn');
    
    if (!transactionId) {
      setError('No transaction ID found');
      setLoading(false);
      return;
    }

    const initializePaddle = async () => {
      console.log('[Payment] Initializing Paddle for transaction:', transactionId);
      const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      if (!clientToken) {
        console.warn('[Payment] Missing VITE_PADDLE_CLIENT_TOKEN');
      }

      const tryOpen = () => {
        if (!window.Paddle || !window.Paddle.Checkout || typeof window.Paddle.Checkout.open !== 'function') {
          throw new Error('Paddle.Checkout.open is not available');
        }
        window.Paddle.Checkout.open({
          transactionId,
          settings: { displayMode: 'overlay', theme: 'light', locale: 'en' }
        });
        setLoading(false);
      };

      try {
        // Already loaded
        if (window.Paddle && (window.Paddle.Initialize || window.Paddle.Setup)) {
          try {
            if (window.Paddle.Environment && typeof window.Paddle.Environment.set === 'function') {
              window.Paddle.Environment.set('sandbox');
            }
            if (typeof window.Paddle.Initialize === 'function') {
              window.Paddle.Initialize({ token: clientToken, checkout: { settings: { displayMode: 'overlay', theme: 'light', locale: 'en' } } });
            } else if (typeof window.Paddle.Setup === 'function') {
              window.Paddle.Setup({ environment: 'sandbox' });
            }
          } catch {}
          tryOpen();
          return;
        }

        // Load script
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;
        script.setAttribute('data-paddle', 'true');
        script.onload = () => {
          try {
            if (window.Paddle.Environment && typeof window.Paddle.Environment.set === 'function') {
              window.Paddle.Environment.set('sandbox');
            }
            if (typeof window.Paddle.Initialize === 'function') {
              window.Paddle.Initialize({ token: clientToken, checkout: { settings: { displayMode: 'overlay', theme: 'light', locale: 'en' } } });
            } else if (typeof window.Paddle.Setup === 'function') {
              window.Paddle.Setup({ environment: 'sandbox' });
            }
          } catch (e) {
            console.warn('[Payment] Paddle init error:', e);
          }
          try {
            tryOpen();
          } catch (e) {
            console.warn('[Payment] v2 open failed, trying v1 signature:', e);
            try {
              window.Paddle.Checkout.open({ transaction: transactionId, settings: { displayMode: 'overlay', theme: 'light', locale: 'en' } });
              setLoading(false);
            } catch (err) {
              setError('Failed to open checkout');
              setLoading(false);
            }
          }
        };
        script.onerror = () => {
          setError('Failed to load Paddle.js');
          setLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('[Payment] Unexpected error:', err);
        setError('Failed to initialize payment');
        setLoading(false);
      }
    };

    initializePaddle();
  }, [searchParams]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Payment
          </h2>
          <p className="text-gray-600">
            Preparing your checkout session...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Processing
        </h2>
        <p className="text-gray-600">
          If the payment window didn't open automatically, please check your popup blocker.
        </p>
      </div>
    </div>
  );
};

export default Payment;

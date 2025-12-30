// React Hook for Paystack Payment Integration
// This hook provides a clean interface for handling Paystack payments

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  initializePaystackPayment,
  verifyPayment,
  dollarsToKobo,
  type PaymentVerificationResponse,
} from '../lib/paystack';

interface UsePaystackPaymentOptions {
  email: string;
  amount: number; // Amount in dollars
  currency?: string;
  metadata?: Record<string, any>;
  onSuccess?: (payment: PaymentVerificationResponse['payment']) => void;
  onError?: (error: string) => void;
}

interface UsePaystackPaymentReturn {
  isProcessing: boolean;
  error: string | null;
  initiatePayment: () => Promise<void>;
  clearError: () => void;
}

// Payment status tracking
type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'failed';

export function usePaystackPayment(options: UsePaystackPaymentOptions): UsePaystackPaymentReturn {
  const { user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const { email, amount, currency = 'NGN', metadata, onSuccess, onError } = options;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handlePaymentSuccess = useCallback(async (reference: string) => {
    setStatus('verifying');
    setError(null);

    try {
      // Convert amount to kobo for verification
      const expectedAmount = dollarsToKobo(amount);

      // Verify payment with backend
      const verificationResponse = await verifyPayment(reference, expectedAmount, currency);

      if (verificationResponse.success && verificationResponse.payment) {
        setStatus('success');
        toast.success('Payment successful! 🎉');
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(verificationResponse.payment);
        }
      } else {
        const errorMessage = verificationResponse.error || 'Payment verification failed';
        setStatus('failed');
        setError(errorMessage);
        toast.error(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      setStatus('failed');
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [amount, currency, onSuccess, onError]);

  const handlePaymentError = useCallback((errorMessage: string) => {
    setStatus('failed');
    setError(errorMessage);
    toast.error(errorMessage);
    
    if (onError) {
      onError(errorMessage);
    }
  }, [onError]);

  const handlePaymentClose = useCallback(() => {
    setStatus('idle');
    // Don't show error for user closing payment modal
  }, []);

  const initiatePayment = useCallback(async () => {
    // Check authentication
    if (!user) {
      const errorMessage = 'You must be logged in to make a payment';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Check if user email matches
    if (user.email !== email) {
      const errorMessage = 'Payment email must match your account email';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Reset state
    setStatus('processing');
    setError(null);

    try {
      console.log('[usePaystackPayment] Initializing payment for amount:', amount, 'dollars');

      // Prepare metadata
      const paymentMetadata = {
        user_id: user.id,
        user_email: user.email,
        ...metadata,
      };

      // Convert amount to kobo (Nigerian kobo)
      const amountInKobo = dollarsToKobo(amount);
      console.log('[usePaystackPayment] Amount in kobo:', amountInKobo);

      // Initialize Paystack payment
      // Note: We don't generate a custom reference
      // Paystack will generate its own reference and return it in the callback
      initializePaystackPayment(
        {
          email,
          amount: amountInKobo,
          currency,
          metadata: paymentMetadata,
          // No reference - let Paystack generate it
        },
        handlePaymentSuccess,
        handlePaymentError,
        handlePaymentClose
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
      setStatus('failed');
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [user, email, amount, currency, metadata, handlePaymentSuccess, handlePaymentError, handlePaymentClose]);

  return {
    isProcessing: status === 'processing' || status === 'verifying',
    error,
    initiatePayment,
    clearError,
  };
}
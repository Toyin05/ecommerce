// Paystack Payment Component
// This component provides a secure payment interface using Paystack

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePaystackPayment } from '../hooks/usePaystackPayment';
import { formatCurrency } from '../lib/paystack';
import { useNavigate } from 'react-router-dom';

interface PaystackPaymentProps {
  amount: number; // Amount in dollars
  currency?: string;
  onPaymentSuccess?: (payment: any) => void;
  className?: string;
}
export function PaystackPayment({
  amount,
  currency = 'NGN',
  onPaymentSuccess,
  className,
}: PaystackPaymentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    isProcessing,
    error,
    initiatePayment,
    clearError,
  } = usePaystackPayment({
    email: user?.email || '',
    amount,
    currency,
    metadata: {
      order_type: 'checkout',
      page_url: window.location.href,
    },
    onSuccess: (payment) => {
      // Payment verified successfully
      if (onPaymentSuccess) {
        onPaymentSuccess(payment);
      } else {
        // Default behavior: redirect to home page
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('Payment error:', error);
    },
  });

  const handlePaymentClick = () => {
    clearError();
    initiatePayment();
  };

  const isDisabled = isProcessing || !user || !user.email;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Your payment is processed securely by Paystack
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Payment Amount */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-muted rounded-lg">
          <span className="text-sm sm:text-lg font-medium">Total Amount</span>
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {formatCurrency(amount * 100, currency)}
          </span>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-green-800 leading-tight">
            Secured by Paystack - Your card details are protected
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePaymentClick}
          disabled={isDisabled}
          className="w-full h-11 sm:h-12 text-sm sm:text-lg font-medium"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Pay {formatCurrency(amount * 100, currency)}
            </>
          )}
        </Button>

        {/* User Info */}
        {!user && (
          <div className="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-yellow-800">
              You must be logged in to make a payment
            </p>
          </div>
        )}

        {user && !user.email && (
          <div className="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-yellow-800">
              Please complete your profile to continue with payment
            </p>
          </div>
        )}

        {/* Features List */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span>SSL Encrypted Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span>Supports Visa, Mastercard, Verve</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span>Bank Transfer & USSD</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span>Instant Payment Confirmation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
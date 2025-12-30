// Paystack Integration Utility
// This file contains utility functions for working with Paystack payments
// CRITICAL: Never include the secret key in frontend code

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
        openModal: () => void;
      };
    };
  }
}

// Paystack configuration interface
export interface PaystackConfig {
  key: string; // Public key only
  email: string;
  amount: number; // Amount in kobo (Nigerian kobo)
  currency?: string; // Default: 'NGN'
  reference?: string;
  metadata?: Record<string, any>;
  callback?: (response: PaystackCallback) => void;
  onClose?: () => void;
}

// Paystack callback response interface
export interface PaystackCallback {
  status: 'success' | 'failed';
  message: string;
  reference: string;
  trans: string; // Transaction ID
  transaction: string; // Transaction ID
  trxref?: string; // Transaction reference
}

// Payment verification response interface
export interface PaymentVerificationResponse {
  success: boolean;
  error?: string;
  payment?: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
  };
}

// Generate a unique reference for payment
// DEPRECATED: Paystack now generates its own references
// This function is kept for backwards compatibility but should not be used
export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `GIFTED_${timestamp}_${random}`;
}

// Convert dollars to kobo (Nigerian kobo, not US cents)
// Nigerian currency: 1 Naira = 100 kobo
export function dollarsToKobo(dollars: number): number {
  return Math.round(dollars * 100);
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });
  
  if (currency === 'NGN') {
    // For Naira, divide by 100 since amount is in kobo
    return formatter.format(amount / 100);
  }
  
  return formatter.format(amount);
}

// Load Paystack script dynamically
export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      resolve();
      return;
    }

    // Check if script is being loaded
    const existingScript = document.querySelector('script[src*="paystack"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Paystack script')));
      return;
    }

    // Create and load new script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
}

// Initialize Paystack payment popup
export function initializePaystackPayment(
  config: Omit<PaystackConfig, 'key' | 'reference'>,
  onSuccess: (reference: string) => void,
  onError: (error: string) => void,
  onClose: () => void
): void {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!publicKey) {
    onError('Paystack public key is not configured. Please check your environment variables.');
    return;
  }

  if (!publicKey.startsWith('pk_')) {
    onError('Invalid Paystack public key format. Key should start with "pk_".');
    return;
  }

  // Load Paystack script if not already loaded
  loadPaystackScript()
    .then(() => {
      if (!window.PaystackPop) {
        onError('Paystack popup failed to initialize');
        return;
      }

      // Set up callback functions
      // Note: We don't pass a custom reference to Paystack
      // Paystack will generate its own reference and return it in the callback
      const paystackConfig: PaystackConfig = {
        ...config,
        key: publicKey,
        // Remove any custom reference to let Paystack generate its own
        callback: (response: PaystackCallback) => {
          console.log('[Paystack] Payment callback received:', response);
          if (response.status === 'success') {
            console.log('[Paystack] Payment successful, reference:', response.reference);
            onSuccess(response.reference);
          } else {
            console.log('[Paystack] Payment failed:', response.message);
            onError(response.message || 'Payment failed');
          }
        },
        onClose: () => {
          console.log('[Paystack] Payment popup closed');
          onClose();
        },
      };

      // Initialize Paystack popup
      const paystackPopup = window.PaystackPop.setup(paystackConfig);
      paystackPopup.openIframe();
    })
    .catch((error) => {
      onError(error.message || 'Failed to load Paystack');
    });
}

// Verify payment with backend
export async function verifyPayment(
  reference: string,
  expectedAmount?: number,
  currency: string = 'NGN'
): Promise<PaymentVerificationResponse> {
  try {
    const { supabase } = await import('../lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          reference,
          expectedAmount,
          currency,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP error! status: ${response.status}`
      };
    }

    const data: PaymentVerificationResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed'
    };
  }
}
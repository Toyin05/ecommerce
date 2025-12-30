// Supabase Edge Function: verify-payment
// This function securely verifies Paystack payments server-side
// CRITICAL: Never expose this function without proper authentication

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

// Paystack verification response interface
interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    fees: number;
    channel: string;
    ip_address: string;
    metadata: any;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: number;
      exp_year: number;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
    };
  };
}

// Request interface
interface VerifyPaymentRequest {
  reference: string;
  expectedAmount?: number; // in kobo
  currency?: string;
}

// Response interface
interface VerifyPaymentResponse {
  success: boolean;
  error?: string;
  payment?: {
    id: string;
    reference: string;
    amount: number; // amount_kobo field from database
    amount_naira: number; // human-readable naira amount
    currency: string;
    status: string;
    paid_at: string;
  };
}

// Helper function to create consistent error responses
function createErrorResponse(message: string, status: number = 400): Response {
  console.error(`[verify-payment] Error: ${message}`);
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message 
    }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Helper function to create success responses
function createSuccessResponse(data: VerifyPaymentResponse): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey || !paystackSecretKey) {
      console.error('[verify-payment] Missing required environment variables');
      return createErrorResponse('Server configuration error', 500);
    }
    
    // Additional Paystack key validation
    if (!paystackSecretKey.startsWith('sk_')) {
      console.error('[verify-payment] Invalid Paystack key format');
      return createErrorResponse('Invalid Paystack configuration', 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Only allow POST requests
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405);
    }

    // Parse request body
    let requestData: VerifyPaymentRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('[verify-payment] Invalid JSON in request body:', error);
      return createErrorResponse('Invalid request format');
    }

    const { reference, expectedAmount, currency = 'NGN' } = requestData;

    // Validate request data
    if (!reference || typeof reference !== 'string' || reference.trim() === '') {
      return createErrorResponse('Payment reference is required');
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Authorization required', 401);
    }

    const token = authHeader.split(' ')[1];
    let user;
    try {
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !authUser) {
        console.error('[verify-payment] User authentication failed');
        return createErrorResponse('Invalid or expired token', 401);
      }
      user = authUser;
    } catch (error) {
      console.error('[verify-payment] Auth verification error');
      return createErrorResponse('Authentication service error', 500);
    }

    // Check if payment reference has already been verified
    let existingPayment;
    try {
      const { data: payment, error: checkError } = await supabase
        .from('payments')
        .select('id, status, amount_kobo, amount_naira, currency')
        .eq('reference', reference)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('[verify-payment] Database error checking existing payment');
        return createErrorResponse('Database error', 500);
      }

      existingPayment = payment;
    } catch (error) {
      console.error('[verify-payment] Database connection error');
      return createErrorResponse('Database service error', 500);
    }

    if (existingPayment) {
      // Payment reference already exists, return the existing record
      const response: VerifyPaymentResponse = {
        success: existingPayment.status === 'success',
        payment: {
          id: existingPayment.id,
          reference,
          amount: existingPayment.amount_kobo,
          amount_naira: existingPayment.amount_naira || existingPayment.amount_kobo / 100,
          currency: existingPayment.currency,
          status: existingPayment.status,
          paid_at: new Date().toISOString(),
        }
      };
      return createSuccessResponse(response);
    }

    // Verify payment with Paystack
    const paystackUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    
    let paystackResponse;
    try {
      paystackResponse = await fetch(paystackUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('[verify-payment] Network error calling Paystack');
      return createErrorResponse('Payment verification service unavailable', 503);
    }

    if (!paystackResponse.ok) {
      const errorText = await paystackResponse.text().catch(() => 'Unknown error');
      console.error(`[verify-payment] Paystack API error (${paystackResponse.status}): ${errorText}`);
      
      // Don't return 502 - that's a bad gateway error which suggests our server is misconfigured
      // Instead, return a proper error indicating the payment verification failed
      return createErrorResponse('Payment verification failed - please check your payment status', 400);
    }

    let paystackData: PaystackVerificationResponse;
    try {
      paystackData = await paystackResponse.json();
    } catch (error) {
      console.error('[verify-payment] Invalid JSON from Paystack:', error);
      return createErrorResponse('Invalid response from payment service', 502);
    }

    if (!paystackData.status) {
      console.error('[verify-payment] Paystack verification failed:', paystackData.message);
      return createErrorResponse(paystackData.message || 'Payment verification failed', 400);
    }

    const paymentData = paystackData.data;

    // Validate payment details
    if (paymentData.status !== 'success') {
      return createErrorResponse(`Payment ${paymentData.status}`, 400);
    }

    if (paymentData.currency !== currency) {
      return createErrorResponse(`Invalid currency: expected ${currency}, got ${paymentData.currency}`, 400);
    }

    if (expectedAmount && paymentData.amount !== expectedAmount) {
      return createErrorResponse(`Amount mismatch: expected ${expectedAmount}, got ${paymentData.amount}`, 400);
    }

    // Save payment record to database
    let paymentRecord;
    try {
      const { data, error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          reference: paymentData.reference,
          amount_kobo: paymentData.amount,
          amount_naira: paymentData.amount / 100, // Convert kobo to naira
          currency: paymentData.currency,
          status: 'success',
          provider: 'paystack',
          paid_at: paymentData.paid_at,
        })
        .select()
        .single();

      if (insertError) {
        console.error('[verify-payment] Error inserting payment record:', insertError);
        
        // Handle duplicate reference gracefully
        if (insertError.code === '23505') { // Unique constraint violation
          console.log('[verify-payment] Duplicate reference, fetching existing record');
          const { data: existing, error: fetchError } = await supabase
            .from('payments')
            .select('*')
            .eq('reference', paymentData.reference)
            .single();
            
          if (!fetchError && existing) {
            const response: VerifyPaymentResponse = {
              success: existing.status === 'success',
              payment: {
                id: existing.id,
                reference: existing.reference,
                amount: existing.amount_kobo,
                amount_naira: existing.amount_naira || existing.amount_kobo / 100,
                currency: existing.currency,
                status: existing.status,
                paid_at: existing.paid_at,
              }
            };
            return createSuccessResponse(response);
          }
        }
        
        return createErrorResponse('Failed to save payment record', 500);
      }
      
      paymentRecord = data;
    } catch (error) {
      console.error('[verify-payment] Database insert error:', error);
      return createErrorResponse('Database service error', 500);
    }

    // Return successful verification
    const response: VerifyPaymentResponse = {
      success: true,
      payment: {
        id: paymentRecord.id,
        reference: paymentRecord.reference,
        amount: paymentRecord.amount_kobo,
        amount_naira: paymentRecord.amount_naira || paymentRecord.amount_kobo / 100,
        currency: paymentRecord.currency,
        status: paymentRecord.status,
        paid_at: paymentRecord.paid_at,
      }
    };

    return createSuccessResponse(response);

  } catch (error) {
    console.error('[verify-payment] Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});



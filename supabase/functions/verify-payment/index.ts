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
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey || !paystackSecretKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const requestData: VerifyPaymentRequest = await req.json();
    const { reference, expectedAmount, currency = 'NGN' } = requestData;

    // Validate request data
    if (!reference || typeof reference !== 'string' || reference.trim() === '') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment reference is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authorization required' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired token' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if payment reference has already been verified
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('reference', reference)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found", which is expected for new references
      console.error('Error checking existing payment:', checkError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (existingPayment) {
      // Payment reference already exists, return the existing record
      return new Response(
        JSON.stringify({ 
          success: existingPayment.status === 'success',
          payment: {
            id: existingPayment.id,
            reference,
            status: existingPayment.status
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify payment with Paystack
    const paystackUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    
    const paystackResponse = await fetch(paystackUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!paystackResponse.ok) {
      console.error('Paystack API error:', paystackResponse.status, paystackResponse.statusText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment verification failed' 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paystackData: PaystackVerificationResponse = await paystackResponse.json();

    if (!paystackData.status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: paystackData.message || 'Payment verification failed' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paymentData = paystackData.data;

    // Validate payment details
    if (paymentData.status !== 'success') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payment ${paymentData.status}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (paymentData.currency !== currency) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid currency: expected ${currency}, got ${paymentData.currency}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (expectedAmount && paymentData.amount !== expectedAmount) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Amount mismatch: expected ${expectedAmount}, got ${paymentData.amount}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save payment record to database
    const { data: paymentRecord, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        reference: paymentData.reference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'success',
        provider: 'paystack',
        paid_at: paymentData.paid_at,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting payment record:', insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save payment record' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return successful verification
    const response: VerifyPaymentResponse = {
      success: true,
      payment: {
        id: paymentRecord.id,
        reference: paymentRecord.reference,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        status: paymentRecord.status,
        paid_at: paymentRecord.paid_at,
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in verify-payment function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
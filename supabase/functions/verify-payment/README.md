# Supabase Edge Function Configuration
# This file tells Supabase how to deploy and configure the edge function

# Function name: verify-payment
# Description: Securely verifies Paystack payments server-side
# Runtime: Deno
# Memory: 256MB (default)
# Timeout: 30 seconds

# Required Environment Variables:
# - SUPABASE_URL: Automatically provided by Supabase
# - SUPABASE_SERVICE_ROLE_KEY: Automatically provided by Supabase  
# - PAYSTACK_SECRET_KEY: Must be set in Supabase project settings

# Function Purpose:
# 1. Receives payment reference from frontend
# 2. Verifies payment with Paystack using secret key
# 3. Stores verified payment in database
# 4. Returns safe response to frontend

# Security Features:
# - CORS protection
# - Authentication required (Bearer token)
# - Payment reference deduplication
# - Amount and currency validation
# - Server-side verification only (never trust frontend)

# Usage:
# POST /functions/v1/verify-payment
# Headers: Authorization: Bearer <user_token>
# Body: { "reference": "payment_reference", "expectedAmount": 10000 }
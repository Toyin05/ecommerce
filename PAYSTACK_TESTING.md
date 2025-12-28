# Paystack Payment Testing Guide

This guide provides step-by-step instructions for testing the Paystack payment integration.

## Pre-Testing Checklist

### 1. Environment Setup
- [ ] `.env` file contains `VITE_PAYSTACK_PUBLIC_KEY` (test key starting with `pk_test_`)
- [ ] `.env` file contains `PAYSTACK_SECRET_KEY` (test key starting with `sk_test_`)
- [ ] Supabase Edge Function environment variable `PAYSTACK_SECRET_KEY` is set

### 2. Database Setup
- [ ] `supabase/schema.sql` has been run in Supabase SQL Editor
- [ ] `payments` table exists in your Supabase database
- [ ] RLS policies are enabled on the payments table

### 3. Edge Function Deployment
- [ ] Edge Function `verify-payment` is deployed
- [ ] Function is accessible at `/functions/v1/verify-payment`

## Test Flow 1: Successful Payment

### Step 1: Setup Test User
1. Go to `/auth/signup`
2. Create a test account with email: `test@example.com`
3. Note the password for later use

### Step 2: Add Items to Cart
1. Go to Home page
2. Click on any product
3. Add item to cart
4. Go to Cart page and verify item is there

### Step 3: Complete Checkout Form
1. Go to Checkout page
2. Fill in delivery information:
   - Name: `Test User`
   - Email: `test@example.com` (must match your account)
   - Phone: `+2348012345678`
   - Address: `123 Test Street`
   - City: `Lagos`
   - State: `Lagos`
   - ZIP: `10001`
3. Click "Continue to Gift Options"
4. Click "Continue to Payment"

### Step 4: Make Payment
1. Verify you see the Paystack Payment component
2. Click "Pay" button
3. In Paystack popup, use test card: `4084084084084081`
4. Fill in expiry date: `12/25`
5. Fill in CVV: `123`
6. Click "Pay"
7. Wait for payment confirmation

### Step 5: Verify Success
- [ ] Payment popup closes
- [ ] Success toast appears: "Payment successful! 🎉"
- [ ] User is redirected to home page
- [ ] Cart is cleared

### Step 6: Check Database
1. Go to Supabase Dashboard > Table Editor
2. Select `payments` table
3. Verify new record exists with:
   - `status`: `success`
   - `reference`: matches the Paystack reference
   - `user_id`: matches your test user

## Test Flow 2: Failed Payment

### Step 1: Setup Test User (same as above)
- Use same test account from Flow 1

### Step 2: Add Items and Checkout (same as above)
- Add same items and fill checkout form

### Step 3: Attempt Failed Payment
1. Click "Pay" button
2. In Paystack popup, use test card: `4084084084084117` (declined card)
3. Fill in expiry date: `12/25`
4. Fill in CVV: `123`
5. Click "Pay"
6. Wait for payment failure

### Step 4: Verify Failure Handling
- [ ] Payment popup closes
- [ ] Error toast appears with appropriate message
- [ ] User stays on checkout page
- [ ] No payment record is created in database

## Test Flow 3: Authentication Errors

### Step 1: Test Without Login
1. Log out of your account
2. Go to Checkout page
3. Try to access payment section

### Step 2: Verify Auth Requirements
- [ ] Payment component shows "You must be logged in" message
- [ ] Login/Signup buttons are displayed
- [ ] Payment cannot proceed without authentication

## Test Flow 4: Edge Function Testing

### Step 1: Test Edge Function Directly
1. Open browser Developer Tools > Network tab
2. Make a payment (use Test Flow 1)
3. Find the call to `/functions/v1/verify-payment`
4. Check the request and response

### Step 2: Verify Request Structure
```json\nPOST /functions/v1/verify-payment\n{\n  \"reference\": \"GIFTED_1234567890_123\",\n  \"expectedAmount\": 25000,\n  \"currency\": \"NGN\"\n}\n```

### Step 3: Verify Success Response
```json\n{\n  \"success\": true,\n  \"payment\": {\n    \"id\": \"uuid-here\",\n    \"reference\": \"GIFTED_1234567890_123\",\n    \"amount\": 25000,\n    \"currency\": \"NGN\",\n    \"status\": \"success\",\n    \"paid_at\": \"2024-01-01T12:00:00Z\"\n  }\n}\n```

## Test Flow 5: Error Scenarios

### Test Invalid Reference
1. Open Developer Tools > Console
2. Call the verification endpoint with invalid reference
3. Verify proper error handling

### Test Missing Authentication
1. Make request without Authorization header
2. Verify 401 error is returned

### Test Amount Mismatch
1. Attempt payment with different expected amount
2. Verify amount validation works

## Common Issues and Solutions

### \"Paystack public key is not configured\"
- Check `.env` file has `VITE_PAYSTACK_PUBLIC_KEY`
- Restart development server after adding environment variables

### \"Payment verification failed\"
- Check Supabase Edge Function logs
- Verify `PAYSTACK_SECRET_KEY` is set in Edge Function environment
- Ensure user is authenticated

### \"User not authenticated\"
- User must be logged in to make payments
- Check authentication state in browser

### Payment popup doesn't open
- Check browser console for JavaScript errors
- Verify Paystack script is loading correctly
- Ensure you're not blocking popups

## Performance Testing

### Load Testing
1. Make multiple rapid payments
2. Monitor Edge Function response times
3. Check for any rate limiting issues

### Database Performance
1. Check `payments` table indexes are working
2. Monitor query performance in Supabase dashboard

## Security Testing

### Verify RLS Policies
1. Try to access another user's payment records
2. Verify access is denied
3. Check that users can only see their own payments

### Test Payment Deduplication
1. Attempt to verify the same reference twice
2. Verify second attempt returns existing record

## Mobile Testing

### Test on Mobile Device
1. Test payment flow on mobile browser
2. Verify UI is responsive
3. Test on both iOS and Android

### PWA Testing
1. Install app as PWA
2. Test payment flow in PWA mode
3. Verify offline handling (if implemented)

## Production Readiness

### Before Going Live
- [ ] Switch to live Paystack keys
- [ ] Test with real payment amounts
- [ ] Verify SSL certificate is installed
- [ ] Set up monitoring and alerting
- [ ] Test payment webhooks (if using)
- [ ] Verify tax calculations are correct
- [ ] Test refund process
- [ ] Verify compliance requirements

### Go-Live Checklist
- [ ] Change `VITE_PAYSTACK_PUBLIC_KEY` to live key
- [ ] Change `PAYSTACK_SECRET_KEY` to live key
- [ ] Remove test mode indicators from UI
- [ ] Set up production monitoring
- [ ] Test complete flow with small real payment
- [ ] Train support team on payment issues

## Monitoring and Alerting

### Key Metrics to Monitor
- Payment success rate
- Payment failure rate
- Average payment processing time
- Edge Function error rate
- Database connection issues

### Alert Conditions
- Payment success rate drops below 95%
- Edge Function error rate exceeds 5%
- Average response time exceeds 10 seconds
- Unusual payment patterns (fraud detection)

This testing guide ensures your Paystack integration is robust, secure, and ready for production use.
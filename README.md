# Gifted & Co. - E-commerce Platform for Gifts

A modern e-commerce platform built with React 18, TypeScript, and Tailwind CSS. Users can browse gifts, add to cart, and complete purchases with authentication.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## Authentication Implementation (Phase 1)

### What Was Implemented

This phase adds user authentication to Gifted & Co. using Supabase Auth.

#### Features
- **Email/Password Authentication**: Users can sign up and sign in with email and password
- **Session Persistence**: Users stay logged in across browser sessions
- **Protected Routes**: Cart, Checkout, and Bulk Orders pages require authentication
- **Smart Redirects**: Users are redirected back to their intended destination after login
- **User Menu**: Header shows user avatar with sign-out option when logged in
- **Responsive Design**: Auth pages work seamlessly on mobile and desktop

#### Pages Created
- `/auth/login` - User login page
- `/auth/signup` - User registration page with password validation

#### Route Protection
The following routes are protected (require authentication):
- `/cart`
- `/checkout`
- `/bulk-orders`

When unauthenticated users access these routes, they're redirected to `/auth/login` with the original destination preserved. After successful login, they're automatically redirected back.

#### Design
- **Split-screen layout**: Branding on left, auth form on right (desktop)
- **Glassmorphism**: Semi-transparent card with backdrop blur
- **Gifted & Co. theme**: Uses existing colors, fonts, and styling
- **Mobile-friendly**: Stacks vertically on smaller screens

### Supabase Auth Setup

#### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your Project URL and anon public key

#### 2. Configure Authentication
1. In Supabase Dashboard, go to Authentication > Providers
2. Ensure Email provider is enabled
3. Configure password requirements (minimum 8 characters recommended)

#### 3. Run Database Schema
In Supabase Dashboard, go to SQL Editor and run the contents of `supabase/schema.sql`:

```sql
-- This creates:
-- 1. profiles table (links to auth.users)
-- 2. Auto-trigger to create profiles on signup
-- 3. Row Level Security (RLS) policies
-- 4. Indexes for performance
```

#### 4. Add Environment Variables
Copy `.env.example` to `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Auth Flow

```
1. User browses gifts (no login required)
   ↓
2. User clicks "Sign In" in header or tries to access protected route
   ↓
3. Redirected to /auth/login
   ↓
4. User signs in or creates account
   ↓
5. Redirected back to original destination
   ↓
6. Full access to cart, checkout, bulk orders
```

---

## Paystack Payment System (Phase 3)

A production-ready, secure Paystack payment integration for handling credit/debit card payments in Nigerian Naira (NGN).

### 🔐 Security Features

- **Server-side Verification**: All payment confirmations are verified server-side using Paystack's secret key
- **Never Trust Frontend**: Payment success is never trusted from the frontend alone
- **Row Level Security**: Users can only access their own payment records
- **Encrypted Communication**: All payment data is transmitted securely via HTTPS
- **Reference Deduplication**: Prevents duplicate payment processing
- **Amount Validation**: Server validates payment amounts match expected values

### 📋 Complete Payment Flow

```
1. User initiates payment in checkout
   ↓
2. Frontend generates unique payment reference
   ↓
3. Paystack Inline popup opens with public key
   ↓
4. User enters card details on Paystack's secure page
   ↓
5. Paystack processes payment and returns reference
   ↓
6. Frontend sends reference to secure verification endpoint
   ↓
7. Server verifies transaction with Paystack secret key
   ↓
8. Server stores verified payment in database
   ↓
9. Success/error response sent back to frontend
   ↓
10. UI updates based on verified payment status
```

### 🗄️ Database Schema

The payments table includes:

- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users
- `reference` (TEXT) - Unique Paystack payment reference
- `amount` (INTEGER) - Amount in kobo (Nigerian kobo)
- `currency` (TEXT) - Default 'NGN'
- `status` (ENUM) - 'pending' | 'success' | 'failed'
- `paid_at` (TIMESTAMPTZ) - Payment confirmation time
- `created_at` (TIMESTAMPTZ) - Record creation time

### 🔧 Setup Instructions

#### 1. Configure Paystack Account

1. Sign up/Login to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Go to Settings > API Keys & Webhooks
3. Copy your **Test Public Key** and **Test Secret Key**

#### 2. Set Environment Variables

Update your `.env` file:

```env
# Supabase (existing)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Paystack (new)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
```

#### 3. Deploy Database Schema

Run the updated `supabase/schema.sql` in your Supabase SQL Editor. This creates:
- ✅ Payments table with proper indexes
- ✅ Row Level Security policies
- ✅ Payment triggers and validation

#### 4. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy the verify-payment function
supabase functions deploy verify-payment
```

#### 5. Configure Edge Function Environment

In Supabase Dashboard:
1. Go to Edge Functions > Settings
2. Add environment variable:
   - `PAYSTACK_SECRET_KEY` = your secret key

### 💳 Payment Methods Supported

- **Credit/Debit Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank transfers
- **USSD**: Unstructured Supplementary Service Data
- **Mobile Money**: Various mobile payment options

### 🔄 Test Mode vs Live Mode

#### Test Mode (Current)
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```
- Use test card numbers provided by Paystack
- No real money is processed
- Perfect for development and testing

#### Live Mode (Production)
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
```
- Use real card details
- Actual money is processed
- Requires Paystack account verification

#### Test Card Numbers
```
Success: 4084084084084081
Decline: 4084084084084117
```

### 📁 Key Files Created

#### Frontend
- `src/lib/paystack.ts` - Paystack utility functions
- `src/hooks/usePaystackPayment.ts` - React payment hook
- `src/components/PaystackPayment.tsx` - Payment UI component
- `src/vite-env.d.ts` - Environment variable types

#### Backend
- `supabase/functions/verify-payment/index.ts` - Server-side verification
- Updated `supabase/schema.sql` - Payment table and RLS policies

### 🚨 Common Issues & Solutions

#### "Paystack public key is not configured"
- Ensure `VITE_PAYSTACK_PUBLIC_KEY` is in your `.env` file
- Restart your development server after adding environment variables

#### "Payment verification failed"
- Check that `PAYSTACK_SECRET_KEY` is set in Edge Function environment
- Verify the Edge Function is deployed correctly
- Ensure user is authenticated when making payment

#### "Amount mismatch" error
- This occurs when payment amount doesn't match expected amount
- Check that cart total calculation is correct
- Verify currency conversion (dollars to kobo) is working

#### "User not authenticated" error
- User must be logged in to make payments
- Check that auth token is being passed correctly
- Verify session is not expired

### 🔍 Monitoring & Debugging

#### Check Payment Records
```sql
SELECT * FROM payments WHERE user_id = 'your-user-id' ORDER BY created_at DESC;
```

#### View Edge Function Logs
In Supabase Dashboard: Edge Functions > verify-payment > Logs

#### Test Payment Flow
1. Add items to cart
2. Proceed to checkout
3. Use test card: 4084084084084081
4. Verify payment record appears in database

### 🛡️ Security Considerations

- **Never expose secret keys** in frontend code
- **Always verify payments** server-side
- **Use HTTPS** in production
- **Implement rate limiting** for payment endpoints
- **Monitor payment failures** and implement alerts
- **Log payment events** for audit trails

### 📱 Mobile Responsiveness

The payment interface is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablet devices
- PWA installations

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # Radix UI components
│   ├── Header.tsx       # Navigation with auth state
│   ├── PaystackPayment.tsx  # Payment UI component
│   └── ...
├── context/
│   ├── AuthContext.tsx  # Authentication state management
│   ├── CartContext.tsx  # Shopping cart state
│   └── BulkOrderContext.tsx
├── hooks/
│   └── usePaystackPayment.ts  # Payment processing hook
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── paystack.ts      # Paystack utility functions
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── HomePage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx  # Updated with payment integration
│   └── BulkOrderPage.tsx
├── data/
│   └── products.ts      # Mock product data
supabase/
├── functions/
│   └── verify-payment/
│       ├── index.ts     # Edge function for payment verification
│       └── README.md    # Function documentation
└── schema.sql           # Database schema with payments table
```

---

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Radix UI
- **State Management**: React Context
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

---

## What's NOT Implemented Yet (Future Phases)

### Phase 2: Orders & User Data
- Order history page
- Order status tracking
- User profile management
- Address book

### Phase 3: Payments ✅ IMPLEMENTED
- ✅ Paystack integration
- ✅ Order processing
- ✅ Payment confirmation
- ✅ Receipt generation
- ✅ Server-side payment verification
- ✅ Secure payment flow
- ✅ Error handling and loading states

### Phase 4: Admin Dashboard
- Product management (CRUD)
- Order management
- Bulk order processing
- Analytics dashboard

---

## Troubleshooting

### "Supabase environment variables are not set"
Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` file.

### User not redirecting after login
Ensure you're using the latest code. The redirect uses React Router's `location.state`.

### Profile not created on signup
Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.

---

## Original Project

This project is based on the Figma design available at:
https://www.figma.com/design/OvTjf3gDclOfj3nVXytr7K/E-commerce-Website-for-Gifts

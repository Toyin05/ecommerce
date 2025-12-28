-- Gifted & Co. Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- This table stores additional user profile information
-- It is automatically created when users sign up via Supabase Auth

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGER FUNCTION
-- ============================================
-- Automatically create a profile row when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER
-- ============================================
-- Execute the function after user creation

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Ensure users can only access their own profile

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- INDEXES
-- ============================================
-- Performance optimization

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
-- Auto-update the updated_at column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PAYMENTS TABLE
-- ============================================
-- Stores Paystack payment records for order tracking and verification

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID, -- Nullable for now, can be linked to orders table later
  reference TEXT UNIQUE NOT NULL, -- Paystack payment reference
  amount INTEGER NOT NULL, -- Amount in kobo (Nigerian kobo, not US cents)
  currency TEXT DEFAULT 'NGN' NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  provider TEXT DEFAULT 'paystack' NOT NULL,
  paid_at TIMESTAMPTZ, -- When payment was confirmed successful
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS INDEXES
-- ============================================
-- Performance optimization for payment queries

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- ============================================
-- PAYMENTS ROW LEVEL SECURITY (RLS)
-- ============================================
-- Secure payment data access - users can only see their own payments

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can INSERT their own payment records
CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can SELECT only their own payment records
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Prevent users from updating or deleting payments (security)
CREATE POLICY "Users cannot update payments" ON public.payments
  FOR UPDATE USING (false);

CREATE POLICY "Users cannot delete payments" ON public.payments
  FOR DELETE USING (false);

-- Admin users can read all payments (for support/admin purposes)
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Service role can manage all payments (for Edge Functions)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- PAYMENTS TRIGGERS
-- ============================================
-- Auto-update the updated_at column for payments

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- NOTES
-- ============================================
-- 
-- 1. The profiles table is automatically populated when users sign up
-- 2. The role field defaults to 'user' - manually update to 'admin' for admin access
-- 3. Supabase Auth handles email/password authentication
-- 4. Paystack amounts are stored in kobo (Nigerian currency unit)
-- 5. 1 Naira = 100 kobo
-- 6. Payment verification must be done server-side using secret key
-- 7. Frontend should NEVER trust payment success without server verification
-- 8. For production, consider adding:
--    - Email confirmation requirement
--    - Password strength policies
--    - Rate limiting on auth endpoints
--    - Multi-factor authentication
--    - Audit logs for payment changes
--

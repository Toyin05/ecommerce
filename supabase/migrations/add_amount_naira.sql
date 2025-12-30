-- Migration: Add amount_naira field to payments table
-- This allows storing both raw kobo amounts and human-readable naira amounts

ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS amount_naira DECIMAL(10,2);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_payments_amount_naira ON public.payments(amount_naira);

-- Add comment for documentation
COMMENT ON COLUMN public.payments.amount_naira IS 'Human-readable amount in Naira (e.g., 69.99 for 6999 kobo)';
-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.set_repurchase_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.can_repurchase_after := (NEW.purchase_date::date + interval '6 months')::date;
  RETURN NEW;
END;
$$;

-- Add missing SELECT policies for database_purchases (service role only access)
CREATE POLICY "Only service role can read purchases"
ON public.database_purchases
FOR SELECT
USING (false);

-- Add missing SELECT policy for next_release_waitlist (service role only)
CREATE POLICY "Only service role can read waitlist"
ON public.next_release_waitlist
FOR SELECT
USING (false);
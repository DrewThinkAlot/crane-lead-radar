-- Add comprehensive RLS policies for database_purchases table
-- Only service role should be able to insert/update/delete purchase records

CREATE POLICY "Only service role can insert purchases"
ON public.database_purchases
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Only service role can update purchases"
ON public.database_purchases
FOR UPDATE
USING (false);

CREATE POLICY "Only service role can delete purchases"
ON public.database_purchases
FOR DELETE
USING (false);
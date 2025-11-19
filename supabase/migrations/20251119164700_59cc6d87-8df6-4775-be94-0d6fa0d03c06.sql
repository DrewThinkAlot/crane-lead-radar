-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index on email for faster lookups
CREATE INDEX idx_waitlist_signups_email ON public.waitlist_signups(email);

-- Add index on created_at for sorting
CREATE INDEX idx_waitlist_signups_created_at ON public.waitlist_signups(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for the waitlist form)
CREATE POLICY "Allow public to submit waitlist signups"
ON public.waitlist_signups
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to prevent public reads (only service role can read)
CREATE POLICY "Only service role can read waitlist signups"
ON public.waitlist_signups
FOR SELECT
USING (false);

COMMENT ON TABLE public.waitlist_signups IS 'Stores waitlist signup requests from the landing page';
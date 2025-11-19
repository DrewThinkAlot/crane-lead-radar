-- Create free_lead_requests table
CREATE TABLE public.free_lead_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  lead_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index on email for faster lookups
CREATE INDEX idx_free_lead_requests_email ON public.free_lead_requests(email);

-- Add index on created_at for sorting
CREATE INDEX idx_free_lead_requests_created_at ON public.free_lead_requests(created_at DESC);

-- Add index on status for filtering
CREATE INDEX idx_free_lead_requests_status ON public.free_lead_requests(status);

-- Enable Row Level Security
ALTER TABLE public.free_lead_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for the free lead form)
CREATE POLICY "Allow public to submit free lead requests"
ON public.free_lead_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to prevent public reads (only service role can read)
CREATE POLICY "Only service role can read free lead requests"
ON public.free_lead_requests
FOR SELECT
USING (false);

COMMENT ON TABLE public.free_lead_requests IS 'Stores free lead requests from the landing page with delivery tracking';
-- Create commercial_buildings table
CREATE TABLE public.commercial_buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Orlando',
  zip_code TEXT NOT NULL,
  building_age INTEGER NOT NULL,
  year_built INTEGER NOT NULL,
  estimated_warranty_expiration DATE NOT NULL,
  square_footage INTEGER NOT NULL,
  property_type TEXT NOT NULL,
  property_owner_name TEXT NOT NULL,
  property_management_company TEXT,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  last_roof_permit_date DATE NOT NULL,
  is_sample_record BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on commercial_buildings
ALTER TABLE public.commercial_buildings ENABLE ROW LEVEL SECURITY;

-- Allow public to view only sample records
CREATE POLICY "Public can view sample records"
ON public.commercial_buildings
FOR SELECT
USING (is_sample_record = true);

-- Create index for sample records
CREATE INDEX idx_commercial_buildings_sample ON public.commercial_buildings(is_sample_record) WHERE is_sample_record = true;

-- Create database_purchases table
CREATE TABLE public.database_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_company TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  csv_delivered_at TIMESTAMP WITH TIME ZONE,
  csv_download_url TEXT,
  amount_paid INTEGER NOT NULL,
  can_repurchase_after DATE,
  repurchase_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on database_purchases (no public access)
ALTER TABLE public.database_purchases ENABLE ROW LEVEL SECURITY;

-- Create function to calculate repurchase date
CREATE OR REPLACE FUNCTION public.set_repurchase_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.can_repurchase_after := (NEW.purchase_date::date + interval '6 months')::date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate repurchase date
CREATE TRIGGER set_repurchase_date_trigger
BEFORE INSERT OR UPDATE OF purchase_date ON public.database_purchases
FOR EACH ROW
EXECUTE FUNCTION public.set_repurchase_date();

-- Create index for fast count queries
CREATE INDEX idx_database_purchases_status ON public.database_purchases(payment_status);

-- Create index for repurchase notifications
CREATE INDEX idx_database_purchases_repurchase ON public.database_purchases(can_repurchase_after, repurchase_notified) WHERE payment_status = 'completed';

-- Create sample_views table (optional analytics)
CREATE TABLE public.sample_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS on sample_views
ALTER TABLE public.sample_views ENABLE ROW LEVEL SECURITY;

-- Allow public to insert sample views
CREATE POLICY "Public can log sample views"
ON public.sample_views
FOR INSERT
WITH CHECK (true);

-- Insert 3 realistic sample records
INSERT INTO public.commercial_buildings (
  property_name, address, city, zip_code, building_age, year_built,
  estimated_warranty_expiration, square_footage, property_type,
  property_owner_name, property_management_company, owner_phone,
  owner_email, last_roof_permit_date, is_sample_record, notes
) VALUES 
(
  'Millenia Office Plaza',
  '4200 Millenia Blvd',
  'Orlando',
  '32839',
  18,
  2007,
  '2025-03-15',
  45000,
  'Office',
  'Millenia Property Group LLC',
  'Cushman & Wakefield',
  '(407) 555-0123',
  'facilities@millenniagroup.com',
  '2007-08-22',
  true,
  'Class A office building, original TPO warranty expired Q1 2025'
),
(
  'Colonial Plaza Shopping Center',
  '2400 E Colonial Dr',
  'Orlando',
  '32803',
  22,
  2003,
  '2023-11-01',
  62000,
  'Retail',
  'Colonial Retail Holdings',
  null,
  '(407) 555-0456',
  'owner@colonialplaza.com',
  '2003-11-12',
  true,
  'Strip mall, warranty EXPIRED Nov 2023, owner fielding bids now'
),
(
  'Lake Mary Distribution Center',
  '875 International Pkwy',
  'Lake Mary',
  '32746',
  19,
  2006,
  '2025-06-30',
  125000,
  'Industrial',
  'Prologis Central Florida LP',
  'JLL Property Management',
  '(407) 555-0789',
  'maintenance@prologiscfl.com',
  '2006-05-18',
  true,
  'Large warehouse, warranty expires mid-2025, proactive facility mgmt team'
);

-- Create storage bucket for CSV exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('database-exports', 'database-exports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (service role only)
CREATE POLICY "Service role can manage exports"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'database-exports');

-- Create next_release_waitlist table for sold out state
CREATE TABLE public.next_release_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on next_release_waitlist
ALTER TABLE public.next_release_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public to insert into waitlist
CREATE POLICY "Public can join next release waitlist"
ON public.next_release_waitlist
FOR INSERT
WITH CHECK (true);
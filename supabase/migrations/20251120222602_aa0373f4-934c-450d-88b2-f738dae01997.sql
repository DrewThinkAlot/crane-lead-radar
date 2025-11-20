-- Remove the public read policy on commercial_buildings
DROP POLICY IF EXISTS "Public can view sample records" ON public.commercial_buildings;

-- Create a secure view for public samples that excludes sensitive contact info
CREATE OR REPLACE VIEW public.public_sample_buildings AS
SELECT 
  id,
  property_name,
  address,
  city,
  zip_code,
  building_age,
  year_built,
  estimated_warranty_expiration,
  square_footage,
  property_type,
  property_management_company,
  last_roof_permit_date,
  created_at,
  -- Exclude: owner_email, owner_phone, property_owner_name, notes
  'Contact info available in full database' as contact_note
FROM public.commercial_buildings
WHERE is_sample_record = true;

-- Allow public to read from the secure view
GRANT SELECT ON public.public_sample_buildings TO anon, authenticated;

-- Add RLS policy for admins to view all commercial_buildings data
CREATE POLICY "Admins can view all buildings"
ON public.commercial_buildings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to manage buildings
CREATE POLICY "Admins can insert buildings"
ON public.commercial_buildings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update buildings"
ON public.commercial_buildings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete buildings"
ON public.commercial_buildings
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
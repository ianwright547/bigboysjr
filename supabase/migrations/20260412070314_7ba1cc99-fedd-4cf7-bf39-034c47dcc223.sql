
-- Create custom item requests table
CREATE TABLE public.custom_item_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  quantity INTEGER NOT NULL DEFAULT 1,
  zip_code TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_item_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts for custom item requests"
ON public.custom_item_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to custom item requests"
ON public.custom_item_requests
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('custom-item-photos', 'custom-item-photos', true);

-- Public read access for photos
CREATE POLICY "Custom item photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'custom-item-photos');

-- Anyone can upload photos
CREATE POLICY "Anyone can upload custom item photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'custom-item-photos');

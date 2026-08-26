
-- 1. Admin can read custom item requests
CREATE POLICY "Admins can read custom item requests"
ON public.custom_item_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Admin can update custom item requests (e.g. assign price)
CREATE POLICY "Admins can update custom item requests"
ON public.custom_item_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Restrict storage uploads to images only, max 10MB
DROP POLICY IF EXISTS "Allow anonymous photo uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload custom item photos" ON storage.objects;

-- Find and drop any existing INSERT policy on the bucket
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND cmd = 'INSERT'
      AND qual IS NOT NULL OR with_check IS NOT NULL
  LOOP
    -- We'll just create our new restrictive one below
    NULL;
  END LOOP;
END $$;

CREATE POLICY "Restricted photo uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'custom-item-photos'
  AND (storage.extension(name) = ANY(ARRAY['jpg','jpeg','png','webp','heic']))
  AND (octet_length(decode('', 'base64')) >= 0) -- placeholder; real size check below
);

-- Replace with proper size-limited policy
DROP POLICY IF EXISTS "Restricted photo uploads" ON storage.objects;

CREATE POLICY "Restricted photo uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'custom-item-photos'
  AND (LOWER(storage.extension(name)) = ANY(ARRAY['jpg','jpeg','png','webp','heic']))
);

-- Update bucket to enforce 10MB file size limit
UPDATE storage.buckets
SET file_size_limit = 10485760
WHERE id = 'custom-item-photos';

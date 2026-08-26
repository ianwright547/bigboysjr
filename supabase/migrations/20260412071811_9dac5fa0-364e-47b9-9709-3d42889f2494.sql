
-- 1. Drop the overly permissive storage INSERT policy
DROP POLICY IF EXISTS "Anyone can upload custom item photos" ON storage.objects;

-- 2. Add DELETE and UPDATE policies for service role on custom-item-photos
CREATE POLICY "Service role can delete custom-item-photos"
ON storage.objects FOR DELETE TO service_role
USING (bucket_id = 'custom-item-photos');

CREATE POLICY "Service role can update custom-item-photos"
ON storage.objects FOR UPDATE TO service_role
USING (bucket_id = 'custom-item-photos');

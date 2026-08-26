-- 1) Tighten storage upload policy for custom-item-photos
DROP POLICY IF EXISTS "Restricted photo uploads" ON storage.objects;

CREATE POLICY "Restricted photo uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'custom-item-photos'
  -- Require uploads under the 'pending/' prefix only (no nesting, no traversal)
  AND name ~ '^pending/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|heic)$'
  -- Cap object name length defensively
  AND length(name) <= 120
  -- Belt-and-suspenders extension check
  AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp','heic'])
);

-- 2) Lock down has_role(): remove direct EXECUTE from end-user roles.
-- RLS policies that call has_role(auth.uid(), 'admin') keep working because
-- the policy is evaluated by the postgres role, not the calling user.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
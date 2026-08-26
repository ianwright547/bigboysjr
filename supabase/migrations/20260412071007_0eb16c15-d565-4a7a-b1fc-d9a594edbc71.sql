
-- 1. Make custom-item-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'custom-item-photos';

-- 2. Drop overly permissive storage policies and add restricted ones
DROP POLICY IF EXISTS "Allow public uploads to custom-item-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to custom-item-photos" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to custom-item-photos" ON storage.objects;

-- Only allow uploads of images with size/type restrictions
CREATE POLICY "Allow anonymous image uploads to custom-item-photos"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'custom-item-photos'
  AND (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'heic'))
);

-- Only service role can read uploaded photos
CREATE POLICY "Service role can read custom-item-photos"
ON storage.objects FOR SELECT TO service_role
USING (bucket_id = 'custom-item-photos');

-- 3. Fix function search_path on all public functions
CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
 RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

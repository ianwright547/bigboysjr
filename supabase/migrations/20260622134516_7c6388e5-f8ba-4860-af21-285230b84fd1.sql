
-- 1) Tighten leads INSERT policy with validation
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.leads;
CREATE POLICY "Allow anonymous inserts" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 200
    AND length(btrim(phone)) BETWEEN 7 AND 30
    AND length(coalesce(email, '')) <= 200
    AND length(coalesce(address, '')) <= 500
    AND length(coalesce(message, '')) <= 2000
    AND length(coalesce(zip_code, '')) <= 20
    AND length(coalesce(time_slot, '')) <= 50
    AND length(coalesce(urgency, '')) <= 50
    AND length(coalesce(pricing_method, '')) <= 50
    AND length(request_type) <= 50
    AND (total_price IS NULL OR (total_price >= 0 AND total_price < 100000))
    AND (selected_items IS NULL OR pg_column_size(selected_items) <= 32768)
    AND (load_size IS NULL OR pg_column_size(load_size) <= 4096)
    AND (add_ons IS NULL OR pg_column_size(add_ons) <= 4096)
  );

-- 2) Restrict EXECUTE on has_role; RLS policies still work since the planner
--    evaluates them with table-owner privileges, not the caller's.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 3) Restrict Realtime subscriptions on the leads channel to admins only.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can subscribe to leads channel" ON realtime.messages;
CREATE POLICY "Admins can subscribe to leads channel"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    (realtime.topic() = 'leads' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  );

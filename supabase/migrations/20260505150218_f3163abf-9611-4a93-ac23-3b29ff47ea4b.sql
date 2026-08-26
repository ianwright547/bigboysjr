-- Revoke EXECUTE on internal SECURITY DEFINER helpers from anon/authenticated.
-- These are only intended to be called by service_role / triggers.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_catalog_items_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role(uuid, app_role) intentionally stays executable: RLS policies across many tables
-- evaluate it as the calling role, so revoking EXECUTE would break authorization checks.

-- Make intent unambiguous: explicitly deny anon/authenticated writes on user_roles and suppressed_emails.

-- user_roles: block any client-side insert/update/delete (only service_role can write)
CREATE POLICY "Block authenticated insert on user_roles"
  ON public.user_roles FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Block authenticated update on user_roles"
  ON public.user_roles FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block authenticated delete on user_roles"
  ON public.user_roles FOR DELETE
  TO anon, authenticated
  USING (false);

-- suppressed_emails: explicit deny for anon/authenticated inserts
CREATE POLICY "Block authenticated insert on suppressed_emails"
  ON public.suppressed_emails FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

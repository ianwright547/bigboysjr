-- Allow service role to update leads (for status changes)
-- The existing "Allow service role full access" policy already covers this.
-- We need anon/authenticated to be able to read and update leads for the admin dashboard.
CREATE POLICY "Allow reading leads for admin"
ON public.leads
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow updating lead status"
ON public.leads
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
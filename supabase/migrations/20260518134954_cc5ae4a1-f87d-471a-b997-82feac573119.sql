CREATE TABLE public.web_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value double precision NOT NULL,
  rating text,
  path text NOT NULL,
  navigation_type text,
  visitor_id text,
  session_id text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
CREATE INDEX idx_web_vitals_name_path ON public.web_vitals (name, path);

ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert web vitals"
ON public.web_vitals FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view web vitals"
ON public.web_vitals FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
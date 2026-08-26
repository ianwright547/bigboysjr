CREATE TABLE IF NOT EXISTS public.seo_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'other',
  title TEXT,
  description TEXT,
  h1 TEXT,
  keywords TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seo_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_overrides TO authenticated;
GRANT ALL ON public.seo_overrides TO service_role;

ALTER TABLE public.seo_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read seo overrides" ON public.seo_overrides;
CREATE POLICY "Anyone can read seo overrides" ON public.seo_overrides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage seo overrides" ON public.seo_overrides;
CREATE POLICY "Admins can manage seo overrides" ON public.seo_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_seo_overrides_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_seo_overrides_updated_at ON public.seo_overrides;
CREATE TRIGGER trg_seo_overrides_updated_at BEFORE UPDATE ON public.seo_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_seo_overrides_updated_at();
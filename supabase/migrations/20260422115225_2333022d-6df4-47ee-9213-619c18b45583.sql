-- Catalog items table for admin-managed customer pricing
CREATE TABLE public.catalog_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT '📦',
  category TEXT NOT NULL DEFAULT 'Other',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Public can read active items (used by funnel)
CREATE POLICY "Anyone can read active catalog items"
ON public.catalog_items FOR SELECT
TO anon, authenticated
USING (active = true);

-- Admins can read all (including inactive)
CREATE POLICY "Admins can read all catalog items"
ON public.catalog_items FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert catalog items"
ON public.catalog_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update catalog items"
ON public.catalog_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete catalog items"
ON public.catalog_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access catalog items"
ON public.catalog_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.touch_catalog_items_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER catalog_items_touch
BEFORE UPDATE ON public.catalog_items
FOR EACH ROW EXECUTE FUNCTION public.touch_catalog_items_updated_at();

CREATE INDEX idx_catalog_items_active_category ON public.catalog_items(active, category, sort_order);
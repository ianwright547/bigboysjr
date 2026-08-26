
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip_code TEXT,
  pricing_method TEXT,
  selected_items JSONB,
  load_size JSONB,
  add_ons JSONB,
  total_price NUMERIC,
  request_type TEXT NOT NULL,
  message TEXT,
  urgency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON public.leads
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

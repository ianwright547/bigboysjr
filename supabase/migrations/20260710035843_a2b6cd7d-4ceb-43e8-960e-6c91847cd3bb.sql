ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS geocoded_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_lat_lng ON public.leads (latitude, longitude);
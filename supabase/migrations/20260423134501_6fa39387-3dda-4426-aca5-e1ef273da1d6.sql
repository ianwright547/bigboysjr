-- Raw pageview events
CREATE TABLE IF NOT EXISTS public.pageviews (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  source TEXT,
  device TEXT,
  country TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON public.pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON public.pageviews (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_session ON public.pageviews (session_id, created_at);

ALTER TABLE public.pageviews ENABLE ROW LEVEL SECURITY;

-- Anyone can record a pageview (lightweight tracker)
CREATE POLICY "Anyone can insert pageview"
  ON public.pageviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(path)) BETWEEN 1 AND 500
    AND length(btrim(visitor_id)) BETWEEN 1 AND 100
    AND length(btrim(session_id)) BETWEEN 1 AND 100
  );

-- Only admins can read raw events
CREATE POLICY "Admins can read pageviews"
  ON public.pageviews FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role full access for aggregation
CREATE POLICY "Service role full access pageviews"
  ON public.pageviews FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
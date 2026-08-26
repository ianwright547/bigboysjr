
CREATE TABLE public.site_analytics (
  id integer PRIMARY KEY DEFAULT 1,
  visitors_total integer NOT NULL DEFAULT 0,
  pageviews_total integer NOT NULL DEFAULT 0,
  avg_pages_per_visit numeric NOT NULL DEFAULT 0,
  avg_session_duration numeric NOT NULL DEFAULT 0,
  bounce_rate numeric NOT NULL DEFAULT 0,
  visitors_daily jsonb NOT NULL DEFAULT '[]'::jsonb,
  pageviews_daily jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_pages jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  devices jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage analytics" ON public.site_analytics FOR ALL TO public USING (auth.role() = 'service_role'::text) WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can read analytics" ON public.site_analytics FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed with current data
INSERT INTO public.site_analytics (id, visitors_total, pageviews_total, avg_pages_per_visit, avg_session_duration, bounce_rate, visitors_daily, pageviews_daily, top_pages, sources, devices)
VALUES (
  1, 38, 171, 4.5, 356, 37,
  '[{"date":"2026-04-06","value":0},{"date":"2026-04-07","value":0},{"date":"2026-04-08","value":0},{"date":"2026-04-09","value":0},{"date":"2026-04-10","value":0},{"date":"2026-04-11","value":1},{"date":"2026-04-12","value":30},{"date":"2026-04-13","value":7}]'::jsonb,
  '[{"date":"2026-04-06","value":0},{"date":"2026-04-07","value":0},{"date":"2026-04-08","value":0},{"date":"2026-04-09","value":0},{"date":"2026-04-10","value":0},{"date":"2026-04-11","value":6},{"date":"2026-04-12","value":154},{"date":"2026-04-13","value":11}]'::jsonb,
  '[{"path":"/","count":27},{"path":"/book","count":15},{"path":"/admin","count":11},{"path":"/request-callback","count":5},{"path":"/services/furniture-removal","count":2},{"path":"/privacy","count":2},{"path":"/services/junk-removal","count":2},{"path":"/services/appliance-removal","count":2}]'::jsonb,
  '[{"name":"Direct","count":28},{"name":"google.com","count":5},{"name":"m.facebook.com","count":4},{"name":"l.instagram.com","count":1}]'::jsonb,
  '[{"name":"mobile","count":23},{"name":"desktop","count":14}]'::jsonb
);

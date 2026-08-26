UPDATE public.site_analytics SET
  visitors_total = 295,
  pageviews_total = 815,
  avg_pages_per_visit = 2.76,
  avg_session_duration = 1124,
  bounce_rate = 63,
  visitors_daily = '[
    {"date":"2026-03-24","value":0},{"date":"2026-03-25","value":0},{"date":"2026-03-26","value":0},
    {"date":"2026-03-27","value":0},{"date":"2026-03-28","value":0},{"date":"2026-03-29","value":0},
    {"date":"2026-03-30","value":0},{"date":"2026-03-31","value":0},{"date":"2026-04-01","value":0},
    {"date":"2026-04-02","value":0},{"date":"2026-04-03","value":0},{"date":"2026-04-04","value":0},
    {"date":"2026-04-05","value":0},{"date":"2026-04-06","value":0},{"date":"2026-04-07","value":0},
    {"date":"2026-04-08","value":0},{"date":"2026-04-09","value":0},{"date":"2026-04-10","value":0},
    {"date":"2026-04-11","value":1},{"date":"2026-04-12","value":30},{"date":"2026-04-13","value":44},
    {"date":"2026-04-14","value":37},{"date":"2026-04-15","value":14},{"date":"2026-04-16","value":31},
    {"date":"2026-04-17","value":17},{"date":"2026-04-18","value":41},{"date":"2026-04-19","value":12},
    {"date":"2026-04-20","value":19},{"date":"2026-04-21","value":10},{"date":"2026-04-22","value":31},
    {"date":"2026-04-23","value":8}
  ]'::jsonb,
  pageviews_daily = '[
    {"date":"2026-03-24","value":0},{"date":"2026-03-25","value":0},{"date":"2026-03-26","value":0},
    {"date":"2026-03-27","value":0},{"date":"2026-03-28","value":0},{"date":"2026-03-29","value":0},
    {"date":"2026-03-30","value":0},{"date":"2026-03-31","value":0},{"date":"2026-04-01","value":0},
    {"date":"2026-04-02","value":0},{"date":"2026-04-03","value":0},{"date":"2026-04-04","value":0},
    {"date":"2026-04-05","value":0},{"date":"2026-04-06","value":0},{"date":"2026-04-07","value":0},
    {"date":"2026-04-08","value":0},{"date":"2026-04-09","value":0},{"date":"2026-04-10","value":0},
    {"date":"2026-04-11","value":6},{"date":"2026-04-12","value":154},{"date":"2026-04-13","value":101},
    {"date":"2026-04-14","value":249},{"date":"2026-04-15","value":25},{"date":"2026-04-16","value":33},
    {"date":"2026-04-17","value":21},{"date":"2026-04-18","value":82},{"date":"2026-04-19","value":16},
    {"date":"2026-04-20","value":39},{"date":"2026-04-21","value":16},{"date":"2026-04-22","value":62},
    {"date":"2026-04-23","value":11}
  ]'::jsonb,
  top_pages = '[
    {"path":"/","count":145},{"path":"/admin","count":91},{"path":"/book","count":84},
    {"path":"/suwanee","count":16},{"path":"/request-callback","count":13},
    {"path":"/services/appliance-removal","count":7},{"path":"/services/junk-removal","count":7},
    {"path":"/services/furniture-removal","count":6},{"path":"/blog","count":4},
    {"path":"/services/hot-tub-removal","count":3}
  ]'::jsonb,
  sources = '[
    {"name":"Direct","count":240},{"name":"google.com","count":40},
    {"name":"m.facebook.com","count":4},{"name":"monkey.twilio.com","count":1},
    {"name":"l.instagram.com","count":1}
  ]'::jsonb,
  devices = '[
    {"name":"mobile","count":169},{"name":"desktop","count":116}
  ]'::jsonb,
  updated_at = now()
WHERE id = 1;
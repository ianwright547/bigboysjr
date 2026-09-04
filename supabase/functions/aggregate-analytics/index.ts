import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow service-role callers (e.g. internal scheduler). Reject anon/user JWTs.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (token !== SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Pull last 30 days of pageviews
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data: rows, error } = await client
      .from("pageviews")
      .select("created_at, visitor_id, session_id, path, source, device, country")
      .gte("created_at", since.toISOString())
      .limit(100000);

    if (error) {
      console.error("Pageviews fetch error:", error);
      return new Response(JSON.stringify({ error: "Fetch failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pageviews = rows || [];

    // Build daily series for last 30 days
    const dailyVisitorsMap = new Map<string, Set<string>>();
    const dailyPageviewsMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailyVisitorsMap.set(key, new Set());
      dailyPageviewsMap.set(key, 0);
    }

    const sessionPageCount = new Map<string, number>();
    const sessionTimes = new Map<string, { first: number; last: number }>();
    const visitors = new Set<string>();
    const pageCounts = new Map<string, number>();
    const sourceCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();

    for (const pv of pageviews) {
      const day = (pv.created_at as string).split("T")[0];
      if (dailyVisitorsMap.has(day)) {
        dailyVisitorsMap.get(day)!.add(pv.visitor_id);
        dailyPageviewsMap.set(day, dailyPageviewsMap.get(day)! + 1);
      }
      visitors.add(pv.visitor_id);

      sessionPageCount.set(pv.session_id, (sessionPageCount.get(pv.session_id) || 0) + 1);
      const ts = new Date(pv.created_at as string).getTime();
      const st = sessionTimes.get(pv.session_id);
      if (!st) sessionTimes.set(pv.session_id, { first: ts, last: ts });
      else {
        if (ts < st.first) st.first = ts;
        if (ts > st.last) st.last = ts;
      }

      pageCounts.set(pv.path, (pageCounts.get(pv.path) || 0) + 1);
      const src = pv.source || "Direct";
      sourceCounts.set(src, (sourceCounts.get(src) || 0) + 1);
      const dev = pv.device || "unknown";
      deviceCounts.set(dev, (deviceCounts.get(dev) || 0) + 1);
    }

    const visitors_daily = Array.from(dailyVisitorsMap.entries()).map(([date, set]) => ({
      date,
      value: set.size,
    }));
    const pageviews_daily = Array.from(dailyPageviewsMap.entries()).map(([date, value]) => ({
      date,
      value,
    }));

    const visitors_total = visitors.size;
    const pageviews_total = pageviews.length;
    const sessionCount = sessionPageCount.size;
    const avg_pages_per_visit = sessionCount > 0 ? pageviews_total / sessionCount : 0;

    // Avg session duration (excluding single-page sessions where duration = 0)
    let totalDuration = 0;
    let durationSessions = 0;
    let bouncedSessions = 0;
    for (const [, st] of sessionTimes) {
      const duration = (st.last - st.first) / 1000;
      if (duration > 0) {
        totalDuration += duration;
        durationSessions++;
      } else {
        bouncedSessions++;
      }
    }
    const avg_session_duration = durationSessions > 0 ? totalDuration / durationSessions : 0;
    const bounce_rate = sessionCount > 0 ? Math.round((bouncedSessions / sessionCount) * 100) : 0;

    const sortDesc = (a: [string, number], b: [string, number]) => b[1] - a[1];
    const top_pages = Array.from(pageCounts.entries()).sort(sortDesc).slice(0, 10)
      .map(([path, count]) => ({ path, count }));
    const sources = Array.from(sourceCounts.entries()).sort(sortDesc).slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    const devices = Array.from(deviceCounts.entries()).sort(sortDesc)
      .map(([name, count]) => ({ name, count }));

    const { error: upsertError } = await client.from("site_analytics").upsert({
      id: 1,
      visitors_total,
      pageviews_total,
      avg_pages_per_visit: Number(avg_pages_per_visit.toFixed(2)),
      avg_session_duration: Number(avg_session_duration.toFixed(2)),
      bounce_rate,
      visitors_daily,
      pageviews_daily,
      top_pages,
      sources,
      devices,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return new Response(JSON.stringify({ error: "Upsert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        rows_processed: pageviews.length,
        visitors_total,
        pageviews_total,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

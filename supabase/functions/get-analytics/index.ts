import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    if (!start || !end) {
      return new Response(JSON.stringify({ error: "start and end params required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = await import("https://esm.sh/@supabase/supabase-js@2.49.1");
    const client = supabaseAdmin.createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Authn + authz: must be a signed-in admin
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: userData, error: userErr } = await client.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin, error: roleErr } = await client.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    // Normalize range to full days (UTC)
    const startISO = `${start}T00:00:00.000Z`;
    const endISO = `${end}T23:59:59.999Z`;

    // Fetch leads data
    const { data: leads, error: leadsError } = await client
      .from("leads")
      .select("created_at, request_type, status, total_price, zip_code")
      .gte("created_at", startISO)
      .lte("created_at", endISO)
      .order("created_at", { ascending: true });

    if (leadsError) {
      console.error("Leads query error:", leadsError);
      return new Response(JSON.stringify({ error: "Failed to fetch leads data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch raw pageviews for the SAME range (source of truth, not the cached aggregate)
    const pageviews: {
      created_at: string; visitor_id: string; session_id: string;
      path: string; source: string | null; device: string | null;
    }[] = [];
    const PAGE = 1000;
    for (let from = 0; from < 50000; from += PAGE) {
      const { data: chunk, error: pvErr } = await client
        .from("pageviews")
        .select("created_at, visitor_id, session_id, path, source, device")
        .gte("created_at", startISO)
        .lte("created_at", endISO)
        .order("created_at", { ascending: true })
        .range(from, from + PAGE - 1);
      if (pvErr) {
        console.error("Pageviews query error:", pvErr);
        break;
      }
      if (!chunk || chunk.length === 0) break;
      pageviews.push(...chunk);
      if (chunk.length < PAGE) break;
    }

    // Build daily breakdown for leads
    const dailyMap: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const requestTypes: Record<string, number> = {};
    let bookedRevenue = 0;
    let quotedRevenue = 0;

    const BOOKED_STATUSES = new Set(["booked", "completed"]);

    for (const lead of leads || []) {
      const day = lead.created_at.split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;

      const status = lead.status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const type = lead.request_type || "unknown";
      requestTypes[type] = (requestTypes[type] || 0) + 1;

      const price = Number(lead.total_price) || 0;
      quotedRevenue += price;
      if (BOOKED_STATUSES.has(String(lead.status || "").toLowerCase())) bookedRevenue += price;
    }

    // Generate all dates in range
    const daily: { date: string; value: number }[] = [];
    const days: string[] = [];
    {
      const d = new Date(`${start}T00:00:00.000Z`);
      const endD = new Date(`${end}T00:00:00.000Z`);
      while (d <= endD) {
        const key = d.toISOString().split("T")[0];
        days.push(key);
        daily.push({ date: key, value: dailyMap[key] || 0 });
        d.setUTCDate(d.getUTCDate() + 1);
      }
    }

    const totalLeads = leads?.length || 0;
    const bookedLeads = Object.entries(statusCounts)
      .filter(([name]) => BOOKED_STATUSES.has(name.toLowerCase()))
      .reduce((s, [, c]) => s + c, 0);
    const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 1000) / 10 : 0;

    // ---- Visitor metrics computed from raw pageviews within the range ----
    const visitorsPerDay: Record<string, Set<string>> = {};
    const pageviewsPerDay: Record<string, number> = {};
    const uniqueVisitors = new Set<string>();
    const sessions: Record<string, { count: number; first: number; last: number }> = {};
    const pathCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    const deviceSessions: Record<string, Set<string>> = {};

    for (const pv of pageviews) {
      const day = pv.created_at.split("T")[0];
      (visitorsPerDay[day] ||= new Set()).add(pv.visitor_id);
      pageviewsPerDay[day] = (pageviewsPerDay[day] || 0) + 1;
      uniqueVisitors.add(pv.visitor_id);

      const ts = new Date(pv.created_at).getTime();
      const s = (sessions[pv.session_id] ||= { count: 0, first: ts, last: ts });
      s.count += 1;
      if (ts < s.first) s.first = ts;
      if (ts > s.last) s.last = ts;

      pathCounts[pv.path] = (pathCounts[pv.path] || 0) + 1;
      const src = pv.source || "direct";
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      (deviceSessions[pv.device || "unknown"] ||= new Set()).add(pv.session_id);
    }

    const sessionList = Object.values(sessions);
    const sessionCount = sessionList.length;
    const totalPageviews = pageviews.length;
    const bouncedSessions = sessionList.filter((s) => s.count <= 1).length;
    const totalDurationSec = sessionList.reduce((sum, s) => sum + (s.last - s.first) / 1000, 0);

    const rank = (obj: Record<string, number>) =>
      Object.entries(obj)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const visitorsBlock = {
      visitors: {
        total: uniqueVisitors.size,
        daily: days.map((d) => ({ date: d, value: visitorsPerDay[d]?.size || 0 })),
      },
      pageviews: {
        total: totalPageviews,
        daily: days.map((d) => ({ date: d, value: pageviewsPerDay[d] || 0 })),
      },
      sessions: sessionCount,
      avgPagesPerVisit: sessionCount > 0 ? Math.round((totalPageviews / sessionCount) * 10) / 10 : 0,
      avgSessionDuration: sessionCount > 0 ? Math.round(totalDurationSec / sessionCount) : 0,
      bounceRate: sessionCount > 0 ? Math.round((bouncedSessions / sessionCount) * 1000) / 10 : 0,
      topPages: rank(pathCounts).map((p) => ({ path: p.name, count: p.count })),
      sources: rank(sourceCounts),
      devices: Object.entries(deviceSessions)
        .map(([name, set]) => ({ name, count: set.size }))
        .sort((a, b) => b.count - a.count),
      updatedAt: new Date().toISOString(),
    };

    const result = {
      range: { start, end, days: days.length },
      leads: {
        total: totalLeads,
        booked: bookedLeads,
        daily,
      },
      revenue: {
        total: bookedRevenue,
        quoted: quotedRevenue,
      },
      conversionRate,
      statuses: Object.entries(statusCounts).map(([name, count]) => ({ name, count })),
      requestTypes: Object.entries(requestTypes).map(([name, count]) => ({ name, count })),
      visitors: visitorsBlock,
    };


    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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


    // Fetch leads data
    const { data: leads, error: leadsError } = await client
      .from("leads")
      .select("created_at, request_type, status, total_price, zip_code")
      .gte("created_at", `${start}T00:00:00`)
      .lte("created_at", `${end}T23:59:59`)
      .order("created_at", { ascending: true });

    if (leadsError) {
      console.error("Leads query error:", leadsError);
      return new Response(JSON.stringify({ error: "Failed to fetch leads data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch visitor analytics from site_analytics table
    const { data: siteAnalytics, error: analyticsError } = await client
      .from("site_analytics")
      .select("*")
      .eq("id", 1)
      .single();

    if (analyticsError) {
      console.error("Analytics query error:", analyticsError);
    }

    // Build daily breakdown for leads
    const dailyMap: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const requestTypes: Record<string, number> = {};
    let totalRevenue = 0;

    for (const lead of leads || []) {
      const day = lead.created_at.split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;

      const status = lead.status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const type = lead.request_type || "unknown";
      requestTypes[type] = (requestTypes[type] || 0) + 1;

      if (lead.total_price) totalRevenue += lead.total_price;
    }

    // Generate all dates in range
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daily: { date: string; value: number }[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      daily.push({ date: key, value: dailyMap[key] || 0 });
    }

    const totalLeads = leads?.length || 0;
    const bookedLeads = statusCounts["booked"] || 0;
    const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;

    // Slice site_analytics daily arrays by the requested date range
    const sliceByRange = (arr: { date: string; value: number }[] | null) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter((d) => d.date >= start && d.date <= end);
    };

    const visitorsDailySliced = sliceByRange(siteAnalytics?.visitors_daily as any);
    const pageviewsDailySliced = sliceByRange(siteAnalytics?.pageviews_daily as any);
    const visitorsTotalInRange = visitorsDailySliced.reduce((s, d) => s + (d.value || 0), 0);
    const pageviewsTotalInRange = pageviewsDailySliced.reduce((s, d) => s + (d.value || 0), 0);

    const result = {
      leads: {
        total: totalLeads,
        daily,
      },
      revenue: {
        total: totalRevenue,
      },
      conversionRate,
      statuses: Object.entries(statusCounts).map(([name, count]) => ({ name, count })),
      requestTypes: Object.entries(requestTypes).map(([name, count]) => ({ name, count })),
      visitors: siteAnalytics ? {
        visitors: { total: visitorsTotalInRange, daily: visitorsDailySliced },
        pageviews: { total: pageviewsTotalInRange, daily: pageviewsDailySliced },
        avgPagesPerVisit: Number(siteAnalytics.avg_pages_per_visit),
        avgSessionDuration: Number(siteAnalytics.avg_session_duration),
        bounceRate: Number(siteAnalytics.bounce_rate),
        topPages: siteAnalytics.top_pages,
        sources: siteAnalytics.sources,
        devices: siteAnalytics.devices,
        updatedAt: siteAnalytics.updated_at,
      } : null,
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

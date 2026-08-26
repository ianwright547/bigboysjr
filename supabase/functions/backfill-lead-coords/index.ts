import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin-only endpoint: re-geocodes leads that don't yet have latitude/longitude
// using their full street address. Falls back to logging errors — never
// overwrites existing coords.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const jwt = authHeader.slice(7);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is an admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const body = await req.json().catch(() => ({}));
    const force = !!body.force; // re-geocode even rows that already have coords
    const limit = Math.min(Number(body.limit) || 200, 500);

    let query = admin
      .from("leads")
      .select("id, address, zip_code, latitude, longitude")
      .not("address", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!force) query = query.is("latitude", null);

    const { data: leads, error: readErr } = await query;
    if (readErr) throw readErr;

    let ok = 0, fail = 0, skipped = 0;
    for (const lead of leads || []) {
      const address = (lead.address || "").trim();
      if (!address) { skipped++; continue; }
      const parts = [address];
      if (lead.zip_code && !address.includes(lead.zip_code)) parts.push(lead.zip_code);
      const q = parts.join(", ");
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`,
          { headers: { "User-Agent": "BigBoysJunkRemoval/1.0 (support@bigboysjr.com)", "Accept": "application/json" } },
        );
        if (!res.ok) { console.error(`Geocode ${lead.id} status ${res.status}`); fail++; }
        else {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0 && results[0].lat && results[0].lon) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            const { error: updErr } = await admin.from("leads")
              .update({ latitude: lat, longitude: lon, geocoded_at: new Date().toISOString() })
              .eq("id", lead.id);
            if (updErr) { console.error(`Update ${lead.id} failed:`, updErr); fail++; }
            else ok++;
          } else {
            console.error(`No geocode results for lead ${lead.id}: "${q}"`);
            fail++;
          }
        }
      } catch (e) {
        console.error(`Geocode error for ${lead.id}:`, e);
        fail++;
      }
      // Nominatim usage policy: max 1 req/sec
      await new Promise((r) => setTimeout(r, 1100));
    }

    return new Response(JSON.stringify({ processed: leads?.length || 0, ok, fail, skipped }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("backfill-lead-coords error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

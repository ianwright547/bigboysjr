import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const KNOWN_BOTS = /bot|crawler|spider|crawling|lighthouse|headless|preview/i;

function deriveSource(referrer: string | null): string {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, "");
    // Skip self-referrals
    return host;
  } catch {
    return "Direct";
  }
}

function deriveDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { path, visitor_id, session_id, referrer } = body || {};

    if (
      typeof path !== "string" || path.length < 1 || path.length > 500 ||
      typeof visitor_id !== "string" || visitor_id.length < 1 || visitor_id.length > 100 ||
      typeof session_id !== "string" || session_id.length < 1 || session_id.length > 100
    ) {
      return new Response(JSON.stringify({ error: "invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userAgent = req.headers.get("user-agent") || "";
    if (KNOWN_BOTS.test(userAgent)) {
      return new Response(JSON.stringify({ ok: true, skipped: "bot" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip self-referrals (same host)
    let derivedSource = deriveSource(typeof referrer === "string" ? referrer : null);
    const origin = req.headers.get("origin") || "";
    if (origin) {
      try {
        const originHost = new URL(origin).hostname.replace(/^www\./, "");
        if (derivedSource === originHost) derivedSource = "Direct";
      } catch { /* noop */ }
    }

    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-country-code") ||
      null;

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { error } = await client.from("pageviews").insert({
      visitor_id: String(visitor_id).slice(0, 100),
      session_id: String(session_id).slice(0, 100),
      path: String(path).slice(0, 500),
      referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      source: derivedSource,
      device: deriveDevice(userAgent),
      country,
      user_agent: userAgent.slice(0, 500),
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function parseJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    return JSON.parse(atob(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require the public app key or service key. This function is used by the
    // public booking funnel, so the edge gateway cannot require a logged-in user.
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const bearerToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    const claims = parseJwtClaims(bearerToken);
    const expectedProjectRef = new URL(Deno.env.get("SUPABASE_URL") || "https://invalid.local").hostname.split(".")[0];
    const role = claims?.role;
    const ref = claims?.ref;
    if (ref !== expectedProjectRef || (role !== "anon" && role !== "service_role")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      name, phone, email, address, notes, zipCode, pricingMethod, selectedItems,
      loadSize, addOns, totalPrice, requestType, message, urgency, bookingDate, timeSlot, skipInsert,
      idempotencyKey, leadId: providedLeadId,
    } = body;

    if (!name || !phone || !requestType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Input length / shape caps — mirrors the leads RLS WITH CHECK constraints
    // so unauthenticated callers can't spam admin notifications with huge payloads.
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : v);
    const tooLong = (v: unknown, max: number) => typeof v === "string" && v.length > max;
    if (
      tooLong(name, 200) || tooLong(phone, 30) || tooLong(email, 200) ||
      tooLong(address, 500) || tooLong(message, 2000) || tooLong(notes, 2000) ||
      tooLong(zipCode, 20) || tooLong(requestType, 50) ||
      tooLong(urgency, 50) || tooLong(pricingMethod, 50) || tooLong(timeSlot, 50)
    ) {
      return new Response(JSON.stringify({ error: "Field too long" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (totalPrice != null && (typeof totalPrice !== "number" || totalPrice < 0 || totalPrice >= 100000)) {
      return new Response(JSON.stringify({ error: "Invalid totalPrice" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (Array.isArray(selectedItems) && selectedItems.length > 200) {
      return new Response(JSON.stringify({ error: "Too many items" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Truncate strings going into DB/SMS
    const safeName = str(name, 200) as string;
    const safePhone = str(phone, 30) as string;
    const safeEmail = email ? (str(email, 200) as string) : null;
    const safeAddress = address ? (str(address, 500) as string) : null;
    const safeMessage = (message || notes) ? (str(message || notes, 2000) as string) : null;



    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Insert lead into database (skip if client already inserted)
    let dbError: unknown = null;
    let leadStored = false;
    let leadIdForGeocode: string | null = providedLeadId || null;
    if (!skipInsert) {
      // If we have an idempotency key, check first whether this submission already landed.
      if (idempotencyKey) {
        const { data: existing } = await supabase
          .from("leads")
          .select("id")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (existing?.id) {
          leadStored = true;
          leadIdForGeocode = existing.id;
          console.log(`Idempotent hit: lead already exists for key ${idempotencyKey}`);
        }
      }

      if (!leadStored) {
        const res = await supabase.from("leads").insert({
          name: safeName,
          phone: safePhone,
          email: safeEmail,
          address: safeAddress,
          zip_code: zipCode ? (str(zipCode, 20) as string) : null,
          pricing_method: pricingMethod ? (str(pricingMethod, 50) as string) : null,
          selected_items: selectedItems || null,
          load_size: loadSize || null,
          add_ons: addOns || null,
          total_price: totalPrice || null,
          request_type: str(requestType, 50) as string,
          message: safeMessage,
          urgency: urgency ? (str(urgency, 50) as string) : null,
          status: "New",
          booking_date: bookingDate || null,
          time_slot: timeSlot ? (str(timeSlot, 50) as string) : null,
          save_source: "fallback",
          idempotency_key: idempotencyKey || null,
        }).select("id").maybeSingle();

        dbError = res.error;
        if (dbError) {
          // Unique-key collision => another concurrent attempt already inserted; treat as success.
          if ((dbError as { code?: string }).code === "23505") {
            console.log(`Idempotent collision on insert for key ${idempotencyKey}; treating as stored.`);
            leadStored = true;
            dbError = null;
            if (idempotencyKey) {
              const { data: existing } = await supabase
                .from("leads").select("id").eq("idempotency_key", idempotencyKey).maybeSingle();
              if (existing?.id) leadIdForGeocode = existing.id;
            }
          } else {
            console.error("DB insert error:", dbError);
          }
        } else {
          leadStored = true;
          if (res.data?.id) leadIdForGeocode = res.data.id;
        }
      }
    }

    // 1b. Geocode the full address (street + zip) and persist lat/lng.
    // Uses OpenStreetMap Nominatim — no API key required. Failures are logged
    // and never block the notification flow.
    if (leadStored && leadIdForGeocode && safeAddress) {
      try {
        const parts = [safeAddress];
        if (zipCode && !safeAddress.includes(zipCode)) parts.push(zipCode);
        const q = parts.join(", ");
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;
        const geoRes = await fetch(geoUrl, {
          headers: {
            "User-Agent": "BigBoysJunkRemoval/1.0 (support@bigboysjr.com)",
            "Accept": "application/json",
          },
        });
        if (!geoRes.ok) {
          console.error(`Geocode failed [${geoRes.status}] for "${q}": ${await geoRes.text()}`);
        } else {
          const results = await geoRes.json();
          if (Array.isArray(results) && results.length > 0 && results[0].lat && results[0].lon) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            const { error: updErr } = await supabase
              .from("leads")
              .update({ latitude: lat, longitude: lon, geocoded_at: new Date().toISOString() })
              .eq("id", leadIdForGeocode);
            if (updErr) console.error("Geocode update failed:", updErr);
            else console.log(`Geocoded lead ${leadIdForGeocode} -> ${lat},${lon}`);
          } else {
            console.error(`Geocode returned no results for "${q}"`);
          }
        }
      } catch (geoErr) {
        console.error("Geocode error:", geoErr);
      }
    }

    // Insert-only mode: a database trigger fires the actual notification for
    // every new lead row, so the client fallback must not double-send.
    if (body.skipNotify === true) {
      return new Response(JSON.stringify({ success: true, leadStored, emailSent: false, smsSent: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Determine lead type label

    const leadTypeLabels: Record<string, string> = {
      item_pricing: "Item Pricing Lead",
      load_size: "Load Size Lead",
      live_agent: "Live Agent Request",
    };
    const leadLabel = leadTypeLabels[requestType] || requestType;

    // 3. Send email notification via transactional email system
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "support@bigboysjr.com";
    let emailSuccess = false;
    try {
      let itemsText = "";
      if (requestType === "item_pricing" && selectedItems?.length) {
        itemsText = selectedItems.map((i: any) => `${i.icon} ${i.name} × ${i.quantity}`).join(", ");
      }
      let loadText = "";
      if (requestType === "load_size" && loadSize) {
        loadText = `${loadSize.id} Load - $${loadSize.price}`;
      }
      let addOnsTextForEmail = "";
      if (addOns) {
        const parts: string[] = [];
        const stairsCount = Number(addOns.stairs) || 0;
        const disassemblyCount = Number(addOns.disassembly) || 0;
        if (stairsCount > 0) parts.push(`Stairs × ${stairsCount} ($${stairsCount * 10})`);
        if (disassemblyCount > 0) parts.push(`Disassembly × ${disassemblyCount} ($${disassemblyCount * 20})`);
        if (addOns.sameDay) parts.push("Same Day Service ($20)");
        parts.push("Area Service Fee ($49)");
        addOnsTextForEmail = parts.join(", ");
      }
      const ts = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const leadId = crypto.randomUUID();

      const { error: emailError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-lead-notification",
          recipientEmail: NOTIFICATION_EMAIL,
          idempotencyKey: `lead-notify-${leadId}`,
          templateData: {
            name: safeName,
            phone: safePhone,
            zipCode: zipCode || "N/A",
            leadType: leadLabel,
            totalPrice: totalPrice != null ? String(totalPrice) : undefined,
            items: itemsText || undefined,
            loadSize: loadText || undefined,
            addOns: addOnsTextForEmail || undefined,
            message: safeMessage || undefined,

            urgency: urgency || undefined,
            timestamp: ts,
          },
        },
      });

      if (emailError) {
        console.error("Transactional email error:", emailError.message || emailError);
      } else {
        emailSuccess = true;
        console.log(`EMAIL sent to ${NOTIFICATION_EMAIL}: New ${leadLabel} from ${name}`);
      }
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        leadStored: leadStored || skipInsert,
        emailSent: emailSuccess,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("notify-new-lead error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

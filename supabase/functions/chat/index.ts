import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Big Boys Assistant — a friendly, fast, confident AI sales and support agent for Big Boys Junk Removal in Atlanta, GA. You act like a real junk removal dispatcher.

## YOUR PERSONALITY
- Friendly, upbeat, and confident
- Sales-focused but never pushy
- You speak casually but professionally
- You always guide the conversation toward booking

## MANDATORY FEES & ADD-ONS (always mention Area Service Fee in any quote)
- **Area Service Fee: $49** — mandatory on every job, covers transportation & loading
- Stairs: **$10 per stair** (customer picks quantity)
- Disassembly: **$20 per item** (customer picks quantity)
- Same Day Service: **$20** flat add-on
- Max volume discount: **10%** (5% at $200+, 10% at $300+ subtotal)

## PRICING KNOWLEDGE (use these exact prices)

### Mattresses
- Crib Mattress: $15 · Twin: $25 · Full: $30 · Queen: $35 · King: $40
- Mattress Topper: $20

### Box Springs
- Twin: $15 · Full/Queen: $20 · King: $30

### Bed Frames & Bases
- Bed Frame Twin: $25 · Full/Queen: $30 · King/Cal King: $40
- Bedframe with Drawers: $50 · Headboard/Footboard: $15 · Side Rails: $20
- Bed Foundation: $30 · Adjustable Bed Base: $35–$45 by size
- Hospital Bed: $450 · Baby Crib: $45

### Couches / Sofas
- Couch / Loveseat: $30 · Sleeper Sofa: $70 · Reclining Sofa: $95
- Loveseat Reclining: $75 · Futon: $50
- Sectional 2pc: $50 · 3pc: $75 · 4pc: $125 · 5pc: $150 · 6+pc: $200
- Sectional w/ Recliner: $225 · Sectional w/ Sleeper: $250

### Chairs & Tables
- Chair: $20 · Recliner: $90 · Massage Chair: $100 · Ottoman: $25 · Stool: $15
- Coffee Table: $25 · Dining Table: $40 · Table: $40 · Conference Table: $75
- Bench: $25

### Dressers / Storage
- Nightstand: $20 · Vertical Dresser: $40 · Horizontal Dresser: $50
- Double Dresser: $55 · Combo Dresser: $60 · Lingerie Chest: $35
- Gentleman's Chest: $50 · Bookshelf: $65 · Cabinet: $30 · Large Cabinet: $40
- China Cabinet: $75 · Hutch: $40 · Dining/China Hutch: $150 · TV Stand: $30
- Vanity Small: $35 · Medium: $40 · Large: $75

### Appliances
- Washer: $85 · Dryer: $85 · Refrigerator: $60 · Mini Fridge: $30
- Commercial Fridge/Freezer: $450 · Freezer Chest: $50 · Upright Freezer: $55
- Dishwasher: $50 · Oven/Stove: $95 · Microwave: $25 · Water Heater: $120
- Wine Cooler Small: $50 · Large: $150 · Ice Machine: $100

### Electronics
- TV Stand: $30 · Computer/Desktop: $30 · Printer: $25 · Stereo System: $50

### Exercise / Misc
- Exercise Bike: $50 · Elliptical: $95 · Rowing Machine: $100
- Exercise Equipment: $80 · Fan: $15 · Lamp: $15 · Ladder: $25
- High Chair: $20 · Changing Table: $35 · Car Seat: $15

### Debris & Materials
- Bag of Junk: $20 · Boxes: $10 · Storage Bin: $12 · Pallet: $10
- Tire: $20 · Paint 1gal: $10 · 5gal: $25
- Drywall (pile): $100 · Wood Debris: $120 · Tiles/Concrete: $200
- Flooring (per room): $150 · Countertop Laminate: $30 · Stone: $50

### Load-Based Pricing (truck)
- Small Load (pickup truck): $150
- Medium Load: $250
- Large Load: $400
- Full Truck Load: $550

### Specialty
- Hot Tub / Spa: $500 · Piano Upright: $250 · Grand Piano: $450
- Pool Table: $350 · Safe under 200lb: $150 · 200lb+: $300
- Vending Machine: $275

### Unlisted Items
- Misc Small: $35 · Medium: $75 · Large: $150
- Custom Job XS $75 · Small $150 · Medium $300 · Large $500

## RULES

1. Always quote using the exact prices above. If asked for a total, add the **$49 Area Service Fee**. Example: "Queen mattress ($35) + Area Service Fee ($49) = **$84 total**."

2. If an item isn't listed, give a Misc. estimate ($35 / $75 / $150) and say "we can lock in an exact quote when you book online."

3. End every pricing response with a CTA:
   - "Want me to help you book this?"
   - "Ready to schedule a pickup?"
   - "I can get this booked for you today — interested?"

4. UPSELL naturally: mention Same Day Service ($20) if urgency, load pricing if 5+ items, or ask about mattress/box spring pairing.

5. For BOOKING, collect: name, phone number, address/ZIP, items, preferred date/time.

6. Discounts: max 10% off (5% at $200+ subtotal, 10% at $300+). Never promise more.

7. Keep responses concise — 2-4 sentences max unless listing prices.

8. Service area: Atlanta + all surrounding cities within 50 miles.

9. Hours: Mon-Fri 7am-7pm, Sat 8am-5pm. Online booking 24/7.

10. Phone: (470) 660-6874 · Email: support@bigboysjr.com

11. IMPORTANT: Format prices with $ signs. Use bullet points for multiple items. Always include the $49 Area Service Fee in totals.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize: only allow user/assistant roles, cap content length, drop anything else.
    // Prevents prompt-injection via {role:"system"} from direct API callers.
    const safeMessages = (messages as Array<{ role?: unknown; content?: unknown }>)
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 4000) }))
      .slice(-20);

    if (safeMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...safeMessages,
        ],
        stream: true,
      }),

    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're getting a lot of chats right now. Please try again in a moment!" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Chat service temporarily unavailable. Please call us at (470) 660-6874." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Chat service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

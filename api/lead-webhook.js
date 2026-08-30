const MAX_TEXT_LENGTH = 2_000;

function cleanText(value, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanJsonValue(value) {
  if (value == null) return null;
  const serialized = JSON.stringify(value);
  if (serialized.length > 20_000) return null;
  return value;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("LEAD_WEBHOOK_URL is not configured");
    return response.status(503).json({ error: "Lead forwarding is not configured" });
  }

  const body = request.body && typeof request.body === "object" ? request.body : {};
  const fullName = cleanText(body.name || body.fullName, 200);
  const phone = cleanText(body.phone, 30);
  const requestType = cleanText(body.requestType, 50);

  if (!fullName || !phone || !requestType) {
    return response.status(400).json({ error: "Name, phone, and request type are required" });
  }

  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts.shift() || fullName;
  const lastName = nameParts.join(" ");
  const leadId = cleanText(body.leadId, 100) || crypto.randomUUID();

  const payload = {
    lead_id: leadId,
    is_test: body.isTest === true || requestType === "webhook_test",
    source: "Big Boys Junk Removal Website",
    request_type: requestType,
    submitted_at: new Date().toISOString(),
    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    phone,
    email: cleanText(body.email, 200) || null,
    address: cleanText(body.address, 500) || null,
    postal_code: cleanText(body.zipCode, 20) || null,
    pricing_method: cleanText(body.pricingMethod, 50) || null,
    selected_items: cleanJsonValue(body.selectedItems),
    load_size: cleanJsonValue(body.loadSize),
    add_ons: cleanJsonValue(body.addOns),
    total_price: typeof body.totalPrice === "number" ? body.totalPrice : null,
    message: cleanText(body.message || body.notes) || null,
    urgency: cleanText(body.urgency, 50) || null,
    booking_date: cleanText(body.bookingDate, 40) || null,
    time_slot: cleanText(body.timeSlot, 50) || null,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!webhookResponse.ok) {
      console.error(`LeadConnector webhook returned ${webhookResponse.status}`);
      return response.status(502).json({ error: "Lead forwarding failed" });
    }

    return response.status(200).json({ success: true, leadId });
  } catch (error) {
    console.error("LeadConnector webhook request failed", error instanceof Error ? error.message : error);
    return response.status(502).json({ error: "Lead forwarding failed" });
  } finally {
    clearTimeout(timeout);
  }
}

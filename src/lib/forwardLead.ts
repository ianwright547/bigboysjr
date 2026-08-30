export interface LeadForwardPayload {
  leadId?: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  zipCode?: string | null;
  pricingMethod?: string | null;
  selectedItems?: unknown;
  loadSize?: unknown;
  addOns?: unknown;
  totalPrice?: number | null;
  requestType: string;
  message?: string | null;
  notes?: string | null;
  urgency?: string | null;
  bookingDate?: string | null;
  timeSlot?: string | null;
}

export async function forwardLead(payload: LeadForwardPayload): Promise<void> {
  const response = await fetch("/api/lead-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Lead forwarding failed with status ${response.status}`);
  }
}

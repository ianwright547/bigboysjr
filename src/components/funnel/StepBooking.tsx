import { useFunnel } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", sub: "8am - 12pm" },
  { id: "afternoon", label: "Afternoon", sub: "12pm - 4pm" },
  { id: "evening", label: "Evening", sub: "4pm - 7pm" },
];

const StepBooking = () => {
  const { customerInfo, setCustomerInfo, next, back, totalPrice, pricingMethod, selectedLoadSize, items, addOns, zip, discountPercent, discountAmount } = useFunnel();
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string | Date | undefined) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
  };

  const isValid = customerInfo.name.trim() && customerInfo.phone.trim() && customerInfo.address.trim() && customerInfo.date && customerInfo.timeSlot;

  const handleConfirm = async () => {
    setSubmitting(true);
    const selectedItems = pricingMethod === "items"
      ? items.filter((i) => i.quantity > 0).map((i) => ({ id: i.id, name: i.name, icon: i.icon, quantity: i.quantity, price: i.price }))
     : null;

    // Stable idempotency key for this submission: reused across all retries
    // and the server fallback so duplicate inserts collapse to a single row.
    const genUuid = () =>
      (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
       : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const idempotencyKey = genUuid();
    // Generate the lead id client-side so we don't depend on a RETURNING
    // round-trip that anon users can't read back through RLS (SELECT on
    // `leads` is admin-only). This makes the insert success signal
    // depend ONLY on the absence of an error, not on a returned row.
    const leadId = genUuid();

    const leadRow = {
      id: leadId,
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email || null,
      address: customerInfo.address,
      zip_code: zip || null,
      pricing_method: pricingMethod || null,
      selected_items: selectedItems as never,
      load_size: (pricingMethod === "load" ? selectedLoadSize: null) as never,
      add_ons: addOns as never,
      total_price: totalPrice,
      request_type: pricingMethod === "load" ? "load_size": "item_pricing",
      message: customerInfo.notes || null,
      status: "New",
      booking_date: customerInfo.date ? customerInfo.date.toISOString().split("T")[0]: null,
      time_slot: customerInfo.timeSlot || null,
      save_source: "direct",
      idempotency_key: idempotencyKey,
    };

    // 1. Try direct insert with exponential backoff retry (fastest path, gives us an ID immediately)
    let savedId: string | null = null;
    let directInsertError: unknown = null;
    const MAX_ATTEMPTS = 3;
    const BASE_DELAY_MS = 400; // 400ms, 800ms, 1600ms
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        // No `.select()` here: anon role has no SELECT policy on `leads`,
        // so RETURNING would always come back empty and look like a failure
        // even when the insert actually committed. We trust the lack of
        // error AND use our client-generated id.
        const { error } = await supabase.from("leads").insert([leadRow]);
        if (error) {
          // Unique-key collision => the row already exists for this idempotency key.
          // We generated the id, so we already know it; treat as success.
          const code = (error as { code?: string }).code;
          if (code === "23505") {
            savedId = leadId;
            directInsertError = null;
            break;
          }
          throw error;
        }
        savedId = leadId;
        directInsertError = null;
        break;
      } catch (err) {
        directInsertError = err;
        console.error(`Direct lead save attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err);
        if (attempt < MAX_ATTEMPTS) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // 2. Server-side fallback: if direct insert failed, ask the edge function
    //    (service role) to save the lead AND send notifications in one shot.
    //    This guarantees bookings aren't lost to client-side issues (RLS, ad blockers, network).
    let notificationDispatched = false;
    if (!savedId) {
      try {
        const { data, error } = await supabase.functions.invoke("notify-new-lead", {
          body: {
            skipInsert: false,
            skipNotify: true, // DB trigger sends the notification once the row lands

            name: leadRow.name,
            phone: leadRow.phone,
            email: leadRow.email,
            address: leadRow.address,
            notes: leadRow.message,
            zipCode: zip,
            pricingMethod,
            selectedItems,
            loadSize: pricingMethod === "load" ? selectedLoadSize: null,
            addOns,
            totalPrice,
            requestType: leadRow.request_type,
            bookingDate: leadRow.booking_date,
            timeSlot: leadRow.time_slot,
            idempotencyKey,
            clientErrorContext: directInsertError ? String(directInsertError): "unknown_client_failure",
          },
        });
        if (error) throw error;
        if (data?.leadStored) {
          savedId = "server-saved";
          notificationDispatched = true;
        }
      } catch (fallbackErr) {
        console.error("Server fallback save error:", fallbackErr);
      }
    }

    if (!savedId) {
      toast.error("We couldn't save your booking. Please call (470) 660-6874.");
      setSubmitting(false);
      return;
    }

    // 3. Notifications are sent server-side by a database trigger on `leads`,
    //    so they no longer depend on this browser completing an extra request.
    void notificationDispatched;



    setSubmitting(false);
    next();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-1">Book your pickup</h2>
      <p className="text-muted-foreground mb-1">Total: <span className="font-bold text-foreground">${totalPrice}</span></p>
      {discountPercent > 0 && (
        <p className="text-xs text-primary font-semibold mb-1">🎉 {discountPercent}% volume discount applied (-${discountAmount})</p>
      )}
      <p className="text-xs text-primary font-medium mb-6">⚡ Same-day slots available</p>

      <div className="space-y-4">
        <Input
          placeholder="Full name *"
          value={customerInfo.name}
          onChange={(e) => update("name", e.target.value)}
          className="h-12 rounded-xl"
        />
        <Input
          placeholder="Phone number *"
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="h-12 rounded-xl"
        />
        <Input
          placeholder="Email (optional)"
          type="email"
          value={customerInfo.email}
          onChange={(e) => update("email", e.target.value)}
          className="h-12 rounded-xl"
        />
        <Input
          placeholder="Pickup address *"
          value={customerInfo.address}
          onChange={(e) => update("address", e.target.value)}
          className="h-12 rounded-xl"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full h-12 rounded-xl justify-start text-left font-normal", !customerInfo.date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customerInfo.date ? format(customerInfo.date, "PPP"): "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customerInfo.date}
              onSelect={(d) => update("date", d)}
              disabled={(d) => {
                const n = new Date();
                const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
                return cmp.getTime() < today.getTime();
              }}
              fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}

              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Time slot</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => update("timeSlot", slot.id)}
                className={cn(
                  "p-3 rounded-xl border-2 text-center transition-colors",
                  customerInfo.timeSlot === slot.id
                    ? "border-primary bg-secondary"
                   : "border-border bg-card hover:bg-muted"
                )}
              >
                <p className="text-sm font-semibold text-foreground">{slot.label}</p>
                <p className="text-xs text-muted-foreground">{slot.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Notes / Special instructions (optional)"
          value={customerInfo.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="rounded-xl min-h-[80px]"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={back} className="flex-1 h-12 rounded-xl">Back</Button>
        <Button onClick={handleConfirm} disabled={!isValid || submitting} className="flex-1 h-12 rounded-xl font-semibold">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" />: null}
          {submitting ? "Submitting...": "Confirm Booking"}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepBooking;

import { useFunnel, AREA_SERVICE_FEE } from "@/context/FunnelContext";
import { motion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";
import { format } from "date-fns";

const StepConfirmation = () => {
  const { items, addOns, totalPrice, customerInfo, pricingMethod, selectedLoadSize, discountPercent, discountAmount } = useFunnel();
  const selectedItems = pricingMethod === "items" ? items.filter((i) => i.quantity > 0): [];

  const timeLabels: Record<string, string> = {
    morning: "Morning (8am-12pm)",
    afternoon: "Afternoon (12pm-4pm)",
    evening: "Evening (4pm-7pm)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-4 py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
      </motion.div>

      <h2 className="text-3xl font-bold text-foreground mb-2">Booking confirmed!</h2>
      <p className="text-muted-foreground mb-8">We'll contact you shortly to finalize details.</p>

      <div className="bg-card rounded-2xl border border-border p-6 text-left space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {pricingMethod === "load" ? "Load": "Items"}
          </p>
          {pricingMethod === "load" && selectedLoadSize ? (
            <div className="flex justify-between text-sm">
              <span className="text-foreground">🚛 {selectedLoadSize.id.charAt(0).toUpperCase() + selectedLoadSize.id.slice(1)} Load</span>
              <span className="font-medium text-foreground">${selectedLoadSize.price}</span>
            </div>
          ): (
            selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">{item.icon} {item.name} × {item.quantity}</span>
                <span className="font-medium text-foreground">${item.price * item.quantity}</span>
              </div>
            ))
          )}
          {Number(addOns.stairs) > 0 && <div className="flex justify-between text-sm"><span className="text-foreground">Stairs × {Number(addOns.stairs)}</span><span className="font-medium text-foreground">${Number(addOns.stairs) * 10}</span></div>}
          {Number(addOns.disassembly) > 0 && <div className="flex justify-between text-sm"><span className="text-foreground">Disassembly × {Number(addOns.disassembly)}</span><span className="font-medium text-foreground">${Number(addOns.disassembly) * 20}</span></div>}
          {addOns.sameDay && <div className="flex justify-between text-sm"><span className="text-foreground">Same Day Service</span><span className="font-medium text-foreground">$20</span></div>}
          <div className="flex justify-between text-sm"><span className="text-foreground">🚚 Area Service Fee</span><span className="font-medium text-foreground">${AREA_SERVICE_FEE}</span></div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-sm text-primary font-medium">
              <span>🎉 {discountPercent}% volume discount</span>
              <span>-${discountAmount}</span>
            </div>
          )}
          <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-foreground">
            <span>Total</span><span>${totalPrice}</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pickup</p>
          <p className="text-sm text-foreground">{customerInfo.date ? format(customerInfo.date, "PPP"): ""}</p>
          <p className="text-sm text-foreground">{timeLabels[customerInfo.timeSlot] || ""}</p>
          <p className="text-sm text-foreground">{customerInfo.address}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Contact</p>
          <p className="text-sm text-foreground">{customerInfo.name}</p>
          <p className="text-sm text-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {customerInfo.phone}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StepConfirmation;

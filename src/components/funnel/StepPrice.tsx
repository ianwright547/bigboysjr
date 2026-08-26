import { useState, useEffect } from "react";
import { useFunnel, AREA_SERVICE_FEE } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, UserCheck, BadgeDollarSign } from "lucide-react";

const StepPrice = () => {
  const { items, addOns, totalPrice, pricingMethod, selectedLoadSize, next, back, discountPercent, discountAmount, subtotal } = useFunnel();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const selectedItems = items.filter((i) => i.quantity > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Calculating your price…</p>
          </motion.div>
        ): (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Your price</h2>

            <div className="bg-secondary rounded-2xl p-6 text-center mb-6">
              {discountPercent > 0 && (
                <p className="text-sm text-muted-foreground line-through mb-1">${subtotal}</p>
              )}
              <p className="text-5xl font-bold text-foreground">${totalPrice}</p>
              {discountPercent > 0 && (
                <p className="text-sm text-primary font-semibold mt-1">🎉 {discountPercent}% volume discount (-${discountAmount})</p>
              )}
              <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <BadgeDollarSign className="w-4 h-4" /> No hidden fees
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {pricingMethod === "load" && selectedLoadSize ? (
                <div className="flex justify-between text-sm px-1">
                  <span className="text-muted-foreground">🚛 {selectedLoadSize.id.charAt(0).toUpperCase() + selectedLoadSize.id.slice(1)} Load</span>
                  <span className="font-medium text-foreground">${selectedLoadSize.price}</span>
                </div>
              ): (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm px-1">
                    <span className="text-muted-foreground">{item.icon} {item.name} × {item.quantity}</span>
                    <span className="font-medium text-foreground">${item.price * item.quantity}</span>
                  </div>
                ))
              )}
              {Number(addOns.stairs) > 0 && (
                <div className="flex justify-between text-sm px-1">
                  <span className="text-muted-foreground">Stairs × {Number(addOns.stairs)}</span>
                  <span className="font-medium text-foreground">${Number(addOns.stairs) * 10}</span>
                </div>
              )}
              {Number(addOns.disassembly) > 0 && (
                <div className="flex justify-between text-sm px-1">
                  <span className="text-muted-foreground">Disassembly × {Number(addOns.disassembly)}</span>
                  <span className="font-medium text-foreground">${Number(addOns.disassembly) * 20}</span>
                </div>
              )}
              {addOns.sameDay && (
                <div className="flex justify-between text-sm px-1">
                  <span className="text-muted-foreground">Same Day Service</span>
                  <span className="font-medium text-foreground">$20</span>
                </div>
              )}
              <div className="flex justify-between text-sm px-1 pt-2 border-t border-border">
                <span className="text-muted-foreground">🚚 Area Service Fee <span className="text-xs">(transportation & loading)</span></span>
                <span className="font-medium text-foreground">${AREA_SERVICE_FEE}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Fully insured
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" /> Background-checked professionals
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <UserCheck className="w-4 h-4 text-primary" /> Satisfaction guaranteed
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={back} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={next} className="flex-1 h-12 rounded-xl font-semibold">Book Now</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StepPrice;

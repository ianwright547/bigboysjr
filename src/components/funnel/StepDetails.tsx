import { useFunnel } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { ArrowUpFromLine, Wrench, Zap, Plus, Minus } from "lucide-react";

const StepDetails = () => {
  const { addOns, setAddOns, totalPrice, next, pricingMethod, setStep, discountPercent, discountAmount } = useFunnel();

  const updateCount = (key: "stairs" | "disassembly", delta: number) => {
    const current = Number(addOns[key]) || 0;
    const nextVal = Math.max(0, Math.min(50, current + delta));
    setAddOns({ ...addOns, [key]: nextVal });
  };

  const counters = [
    { key: "stairs" as const, label: "Are there stairs?", help: "Per stair", unitPrice: 10, icon: ArrowUpFromLine },
    { key: "disassembly" as const, label: "Needs disassembly?", help: "Per item", unitPrice: 20, icon: Wrench },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-1">Job details</h2>
      <p className="text-muted-foreground mb-6">Any extra considerations?</p>

      <div className="space-y-3">
        {counters.map(({ key, label, help, unitPrice, icon: Icon }) => {
          const count = Number(addOns[key]) || 0;
          const active = count > 0;
          return (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                active ? "border-primary bg-secondary": "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    ${unitPrice} {help.toLowerCase()}
                    {active && ` · +$${count * unitPrice}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => updateCount(key, -1)}
                  disabled={count === 0}
                  aria-label={`Decrease ${label}`}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-foreground">{count}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => updateCount(key, 1)}
                  aria-label={`Increase ${label}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Same Day Service */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
            addOns.sameDay ? "border-primary bg-secondary": "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">Same Day Service</p>
              <p className="text-sm text-muted-foreground">+$20 · Priority pickup today</p>
            </div>
          </div>
          <Switch
            checked={addOns.sameDay}
            onCheckedChange={(v) => setAddOns({ ...addOns, sameDay: v })}
          />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-secondary text-center">
        <p className="text-sm text-muted-foreground">Updated total</p>
        <p className="text-3xl font-bold text-foreground">${totalPrice}</p>
        {discountPercent > 0 && (
          <p className="text-sm text-primary font-semibold mt-1">🎉 {discountPercent}% discount (-${discountAmount})</p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setStep(pricingMethod === "load" ? 4: 3)} className="flex-1 h-12 rounded-xl">Back</Button>
        <Button onClick={next} className="flex-1 h-12 rounded-xl font-semibold">See Price</Button>
      </div>
    </motion.div>
  );
};

export default StepDetails;

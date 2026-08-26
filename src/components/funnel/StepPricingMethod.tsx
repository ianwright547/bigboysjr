import { useFunnel } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { List, Truck, ArrowLeft } from "lucide-react";

const OPTIONS = [
  {
    value: "items" as const,
    title: "Price by Item",
    description: "Select individual items for precise pricing",
    Icon: List,
  },
  {
    value: "load" as const,
    title: "Price by Load Size",
    description: "Choose a truck load size for bulk pricing",
    Icon: Truck,
  },
];

const StepPricingMethod = () => {
  const { pricingMethod, setPricingMethod, setStep, back } = useFunnel();

  const handleSelect = (method: "items" | "load") => {
    setPricingMethod(method);
    setStep(method === "items" ? 3: 4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-1">How should we price your job?</h2>
      <p className="text-muted-foreground mb-6">Choose the method that works best for you</p>

      <div className="space-y-4">
        {OPTIONS.map(({ value, title, description, Icon }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(value)}
            className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-colors ${
              pricingMethod === value
                ? "border-primary bg-secondary shadow-md"
               : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                pricingMethod === value
                  ? "bg-primary text-primary-foreground"
                 : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Not sure? Choose load size for a quick estimate.
      </p>

      <div className="mt-6">
        <Button variant="outline" onClick={back} className="w-full h-12 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>
    </motion.div>
  );
};

export default StepPricingMethod;

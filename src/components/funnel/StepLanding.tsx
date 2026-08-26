import { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ShieldCheck, Clock } from "lucide-react";
import logoImg from "@/assets/logo.png";

const StepLanding = () => {
  const { setZip, next, setStep } = useFunnel();
  const [localZip, setLocalZip] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!/^\d{5}$/.test(localZip)) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setZip(localZip);
    setStep(2); // go to pricing method step
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
    >
      <div className="mb-2">
        <img src={logoImg} alt="Big Boys Junk Removal logo" width={64} height={64} className="w-16 h-16 mx-auto object-contain" decoding="async" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-3">
        Get an Instant Junk Removal Quote
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Get your price in seconds: book junk removal in minutes.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Enter your ZIP code"
          maxLength={5}
          value={localZip}
          onChange={(e) => {
            setLocalZip(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="text-center text-lg h-14 rounded-xl border-2 focus-visible:ring-primary"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleSubmit} size="lg" className="w-full h-14 text-lg rounded-xl font-semibold">
          Check Price
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Fully insured</div>
        <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Same-day pickup</div>
      </div>
    </motion.div>
  );
};

export default StepLanding;

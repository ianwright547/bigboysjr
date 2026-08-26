import { useEffect, lazy, Suspense, useRef } from "react";
import { FunnelProvider, useFunnel } from "@/context/FunnelContext";
import ProgressBar from "@/components/funnel/ProgressBar";
import StepLanding from "@/components/funnel/StepLanding";
import StepPricingMethod from "@/components/funnel/StepPricingMethod";
import StepItems from "@/components/funnel/StepItems";
import StepLoadSize from "@/components/funnel/StepLoadSize";
import StepDetails from "@/components/funnel/StepDetails";
import StepPrice from "@/components/funnel/StepPrice";
import StepBooking from "@/components/funnel/StepBooking";
import StepConfirmation from "@/components/funnel/StepConfirmation";
import { AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";

const AnimatedHeroBackground = lazy(() => import("@/components/AnimatedHeroBackground"));

const STEPS = [StepLanding, StepLanding, StepPricingMethod, StepItems, StepLoadSize, StepDetails, StepPrice, StepBooking, StepConfirmation];

const FunnelContent = () => {
  const { step, setZip, setStep } = useFunnel();
  const stepRef = useRef<HTMLDivElement>(null);
  const initialRender = useRef(true);

  // If user came from homepage with a ZIP, skip to pricing method
  useEffect(() => {
    const entryZip = localStorage.getItem("entryZip");
    if (entryZip) {
      setZip(entryZip);
      setStep(2);
      localStorage.removeItem("entryZip");
    }
  }, [setStep, setZip]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.requestAnimationFrame(() => {
      stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [step]);

  const StepComponent = STEPS[step];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <AnimatedHeroBackground className="w-full h-full" opacity={0.14} />
        </Suspense>
      </div>
      <div ref={stepRef} className="scroll-mt-16">
        <ProgressBar />
        <AnimatePresence mode="wait">
          <StepComponent key={step} />
        </AnimatePresence>
      </div>
    </div>
  );
};

const Book = () => (
  <FunnelProvider>
    <Seo
      title="Book Junk Removal Online | Instant Quote | Big Boys"
      description="Build an upfront junk removal estimate by item or load size, then request a pickup time from Big Boys in Metro Atlanta."
      path="/book"
    />
    <FunnelContent />
  </FunnelProvider>
);

export default Book;

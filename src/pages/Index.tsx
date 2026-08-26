import { lazy, Suspense } from "react";
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

const AnimatedHeroBackground = lazy(() => import("@/components/AnimatedHeroBackground"));

// Steps: 0=Landing, 1=Landing(zip), 2=PricingMethod, 3=Items, 4=LoadSize, 5=Details, 6=Price, 7=Booking, 8=Confirmation
const STEPS = [StepLanding, StepLanding, StepPricingMethod, StepItems, StepLoadSize, StepDetails, StepPrice, StepBooking, StepConfirmation];

const FunnelContent = () => {
  const { step } = useFunnel();
  const StepComponent = STEPS[step];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <AnimatedHeroBackground className="w-full h-full" opacity={0.14} />
        </Suspense>
      </div>
      <ProgressBar />
      <AnimatePresence mode="wait">
        <StepComponent key={step} />
      </AnimatePresence>
    </div>
  );
};

const Index = () => (
  <FunnelProvider>
    <FunnelContent />
  </FunnelProvider>
);

export default Index;

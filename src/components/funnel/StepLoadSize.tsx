import { useFunnel } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import LiveAgentCard from "./LiveAgentCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LOAD_LEVELS = [
  { fraction: 1, label: "1/8", price: 99, cubicYards: "~2 cu yd" },
  { fraction: 2, label: "2/8", price: 199, cubicYards: "~4 cu yd" },
  { fraction: 3, label: "3/8", price: 250, cubicYards: "~6 cu yd" },
  { fraction: 4, label: "4/8", price: 379, cubicYards: "~8 cu yd" },
  { fraction: 5, label: "5/8", price: 450, cubicYards: "~10 cu yd" },
  { fraction: 6, label: "6/8", price: 499, cubicYards: "~12 cu yd" },
  { fraction: 7, label: "7/8", price: 599, cubicYards: "~14 cu yd" },
  { fraction: 8, label: "Full", price: 649, cubicYards: "~16 cu yd" },
];

const RANGE_LABELS = [
  { start: 1, end: 2, label: "Small Load", position: 0.125 },
  { start: 3, end: 4, label: "Medium Load", position: 0.375 },
  { start: 5, end: 6, label: "Large Load", position: 0.625 },
  { start: 7, end: 8, label: "Full Load", position: 0.875 },
];

const StepLoadSize = () => {
  const { selectedLoadSize, setSelectedLoadSize, setStep } = useFunnel();
  const [hoveredFraction, setHoveredFraction] = useState<number | null>(null);

  const activeFraction = hoveredFraction ?? selectedLoadSize?.fraction ?? 0;
  const activeLevel = LOAD_LEVELS.find((l) => l.fraction === activeFraction);

  const handleSelect = (fraction: number) => {
    const level = LOAD_LEVELS.find((l) => l.fraction === fraction)!;
    setSelectedLoadSize({ id: `load-${fraction}`, fraction, price: level.price });
  };

  const getRangeForFraction = (f: number) => {
    if (f <= 2) return "Small Load";
    if (f <= 4) return "Medium Load";
    if (f <= 6) return "Large Load";
    return "Full Load";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground mb-1">
        Select How Much Space You Need
      </h2>
      <p className="text-sm text-muted-foreground mb-1">
        Our trailer is <span className="font-semibold text-foreground">16 ft long × 7 ft wide</span> (standard full load)
      </p>
      <p className="text-xs text-muted-foreground mb-5">
        Tap how much of the trailer your items will fill
      </p>

      {/* Price display */}
      <div className="text-center mb-5 h-20 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {activeLevel ? (
            <motion.div
              key={activeFraction}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-1"
            >
              <p className="text-sm text-muted-foreground">
                You selected: <span className="font-semibold text-foreground">{activeLevel.label}</span> of trailer
                <span className="ml-1.5 text-xs text-muted-foreground">({getRangeForFraction(activeFraction)})</span>
              </p>
              <p className="text-3xl font-bold text-primary">${activeLevel.price}</p>
              <p className="text-xs text-muted-foreground">{activeLevel.cubicYards}</p>
            </motion.div>
          ): (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              Select a load size below
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Trailer visual */}
      <TooltipProvider delayDuration={200}>
        <div className="relative mx-auto mb-2">
          {/* Hitch connector (left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full flex items-center z-10">
            <div className="w-6 h-3 bg-muted-foreground/30 rounded-l-sm" />
            <div className="w-2 h-5 bg-muted-foreground/40 rounded-l-full -ml-px" />
          </div>

          {/* Trailer body */}
          <div className="relative border-2 border-border rounded-lg overflow-hidden shadow-md bg-muted/20 ml-8">
            {/* Segments */}
            <div className="flex h-28 sm:h-36">
              {LOAD_LEVELS.map((level, i) => {
                const isActive = level.fraction <= activeFraction;
                const isExactSelection = selectedLoadSize?.fraction === level.fraction;
                const isMostCommon = level.fraction >= 3 && level.fraction <= 5;

                return (
                  <Tooltip key={level.fraction}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => handleSelect(level.fraction)}
                        onMouseEnter={() => setHoveredFraction(level.fraction)}
                        onMouseLeave={() => setHoveredFraction(null)}
                        className={`relative flex-1 cursor-pointer flex items-center justify-center transition-colors duration-300 ${
                          i < LOAD_LEVELS.length - 1 ? "border-r border-dashed border-border/60": ""
                        } ${
                          isActive
                            ? "bg-primary/80 hover:bg-primary"
                           : "bg-muted/10 hover:bg-muted/30"
                        }`}
                        whileTap={{ scale: 0.96 }}
                      >
                        {/* Most Common badge on section 2 */}
                        {level.fraction === 2 && (
                          <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                            <span className="flex items-center gap-0.5 bg-accent text-accent-foreground text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-b-md whitespace-nowrap">
                              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Most Common
                            </span>
                          </div>
                        )}

                        <span
                          className={`text-[10px] sm:text-xs font-semibold select-none transition-colors duration-200 ${
                            isActive ? "text-primary-foreground": "text-muted-foreground"
                          }`}
                        >
                          {level.label}
                        </span>

                        {/* Selected dot indicator */}
                        {isExactSelection && (
                          <motion.div
                            layoutId="load-selected-dot"
                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-foreground shadow-sm"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-semibold">{level.label}: ${level.price}</p>
                      <p className="text-muted-foreground">{level.cubicYards}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Bottom wheels: half hidden under trailer */}
          <div className="absolute -bottom-[10px] sm:-bottom-[12px] left-[calc(42%+2rem)] -translate-x-1/2 flex gap-6 sm:gap-10 overflow-visible">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted-foreground/60 border-[3px] border-muted-foreground/30 shadow-md" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted-foreground/60 border-[3px] border-muted-foreground/30 shadow-md" />
          </div>

          {/* Top wheels: half hidden under trailer */}
          <div className="absolute -top-[10px] sm:-top-[12px] left-[calc(42%+2rem)] -translate-x-1/2 flex gap-6 sm:gap-10 overflow-visible">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted-foreground/60 border-[3px] border-muted-foreground/30 shadow-md" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted-foreground/60 border-[3px] border-muted-foreground/30 shadow-md" />
          </div>
        </div>
      </TooltipProvider>

      {/* Range labels below trailer */}
      <div className="flex mt-6 ml-8">
        {RANGE_LABELS.map((range) => (
          <div key={range.label} className="flex-1 text-center">
            <span
              className={`text-[10px] sm:text-xs font-medium transition-colors ${
                activeFraction >= range.start && activeFraction <= range.end
                  ? "text-primary font-semibold"
                 : "text-muted-foreground"
              }`}
            >
              {range.label}
            </span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          onClick={() => setStep(5)}
          disabled={!selectedLoadSize}
          className="flex-1 h-12 rounded-xl font-semibold"
        >
          Continue
        </Button>
      </div>

      <LiveAgentCard />
    </motion.div>
  );
};

export default StepLoadSize;

import { useFunnel } from "@/context/FunnelContext";

const LABELS = ["Start", "Method", "Items", "Details", "Price", "Book", "Done"];

const ProgressBar = () => {
  const { step } = useFunnel();
  if (step === 0 || step === 8) return null;

  // Map actual steps to progress (1-6 visual steps)
  // step 1=zip(hidden), 2=method, 3=items, 4=loadSize, 5=details, 6=price, 7=booking
  const stepMap: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 5 };
  const progressStep = stepMap[step] ?? 1;

  return (
    <div className="w-full px-4 pt-4 pb-2 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-1">
        {LABELS.slice(1, 6).map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                i + 1 <= progressStep
                  ? "bg-primary text-primary-foreground"
                 : "bg-step-inactive text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-step-inactive rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(progressStep / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreferredSourceClient {
  init: (options: { theme: "light" | "dark"; lang?: string }) => void;
  addPreferredSource: () => void;
}

declare global {
  interface Window {
    PREFERRED_SOURCE?: Array<(client: PreferredSourceClient) => void>;
  }
}

let preferredSourceClient: PreferredSourceClient | null = null;
let preferredSourceInitialized = false;

if (typeof window !== "undefined") {
  window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || [];
  window.PREFERRED_SOURCE.push((client) => {
    preferredSourceClient = client;
    if (!preferredSourceInitialized) {
      client.init({ theme: "light", lang: "en" });
      preferredSourceInitialized = true;
    }
  });
}

interface PreferredSourceButtonProps {
  inverted?: boolean;
  className?: string;
}

const PreferredSourceButton = ({ inverted = false, className }: PreferredSourceButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!preferredSourceClient) return;

    event.preventDefault();
    preferredSourceClient.addPreferredSource();
  };

  return (
    <a
      href="https://www.google.com/preferences/source?q=bigboysjr.com"
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        inverted
          ? "border-background/25 bg-background text-foreground hover:bg-background/90"
          : "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      aria-label="Add Big Boys Junk Removal as a preferred source in Google Search"
    >
      <Star className="h-4 w-4" aria-hidden="true" />
      Add to Google Preferred Sources
    </a>
  );
};

export default PreferredSourceButton;

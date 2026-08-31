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
  className?: string;
}

const PreferredSourceButton = ({ className }: PreferredSourceButtonProps) => {
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
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-foreground/10 bg-background/95 px-3 text-xs font-bold text-foreground shadow-[0_6px_22px_rgba(15,23,42,0.16)] backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transform-gpu",
        className,
      )}
      style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}
      aria-label="Add Big Boys Junk Removal as a preferred source in Google Search"
      title="Add Big Boys to Google Preferred Sources"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        <Star className="h-3.5 w-3.5 fill-primary/15 text-primary" aria-hidden="true" />
      </span>
      <span className="sm:hidden">Google</span>
      <span className="hidden sm:inline">Preferred on Google</span>
    </a>
  );
};

export default PreferredSourceButton;

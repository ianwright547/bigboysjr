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
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Add Big Boys Junk Removal as a preferred source in Google Search"
    >
      <Star className="h-4 w-4" aria-hidden="true" />
      <span className="sm:hidden">Google Preferred Source</span>
      <span className="hidden sm:inline">Add to Google Preferred Sources</span>
    </a>
  );
};

export default PreferredSourceButton;

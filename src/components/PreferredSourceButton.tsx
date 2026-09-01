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
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm" aria-hidden="true">
        <svg className="h-4 w-4" viewBox="0 0 24 24" focusable="false">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09A6.3 6.3 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
          />
        </svg>
      </span>
      <span className="sm:hidden">Google</span>
      <span className="hidden sm:inline">Preferred on Google</span>
    </a>
  );
};

export default PreferredSourceButton;

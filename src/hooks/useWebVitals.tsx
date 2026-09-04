import { useEffect } from "react";
import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from "web-vitals";

const VISITOR_KEY = "bbjr_vid";
const SESSION_KEY = "bbjr_sid";

const getId = (storage: Storage, key: string): string | null => {
  try { return storage.getItem(key); } catch { return null; }
};

const report = (metric: Metric) => {
  // Skip admin paths
  if (location.pathname.startsWith("/admin")) return;

  const payload = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: location.pathname,
    navigation_type: metric.navigationType,
    visitor_id: getId(localStorage, VISITOR_KEY),
    session_id: getId(sessionStorage, SESSION_KEY),
    user_agent: navigator.userAgent.slice(0, 300),
  };

  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/web_vitals`;
  const headers = {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    Prefer: "return=minimal",
  };

  const body = JSON.stringify(payload);

  // Prefer sendBeacon for reliability at page-unload time.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      // sendBeacon can't set custom headers, so fall back to fetch keepalive
      // when we need the apikey header (Supabase requires it).
      void fetch(url, { method: "POST", headers, body, keepalive: true }).catch(() => {});
      return;
    }
  } catch { /* noop */ }

  fetch(url, { method: "POST", headers, body, keepalive: true }).catch(() => {});
};

let started = false;

export const useWebVitals = () => {
  useEffect(() => {
    if (started) return;
    started = true;
    // Only record in production builds — dev numbers are misleading.
    if (import.meta.env.DEV) return;
    onLCP(report);
    onINP(report);
    onCLS(report);
    onFCP(report);
    onTTFB(report);
  }, []);
};

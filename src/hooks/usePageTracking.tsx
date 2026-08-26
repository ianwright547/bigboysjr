import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const VISITOR_KEY = "bbjr_vid";
const SESSION_KEY = "bbjr_sid";
const SESSION_TS_KEY = "bbjr_sid_ts";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min idle

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
};

const getSessionId = (): string => {
  try {
    const now = Date.now();
    const lastTs = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id || now - lastTs > SESSION_TIMEOUT_MS) {
      id = generateId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    sessionStorage.setItem(SESSION_TS_KEY, String(now));
    return id;
  } catch {
    return "session";
  }
};

export const usePageTracking = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;

    // Skip admin paths
    if (path.startsWith("/admin")) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-pageview`;
    const payload = {
      path,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      referrer: document.referrer || null,
    };

    // Use sendBeacon if available for reliability, else fetch
    try {
      const body = JSON.stringify(payload);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      };
      fetch(url, {
        method: "POST",
        headers,
        body,
        keepalive: true,
      }).catch(() => { /* silent */ });
    } catch {
      /* silent */
    }
  }, [location.pathname, location.search]);
};

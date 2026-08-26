import { Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useWebVitals } from "@/hooks/useWebVitals";

// Defer ChatWidget: pulls in react-markdown (~69KB). Don't block LCP.
const ChatWidget = lazy(() => import("../ChatWidget"));

const Layout = () => {
  usePageTracking();
  useWebVitals();
  const [mountChat, setMountChat] = useState(false);

  useEffect(() => {
    // Wait until the browser is idle (or 2s max) before loading the chat bundle.
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const schedule = w.requestIdleCallback
      ? () => w.requestIdleCallback!(() => setMountChat(true), { timeout: 2500 })
     : () => window.setTimeout(() => setMountChat(true), 2000);
    const id = schedule();
    return () => {
      if (typeof id === "number") {
        window.clearTimeout(id);
        (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      {mountChat && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
};

export default Layout;

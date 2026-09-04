import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PreferredSourceButton from "@/components/PreferredSourceButton";
import { CITIES } from "@/data/cities";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useWebVitals } from "@/hooks/useWebVitals";

const Layout = () => {
  usePageTracking();
  useWebVitals();
  const { pathname } = useLocation();
  const hidePreferredSource = ["/admin", "/book", "/reset-password", "/unsubscribe"].some(
    (path) => pathname.startsWith(path),
  );
  const isCityPage = CITIES.some((city) => pathname === `/${city.slug}`);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      {!hidePreferredSource && (
        <PreferredSourceButton
          className={`fixed right-2 z-30 max-w-[calc(100vw-1rem)] sm:bottom-4 sm:right-4 ${
            isCityPage ? "bottom-[4.5rem]" : "bottom-2"
          }`}
        />
      )}
    </div>
  );
};

export default Layout;

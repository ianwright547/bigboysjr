import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PreferredSourceButton from "@/components/PreferredSourceButton";
import { CITIES } from "@/data/cities";

const Layout = () => {
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
          className={`fixed right-4 z-30 max-w-[calc(100vw-2rem)] shadow-lg sm:bottom-5 sm:right-5 ${
            isCityPage ? "bottom-20" : "bottom-4"
          }`}
        />
      )}
    </div>
  );
};

export default Layout;

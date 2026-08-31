import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PreferredSourceButton from "@/components/PreferredSourceButton";

const Layout = () => {
  const { pathname } = useLocation();
  const hidePreferredSource = ["/admin", "/book", "/reset-password", "/unsubscribe"].some(
    (path) => pathname.startsWith(path),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      {!hidePreferredSource && (
        <PreferredSourceButton className="fixed bottom-20 right-3 z-30 max-w-[calc(100vw-1.5rem)] shadow-lg sm:bottom-5 sm:right-5" />
      )}
    </div>
  );
};

export default Layout;

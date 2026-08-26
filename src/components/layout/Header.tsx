import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Menu, X, Home, ShoppingCart, Wrench, MessageSquare, BookOpen, ChevronDown, MapPin } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { CITIES } from "@/data/cities";
import { SERVICE_LINKS } from "@/data/services";

const NAV_LINKS = [
  { label: "Home", to: "/", icon: Home },

  { label: "Book Now", to: "/book", icon: ShoppingCart },
  {
    label: "Services",
    to: "/#services",
    icon: Wrench,
    children: [
      { label: "All Services", to: "/services" },
      ...SERVICE_LINKS.map((service) => ({ label: service.name, to: service.slug })),
    ],
  },
  {
    label: "Service Areas",
    to: "/service-areas",
    icon: MapPin,
    children: [
      { label: "All Service Areas", to: "/service-areas" },
      ...CITIES.map((city) => ({ label: `${city.name}, ${city.stateAbbr}`, to: `/${city.slug}` })),
    ],
  },
  { label: "Blog", to: "/blog", icon: BookOpen },
  { label: "Contact", to: "/request-callback", icon: MessageSquare },
];

const PHONE_NUMBER = "tel:+14706606874";
const PHONE_DISPLAY = "(470) 660-6874";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDesktopMenuOpen(null);
    setMobileMenuOpen(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden": "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (to: string) => {
    if (to.startsWith("/#")) return location.pathname === "/" && location.hash === to.slice(1);
    if (to.startsWith("/services")) return location.pathname.startsWith("/services");
    if (to === "/service-areas") return location.pathname === to || CITIES.some((city) => location.pathname === `/${city.slug}`);
    if (CITIES.some((city) => `/${city.slug}` === to)) return location.pathname === to;
    return location.pathname === to;
  };

  const handleNav = (to: string) => {
    setMenuOpen(false);
    if (to.startsWith("/#")) {
      if (location.pathname === "/") {
        const el = document.getElementById(to.slice(2));
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(to.slice(2));
          el?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-background/95 backdrop-blur shadow-sm border-b border-border"
           : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => handleNav("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={logoImg} alt="Big Boys Junk Removal logo" width={32} height={32} className="w-8 h-8 object-contain" decoding="async" />
            <span className="text-lg sm:text-xl font-bold text-foreground">Big Boys</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDesktopMenuOpen(link.label)}
                  onMouseLeave={() => setDesktopMenuOpen(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDesktopMenuOpen(null);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDesktopMenuOpen(link.label)}
                    aria-haspopup="menu"
                    aria-expanded={desktopMenuOpen === link.label}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                      isActive(link.to) ? "text-primary bg-primary/10": "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {desktopMenuOpen === link.label && (
                    <div role="menu" className={`absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-2 z-50 ${link.label === "Service Areas" ? "w-[34rem] grid grid-cols-2": "w-72"}`}>
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            location.pathname === child.to
                              ? "text-primary bg-primary/5 font-medium"
                             : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ): (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.to)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) ? "text-primary bg-primary/10": "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-muted-foreground">
              <a href={PHONE_NUMBER}>
                <Phone className="w-4 h-4 mr-1" /> {PHONE_DISPLAY}
              </a>
            </Button>
            <Button onClick={() => navigate("/book")} size="sm" className="rounded-xl font-semibold text-xs sm:text-sm px-3 sm:px-4">
              Get Instant Quote <ArrowRight className="w-4 h-4 ml-1 hidden sm:inline" />
            </Button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
              aria-label={menuOpen ? "Close menu": "Open menu"}
            >
              {menuOpen ? <X className="w-6 h-6" />: <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/95 backdrop-blur-md pt-16 overflow-y-auto"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col p-6 gap-2"
            >
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileMenuOpen(mobileMenuOpen === link.label ? null: link.label)}
                      aria-expanded={mobileMenuOpen === link.label}
                      aria-controls={`mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex items-center justify-between w-full px-4 py-4 rounded-xl text-lg font-medium transition-colors text-left ${
                        isActive(link.to) ? "bg-primary text-primary-foreground": "text-background/90 hover:bg-background/10"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        {link.label}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen === link.label ? "rotate-180": ""}`} />
                    </button>
                    {mobileMenuOpen === link.label && (
                      <div id={`mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`} className="ml-8 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <button
                            key={child.to}
                            onClick={() => handleNav(child.to)}
                            className={`block w-full text-left px-4 py-3 rounded-lg text-base transition-colors ${
                              location.pathname === child.to
                                ? "text-primary font-medium"
                               : "text-background/70 hover:text-background/90"
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ): (
                  <button
                    key={link.label}
                    onClick={() => handleNav(link.to)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors text-left ${
                      isActive(link.to) ? "bg-primary text-primary-foreground": "text-background/90 hover:bg-background/10"
                    }`}
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    {link.label}
                  </button>
                )
              )}

              <div className="border-t border-background/10 my-4" />

              <a href={PHONE_NUMBER} className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-semibold text-primary bg-primary/20">
                <Phone className="w-5 h-5" />
                Call Now: {PHONE_DISPLAY}
              </a>

              <Button onClick={() => handleNav("/book")} size="lg" className="mt-2 h-14 text-lg rounded-xl font-semibold w-full">
                Get Instant Quote <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { SERVICE_LINKS } from "@/data/services";
import PreferredSourceButton from "@/components/PreferredSourceButton";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Service Areas", to: "/service-areas" },
  { label: "Pricing / Items", to: "/book" },
  { label: "Book Now", to: "/book" },
  { label: "Blog", to: "/blog" },
  { label: "Request Callback", to: "/request-callback" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const SERVICES = SERVICE_LINKS.map(({ name, slug }) => ({ label: name, to: slug }));

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logoImg} alt="Big Boys Junk Removal" width={28} height={28} className="w-7 h-7 brightness-0 invert object-contain" decoding="async" loading="lazy" />
              <span className="text-lg font-bold">Big Boys Junk Removal</span>
            </div>
            <p className="text-background/60 leading-relaxed">
              Atlanta's top-rated junk removal service. Fast, affordable, and fully insured.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-background/70">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.to)} className="hover:text-background transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-background/70">
              {SERVICES.map((s) => (
                <li key={s.label}>
                  <button onClick={() => navigate(s.to)} className="hover:text-background transition-colors text-left">
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-3 text-background/70">
              <a href="tel:+14706606874" className="flex items-center gap-2 hover:text-background transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" /> (470) 660-6874
              </a>
              <a href="mailto:support@bigboysjr.com" className="flex items-center gap-2 hover:text-background transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" /> support@bigboysjr.com
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Serving Atlanta &amp; surrounding areas
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-background/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-bold text-background">Follow Big Boys in Google Search</p>
            <p className="mt-1 text-sm leading-relaxed text-background/60">
              Add our local guides as a preferred source to find more Big Boys tips in Google Search and AI results.
            </p>
          </div>
          <PreferredSourceButton inverted className="w-full shrink-0 sm:w-auto" />
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Big Boys Junk Removal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Licensed &amp; Insured
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

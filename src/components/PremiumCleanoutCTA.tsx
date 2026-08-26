import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2, Boxes, ShieldCheck } from "lucide-react";

const PATHS = [
  {
    icon: Home,
    name: "Estate Cleanouts",
    blurb: "Full homes cleared with care and discretion",
    to: "/services/whole-property-cleanouts",
  },
  {
    icon: Boxes,
    name: "Property Cleanouts",
    blurb: "Rentals, garages, basements, and foreclosures",
    to: "/services/cleanouts",
  },
  {
    icon: Building2,
    name: "Commercial Cleanouts",
    blurb: "Offices, retail, warehouses, and job sites",
    to: "/services/commercial-junk-removal",
  },
];

/** Premium pathway for large, high-value cleanout jobs (free on-site estimates). */
const PremiumCleanoutCTA = ({ city }: { city?: string }) => (
  <section className="bg-secondary/40 border-y border-border">
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Large-Job Division
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Need a House, Estate, or Property Cleanout{city ? ` in ${city}`: ""}?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-7">
          Full-crew, multi-truck cleanouts handled start to finish: sorting, donation, disposal, and a
          broom-swept finish. Free on-site estimates with a firm price before we begin.
        </p>
        <Link
          to="/services/whole-property-cleanouts"
          className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-primary text-primary-foreground text-base sm:text-lg font-semibold shadow-sm hover:bg-primary/90 transition-colors"
        >
          Need a House, Estate, or Property Cleanout?
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {PATHS.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group bg-card border border-border rounded-2xl p-5 text-left shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
          >
            <p.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-1.5">
              {p.name}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-muted-foreground">{p.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PremiumCleanoutCTA;

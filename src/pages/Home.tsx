import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  ListChecks,
  Truck,
  Star,
  Sofa,
  Refrigerator,
  TreePine,
  Trash2,
  Package,
  ArrowRight,
  MapPin,
  Headphones,
  Zap,
  ChevronDown,
  Flame,
  HardHat,
  BedDouble,
  Building2,
} from "lucide-react";
import truckImg from "@/assets/hero-truck.avif";
import houseImg from "@/assets/house-cleanout.avif";
import haulerImg from "@/assets/junk-hauler.avif";
import Seo from "@/components/Seo";
import { useSeoOverride } from "@/hooks/useSeoOverride";
import { CITIES } from "@/data/cities";

// AnimatedHeroBackground removed from above-the-fold for faster LCP.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const ZipForm = ({ buttonText = "Check Price", dark = false }: { buttonText?: string; dark?: boolean }) => {
  const navigate = useNavigate();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a valid 5-digit ZIP code");
      return;
    }
    localStorage.setItem("entryZip", zip);
    navigate("/book");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="text"
        inputMode="numeric"
        placeholder="Enter ZIP code"
        aria-label="ZIP code"
        maxLength={5}
        value={zip}
        onChange={(e) => {
          setZip(e.target.value.replace(/\D/g, ""));
          setError("");
        }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className={`h-14 text-lg rounded-xl border-2 text-center sm:text-left sm:flex-1 focus-visible:ring-primary ${dark ? "bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60": ""}`}
      />
      <Button
        onClick={submit}
        size="lg"
        className={`h-14 px-8 text-lg rounded-xl font-semibold whitespace-nowrap ${dark ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90": ""}`}
      >
        {buttonText} <ArrowRight className="w-5 h-5 ml-1" />
      </Button>
      {error && <p className={`text-sm ${dark ? "text-primary-foreground/80": "text-destructive"} sm:absolute sm:bottom-[-1.5rem]`}>{error}</p>}
    </div>
  );
};

/* ─── Hero ─── */
/* Above-the-fold: NO framer-motion, NO lazy SVG bg: pure HTML for fastest LCP */
const Hero = ({ heading }: { heading?: string }) => (
  <section className="relative overflow-hidden bg-background">
    <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 flex flex-col lg:flex-row items-center gap-10">
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-4">
          {heading || "Junk Removal in Atlanta"}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
          Get instant upfront pricing with same-day junk removal for furniture, appliances, and full cleanouts. No hidden fees. No waiting for quotes.
        </p>
        <div className="flex flex-col items-center lg:items-start gap-3">
          <ZipForm />
          <p className="text-sm text-muted-foreground">Takes 30 seconds • No obligation</p>
        </div>
      </div>
      <div className="flex-1 max-w-md lg:max-w-lg">
        <img
          src="/photos/atlanta-junk-removal-job.jpg"
          alt="Furniture and household items prepared for a Big Boys junk removal pickup in Metro Atlanta"
          width={900}
          height={1200}
          loading="eager"
          // @ts-expect-error fetchpriority is a valid HTML attribute, React types lag behind
          fetchpriority="high"
          decoding="async"
          className="w-full aspect-[4/3] object-cover rounded-2xl border border-border shadow-lg"
        />
      </div>
    </div>
  </section>
);

/* ─── Live Agent CTA ─── */
const LiveAgentSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-background pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="bg-accent/50 border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Headphones className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-1">Speak to a Live Agent</h3>
            <p className="text-sm text-muted-foreground mb-2">Not sure what you need? Talk to a real person instantly.</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary justify-center sm:justify-start">
              <Zap className="w-3.5 h-3.5" /> Usually responds in 1-2 minutes
            </div>
          </div>
          <Button
            onClick={() => navigate("/request-callback")}
            variant="outline"
            size="lg"
            className="rounded-xl font-semibold whitespace-nowrap"
          >
            Request a Callback
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Trust Bar ─── */
const TRUST = [
  { icon: ShieldCheck, text: "Fully insured" },
  { icon: Users, text: "Background-checked crews" },
  { icon: Clock, text: "Same-day service available" },
  { icon: Star, text: "5-star rated" },
];

const TrustBar = () => (
  <section className="bg-secondary/60 border-y border-border">
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
      {TRUST.map((t) => (
        <div key={t.text} className="flex items-center gap-2 text-sm font-medium text-foreground">
          <t.icon className="w-5 h-5 text-primary flex-shrink-0" />
          {t.text}
        </div>
      ))}
    </div>
  </section>
);

/* ─── Interactive Before and After ─── */
const BeforeAfter = () => {
  const [position, setPosition] = useState(52);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Real Local Result</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">See the Space Come Back</h2>
          <p className="text-muted-foreground">Drag the handle to compare a Metro Atlanta garage before and after the pickup.</p>
        </div>

        <div className="relative max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border bg-muted shadow-lg aspect-[4/3]">
          <img
            src="/photos/garage-cleanout-after.jpg"
            alt="Garage after a Big Boys junk removal pickup"
            width={900}
            height={1200}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <img
              src="/photos/garage-cleanout-before.jpg"
              alt="Garage filled with furniture, boxes, and household items before junk removal"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-y-0 w-0.5 bg-white shadow-md pointer-events-none" style={{ left: `${position}%` }}>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-foreground font-semibold">↔</span>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-foreground/85 px-3 py-1.5 text-xs font-semibold text-background">Before</span>
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">After</span>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Compare the garage before and after junk removal"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">The crew handled the lifting, loading, and haul-away.</p>
      </div>
    </section>
  );
};

/* ─── How It Works ─── */
const STEPS = [
  { num: 1, title: "Enter your ZIP code", desc: "We'll check if we serve your area.", icon: MapPin },
  { num: 2, title: "Choose your pricing method", desc: "Price by item or by load size.", icon: ListChecks },
  { num: 3, title: "Get instant price & book", desc: "See your total and pick a time for same-day or next-day pickup.", icon: CheckCircle2 },
];

const HowItWorks = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="max-w-5xl mx-auto px-4">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12"
      >
        How Junk Removal Works
      </motion.h2>
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-8 flex-1">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-start gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <s.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Step {s.num}</p>
                <h3 className="text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 w-full max-w-sm lg:max-w-md"
        >
          <img src={truckImg} alt="Big Boys Junk Removal truck ready for pickup" width={464} height={346} loading="lazy" className="w-full h-auto rounded-2xl shadow-lg" />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Pricing Explainer ─── */
const PricingExplainer = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-muted/40 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 w-64 sm:w-80 lg:w-96"
          >
            <img src={houseImg} alt="3D illustration of home cleanout with furniture and junk items" width={900} height={894} loading="lazy" decoding="async" className="w-full h-auto" />
          </motion.div>
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            >
              Instant Junk Removal Pricing
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground mb-8 max-w-2xl"
            >
              Two transparent ways to price your junk removal job. No hidden fees, no haggling: what you see is what you pay.
            </motion.p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: ListChecks,
              title: "Price by Item",
              bullets: ["Great for specific items", "Transparent per-item pricing", "50+ items to choose from"],
            },
            {
              icon: Truck,
              title: "Price by Load Size",
              bullets: ["Best for bulk junk", "Visual trailer selector", "8 load levels from $99"],
            },
          ].map((opt, i) => (
            <motion.div
              key={opt.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <opt.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{opt.title}</h3>
              <ul className="space-y-2 mb-5">
                {opt.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button onClick={() => navigate("/book")} size="lg" className="h-14 px-10 text-lg rounded-xl font-semibold">
            Start Pricing <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

/* ─── Reviews ─── */
const REVIEWS = [
  { name: "Jacinta Robinson", title: "Fast same-day service", quote: "They showed up the same morning I needed help removing a broken down king bed and some other boxes. Great service and price!", stars: 5 },
  { name: "Oceania Fit", title: "Quick & efficient", quote: "Great service! Quick and efficient!", stars: 5 },
  { name: "Lola", title: "Professional and on time", quote: "I called Big Boys to remove two sofas. They came on time, were very professional, and had the sofas out in less than 20 minutes.", stars: 5 },
  { name: "Christal Hardaway", title: "Highly recommend", quote: "The guys did a great job. Prompt and quick service. Highly recommend.", stars: 5 },
  { name: "Joseph Maggio", title: "Would definitely use again", quote: "They were professional, courteous, and great to work with. Will definitely use them again.", stars: 5 },
  { name: "Katelyn Marie", title: "Quick and easy basement cleanout", quote: "Got everything we needed out quickly and neatly. Amazing service!", stars: 5 },
  { name: "Rebecca Stopper", title: "Same-day service saved me", quote: "Came out same day I called which was great! Very pleasant workers and extremely efficient.", stars: 5 },
  { name: "Sudagar Sundaram", title: "Fast sofa removal", quote: "On time. Did a great job of removing our sofa & loveseat. Will call them again.", stars: 5 },
  { name: "Aurora Cardella", title: "Professional experience", quote: "Great experience! Smooth booking and estimate process. Efficient and polite employees.", stars: 5 },
  { name: "Donald Crowe", title: "On time & good pricing", quote: "These guys are great. Arrived on time. Good pricing and really cleaned up my basement.", stars: 5 },
  { name: "Taylor Walsh", title: "Fast furniture removal", quote: "They came in and out quickly, got my washer and dryer out no problems. Definitely would call again.", stars: 5 },
  { name: "N.R.", title: "Super fast sectional removal", quote: "Super fast, efficient service. Removed my sectional in 5 mins.", stars: 5 },
  { name: "Shannon Bryan", title: "Reliable and professional", quote: "Awesome service! Friendly, quick, and efficient!", stars: 5 },
  { name: "Christian Bukuru", title: "Best junk removal in Atlanta", quote: "The Best junk removal in Atlanta Georgia ❤️💪", stars: 5 },
  { name: "Gopa Bhattacharya", title: "Highly recommended", quote: "Very professional and easy pickup. Highly recommended.", stars: 5 },
];

const SocialProof = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const visible = showAll ? REVIEWS: REVIEWS.slice(0, 6);

  // Auto-cycle carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4"
        >
          What Our Customers Say
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-center text-muted-foreground mb-10"
        >
          Rated 5.0 ★ from {REVIEWS.length}+ verified reviews
        </motion.p>

        {/* Rotating Carousel Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          className="mb-12"
        >
          <div className="relative bg-primary rounded-2xl p-8 sm:p-10 text-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1 justify-center mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-primary-foreground text-primary-foreground" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-semibold text-primary-foreground mb-1">
                  "{REVIEWS[activeIndex].title}"
                </p>
                <p className="text-sm sm:text-base text-primary-foreground/80 max-w-xl mx-auto mb-4">
                  {REVIEWS[activeIndex].quote}
                </p>
                <p className="text-sm font-bold text-primary-foreground/90">
                 : {REVIEWS[activeIndex].name}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? "bg-primary-foreground w-6": "bg-primary-foreground/30"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((r, i) => (
            <motion.div
              key={r.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i % 3}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm"
            >
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{r.title}</p>
              <p className="text-sm text-muted-foreground mb-3">"{r.quote}"</p>
              <p className="text-xs font-semibold text-muted-foreground">: {r.name}</p>
            </motion.div>
          ))}
        </div>
        {!showAll && REVIEWS.length > 6 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => setShowAll(true)} className="rounded-xl font-semibold">
              Show All {REVIEWS.length} Reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── Services Grid with links ─── */
const SERVICES = [
  { icon: Sofa, name: "Furniture Removal", slug: "/services/furniture-removal" },
  { icon: Refrigerator, name: "Appliance Removal", slug: "/services/appliance-removal" },
  { icon: BedDouble, name: "Mattress Removal", slug: "/services/mattress-removal" },
  { icon: Flame, name: "Hot Tub Removal", slug: "/services/hot-tub-removal" },
  { icon: TreePine, name: "Yard Waste Removal", slug: "/services/yard-waste-removal" },
  { icon: Trash2, name: "General Junk Removal", slug: "/services/junk-removal" },
  { icon: Package, name: "Garage & Basement Cleanouts", slug: "/services/cleanouts" },
  { icon: HardHat, name: "Construction Debris", slug: "/services/construction-debris" },
  { icon: Building2, name: "Commercial Junk Removal", slug: "/services/commercial-junk-removal" },
  { icon: Package, name: "Whole-Property Cleanouts", slug: "/services/whole-property-cleanouts" },
];

const ServiceList = ({ id }: { id?: string }) => (
  <section id={id} className="bg-muted/40 py-16 sm:py-24">
    <div className="max-w-5xl mx-auto px-4">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4"
      >
        Junk Removal Services We Offer
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={1}
        className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
      >
        We haul it all: from single items to full property cleanouts across multiple cities and metro areas.
      </motion.p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
          >
            <Link
              to={s.slug}
              className="flex flex-col items-center gap-3 bg-card border border-border rounded-xl px-4 py-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-center group"
            >
              <s.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Service Area ─── */
const ServiceArea = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-10 mb-10">
        <div className="flex-1 text-center lg:text-left">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Find Service Near You
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground max-w-2xl"
          >
            Big Boys Junk Removal serves multiple cities and surrounding metro areas. Same-day junk removal available in most locations. Find your city below.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 w-48 sm:w-56"
        >
          <img src={haulerImg} alt="Big Boys junk removal crew member carrying items" width={680} height={960} loading="lazy" className="w-full h-auto" />
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {CITIES.map((city) => (
          <Link key={city.slug} to={`/${city.slug}`} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
            Junk Removal in {city.name} →
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ─── FAQ with Schema ─── */
const FAQS = [
  {
    q: "How much does junk removal cost?",
    a: "Prices start at $99 for a small load. Single item removal starts at $49. Use our instant pricing tool to get an exact quote in seconds: no obligation.",
  },
  {
    q: "Do you offer same-day junk removal?",
    a: "Yes! We offer same-day service in most of our service areas. Book online and we can often arrive within hours.",
  },
  {
    q: "What items do you remove?",
    a: "We remove furniture, appliances, mattresses, hot tubs, yard waste, construction debris, electronics, and general household junk. If you can point to it, we can haul it.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Absolutely. Big Boys Junk Removal is fully licensed and insured. Our crews are background-checked for your safety and peace of mind.",
  },
  {
    q: "How does your instant pricing work?",
    a: "Enter your ZIP code, choose to price by item or load size, and get a transparent price instantly. No on-site estimates, no hidden fees: what you see is what you pay.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve multiple cities and surrounding metro areas, including Atlanta, Marietta, Decatur, Roswell, Alpharetta, Sandy Springs, Kennesaw, Smyrna, Suwanee, Buford, Lawrenceville, and more.",
  },
  {
    q: "Do I need to move the junk outside?",
    a: "No. The crew can remove approved items from inside your home, garage, apartment, office, or storage area. Clear a path when practical, but leave the lifting and loading to the team.",
  },
  {
    q: "How should I prepare for a junk removal appointment?",
    a: "Identify everything that should go, remove personal documents and valuables, and share any stairs, gate codes, elevator rules, parking limits, or disassembly needs when you book.",
  },
  {
    q: "Can you remove items from upstairs or tight spaces?",
    a: "Yes. Include stairs, narrow doors, elevators, long carries, and other access details with your request so the crew can plan the job correctly.",
  },
  {
    q: "What items can you not take?",
    a: "Hazardous or regulated materials such as paint, solvents, asbestos, medical waste, and some automotive fluids require specialized disposal. Contact the team if you are unsure about an item.",
  },
  {
    q: "Do you handle apartments, rentals, offices, and commercial properties?",
    a: "Yes. Provide the property type, authorized contact, loading or parking instructions, building rules, and the areas that need to be cleared.",
  },
  {
    q: "What happens to items after pickup?",
    a: "Items are evaluated for appropriate disposal, recycling, or donation when practical. The available option depends on the item's condition, material, and local facility requirements.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-muted/40 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null: i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm sm:text-base font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180": ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <section className="bg-primary py-16 sm:py-24">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3"
      >
        Ready to Get Rid of Your Junk?
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={1}
        className="text-primary-foreground/80 mb-8"
      >
        Get your price in seconds, no commitment. Fast junk removal with upfront pricing.
      </motion.p>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={2}
        className="flex justify-center"
      >
        <ZipForm buttonText="Get My Price" dark />
      </motion.div>
    </div>
  </section>
);

/* ─── Page ─── */
const Home = () => {
  const seo = useSeoOverride("/");
  const title = seo?.title || "Junk Removal in Atlanta, GA | Big Boys Junk Removal";
  const description = seo?.description || "Book same-day junk removal in Atlanta with upfront online pricing for furniture, appliances, cleanouts, yard debris, and commercial junk.";

  return <div className="scroll-smooth">
    <Seo
      title={title}
      description={description}
      path="/"
      geoPlace="Atlanta, Georgia"
    />
    <Hero heading={seo?.h1 || undefined} />
    <LiveAgentSection />
    <TrustBar />
    <BeforeAfter />
    <ServiceList id="services" />
    <HowItWorks />
    <ServiceArea />
    <SocialProof />
    <PricingExplainer />
    <FAQSection />
    <FinalCTA />
  </div>;
};

export default Home;

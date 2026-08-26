import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck, Clock, Users, CheckCircle2, ListChecks, Truck, Star,
  ArrowRight, MapPin, Headphones, Zap, ChevronDown, Phone,
} from "lucide-react";
import heroIsometric from "@/assets/hero-isometric.avif";
import truckImg from "@/assets/hero-truck.avif";
import houseImg from "@/assets/house-cleanout.avif";
import haulerImg from "@/assets/junk-hauler.avif";
import type { CityData } from "@/data/cities";
import { CITIES } from "@/data/cities";
import { SERVICE_LINKS as SERVICES } from "@/data/services";
import { useSeoOverride } from "@/hooks/useSeoOverride";
import PremiumCleanoutCTA from "@/components/PremiumCleanoutCTA";
import Seo from "@/components/Seo";

const AnimatedHeroBackground = lazy(() => import("@/components/AnimatedHeroBackground"));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const PHONE_NUMBER = "tel:+14706606874";
const PHONE_DISPLAY = "(470) 660-6874";

/* ─── ZIP Form ─── */
const ZipForm = ({ buttonText = "Check Price", dark = false, city }: { buttonText?: string; dark?: boolean; city: string }) => {
  const navigate = useNavigate();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^\d{5}$/.test(zip)) { setError("Enter a valid 5-digit ZIP code"); return; }
    localStorage.setItem("entryZip", zip);
    navigate("/book");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="text" inputMode="numeric" placeholder="Enter ZIP code"
        aria-label="ZIP code" maxLength={5}
        value={zip}
        onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className={`h-14 text-lg rounded-xl border-2 text-center sm:text-left sm:flex-1 focus-visible:ring-primary ${dark ? "bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60": ""}`}
      />
      <Button onClick={submit} size="lg" className={`h-14 px-8 text-lg rounded-xl font-semibold whitespace-nowrap ${dark ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90": ""}`}>
        {buttonText} <ArrowRight className="w-5 h-5 ml-1" />
      </Button>
      {error && <p className={`text-sm ${dark ? "text-primary-foreground/80": "text-destructive"} sm:absolute sm:bottom-[-1.5rem]`}>{error}</p>}
    </div>
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

/* ─── Services ─── */

const TRUST = [
  { icon: ShieldCheck, text: "Fully insured" },
  { icon: Users, text: "Background-checked crews" },
  { icon: Clock, text: "Same-day service available" },
  { icon: Star, text: "5-star rated" },
];

const FAQS_FOR_CITY = (city: string) => [
  { q: `How much does junk removal cost in ${city}?`, a: `Prices start at $99 for a small load. Single item removal starts at $49. Use our instant pricing tool to get an exact quote in seconds: no obligation.` },
  { q: `Do you offer same-day junk removal in ${city}?`, a: `Yes! We offer same-day service in ${city} and surrounding areas. Book online and we can often arrive within hours.` },
  { q: "What items do you remove?", a: "We remove furniture, appliances, mattresses, hot tubs, yard waste, construction debris, electronics, and general household junk. If you can point to it, we can haul it." },
  { q: "Are you licensed and insured?", a: "Absolutely. Big Boys Junk Removal is fully licensed and insured. Our crews are background-checked for your safety and peace of mind." },
  { q: "How does your instant pricing work?", a: "Enter your ZIP code, choose to price by item or load size, and get a transparent price instantly. No on-site estimates, no hidden fees: what you see is what you pay." },
  { q: `What areas near ${city} do you serve?`, a: `We serve ${city} and all surrounding communities within a 50-mile radius. Same-day junk removal available in most locations.` },
  { q: `Do you remove junk from apartments and businesses in ${city}?`, a: `Yes. We handle residential, rental, office, retail, storage, and commercial pickups in ${city}. Share any loading, parking, elevator, gate, or building-access instructions when booking.` },
  { q: "Do I need to carry items outside before the crew arrives?", a: "No. The crew can remove approved items from the agreed location. Identify what should go, protect anything staying behind, and clear a safe path when practical." },
  { q: "What details help make an online estimate accurate?", a: "Include the item list or estimated load size, stairs, disassembly, long carries, unusually heavy material, and access restrictions. The final scope is confirmed before work begins." },
  { q: "Can you take paint, chemicals, or other hazardous materials?", a: "Hazardous and regulated materials require specialized disposal and are not included in standard junk removal. Contact the team before booking if you are unsure about an item." },
];

/* ═════════════════════ MAIN COMPONENT ═════════════════════ */

const CityLandingPage = ({ city }: { city: CityData }) => {
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const visibleReviews = showAllReviews ? REVIEWS: REVIEWS.slice(0, 6);
  const faqs = FAQS_FOR_CITY(city.name);
  const linkedCities = CITIES.filter((c) => city.nearbyCitySlugs.includes(c.slug));

  useEffect(() => {
    const interval = setInterval(() => setActiveReview((p) => (p + 1) % REVIEWS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top on city change
  useEffect(() => { window.scrollTo(0, 0); }, [city.slug]);

  const seoOverride = useSeoOverride(`/${city.slug}`);
  const fullTitle = seoOverride?.title || `Junk Removal in ${city.name}, ${city.stateAbbr} | Big Boys Junk Removal`;
  const metaDesc = seoOverride?.description || `Fast junk removal in ${city.name}. Same-day service for furniture, appliances, cleanouts & more. Get instant pricing and book online today.`;

  return (
    <div className="scroll-smooth">
      <Seo
        title={fullTitle}
        description={metaDesc}
        path={`/${city.slug}`}
        geoPlace={`${city.name}, ${city.state}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `https://bigboysjr.com/${city.slug}#business`,
          name: `Big Boys Junk Removal: ${city.name}`,
          description: metaDesc,
          url: `https://bigboysjr.com/${city.slug}`,
          telephone: "+14706606874",
          email: "support@bigboysjr.com",
          image: "https://bigboysjr.com/hero-isometric.avif",
          logo: "https://bigboysjr.com/logo-128.png",
          priceRange: "$$",
          parentOrganization: { "@id": "https://bigboysjr.com/#organization" },
          isPartOf: { "@id": "https://bigboysjr.com/#website" },
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.stateAbbr,
            postalCode: city.zip,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
          areaServed: [
            {
              "@type": "GeoCircle",
              geoMidpoint: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
              geoRadius: String(city.radiusMeters ?? 25000),
            },
            { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: city.state } },
            ...city.nearbyAreas.map((area) => ({ "@type": "Place", name: `${area}, ${city.stateAbbr}` })),
          ],
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "19:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:00", closes: "17:00" },
          ],
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127" },
          potentialAction: {
            "@type": "OrderAction",
            target: "https://bigboysjr.com/book",
            name: `Book Junk Removal in ${city.name}`,
          },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Junk Removal",
          name: `Junk Removal in ${city.name}, ${city.stateAbbr}`,
          provider: { "@type": "LocalBusiness", "@id": `https://bigboysjr.com/${city.slug}#business` },
          brand: { "@id": "https://bigboysjr.com/#organization" },
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
            geoRadius: String(city.radiusMeters ?? 25000),
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Junk Removal Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Furniture Removal" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Appliance Removal" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mattress Disposal" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hot Tub Removal" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yard Waste Removal" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Garage & Basement Cleanouts" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Construction Debris Removal" } },
            ],
          },
          description: `Professional same-day junk removal services in ${city.name}, ${city.stateAbbr}. Furniture, appliance, mattress, and full property cleanouts.`,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://bigboysjr.com/" },
            { "@type": "ListItem", position: 2, name: `Junk Removal in ${city.name}`, item: `https://bigboysjr.com/${city.slug}` },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        })}</script>
      </Helmet>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Suspense fallback={null}>
            <AnimatedHeroBackground className="w-full h-full max-w-6xl" opacity={0.144} />
          </Suspense>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 flex flex-col lg:flex-row items-center gap-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex-1 text-center lg:text-left">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-4">
              {seoOverride?.h1 || `Junk Removal in ${city.name}, ${city.stateAbbr}`}
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Same-day junk removal, furniture pickup, and cleanouts in {city.name}. Get instant pricing and book online in minutes.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col items-center lg:items-start gap-3">
              <ZipForm buttonText={`Get Quote in ${city.name}`} city={city.name} />
              <p className="text-sm text-muted-foreground">Takes 30 seconds • No obligation</p>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1 max-w-md lg:max-w-lg">
            <img src={heroIsometric} alt={`3D illustration of junk removal service in ${city.name} ${city.stateAbbr}`} width={464} height={464} loading="eager" className="w-full h-auto rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ─── PREMIUM CLEANOUT PATHWAY ─── */}
      <PremiumCleanoutCTA city={city.name} />

      {/* ─── LIVE AGENT ─── */}
      <section className="bg-background pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="bg-accent/50 border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><Headphones className="w-7 h-7" /></div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">Speak to a Live Agent</h3>
              <p className="text-sm text-muted-foreground mb-2">Not sure what you need? Talk to a real person instantly.</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary justify-center sm:justify-start"><Zap className="w-3.5 h-3.5" /> Usually responds in 1-2 minutes</div>
            </div>
            <Button onClick={() => navigate("/request-callback")} variant="outline" size="lg" className="rounded-xl font-semibold whitespace-nowrap">Request a Callback</Button>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-secondary/60 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {TRUST.map((t) => (
            <div key={t.text} className="flex items-center gap-2 text-sm font-medium text-foreground"><t.icon className="w-5 h-5 text-primary flex-shrink-0" />{t.text}</div>
          ))}
        </div>
      </section>

      {/* ─── LOCAL SEO CONTENT ─── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-6">
            Junk Removal Services in {city.name}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="prose prose-sm sm:prose-base max-w-3xl mx-auto text-muted-foreground">
            <p>
              Looking for reliable <strong>junk removal in {city.name}</strong>? Big Boys Junk Removal provides fast, affordable, and professional junk hauling services across {city.name}, {city.stateAbbr} and the surrounding areas. Whether you need <strong>furniture removal in {city.name}</strong>, <strong>mattress disposal</strong>, <strong>garage cleanouts</strong>, or <strong>same-day junk hauling</strong>, our local crew is ready to help.
            </p>
            <p>
              We pride ourselves on <strong>fast response times in {city.name}</strong>, upfront transparent pricing with no hidden fees, and a local crew that knows the {city.name} area inside and out. From single-item pickups to full property cleanouts, Big Boys is {city.name}'s trusted junk removal company.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
            How Junk Removal Works in {city.name}
          </motion.h2>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-8 flex-1">
              {[
                { num: 1, title: "Enter your ZIP code", desc: `We'll confirm service availability in ${city.name}.`, icon: MapPin },
                { num: 2, title: "Choose your pricing method", desc: "Price by item or by load size.", icon: ListChecks },
                { num: 3, title: "Get instant price & book", desc: "See your total and pick a time for same-day or next-day pickup.", icon: CheckCircle2 },
              ].map((s, i) => (
                <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><s.icon className="w-7 h-7" /></div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Step {s.num}</p>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
              <img src={truckImg} alt={`Big Boys Junk Removal truck serving ${city.name}`} width={464} height={346} loading="lazy" className="w-full h-auto rounded-2xl shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PRICING EXPLAINER ─── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-shrink-0 w-64 sm:w-80 lg:w-96">
              <img src={houseImg} alt={`Home cleanout illustration for ${city.name}`} width={966} height={960} loading="lazy" className="w-full h-auto" />
            </motion.div>
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Instant Junk Removal Pricing in {city.name}
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-muted-foreground mb-8 max-w-2xl">
                Two transparent ways to price your {city.name} junk removal job. No hidden fees, no haggling: what you see is what you pay.
              </motion.p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: ListChecks, title: "Price by Item", bullets: ["Great for specific items", "Transparent per-item pricing", "50+ items to choose from"] },
              { icon: Truck, title: "Price by Load Size", bullets: ["Best for bulk junk", "Visual trailer selector", "8 load levels from $99"] },
            ].map((opt, i) => (
              <motion.div key={opt.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4"><opt.icon className="w-6 h-6" /></div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{opt.title}</h3>
                <ul className="space-y-2 mb-5">
                  {opt.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> {b}</li>
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

      {/* ─── SERVICES (CITY-FOCUSED) ─── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
            Junk Removal Services in {city.name}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We haul it all: from single items to full property cleanouts across {city.name}, {city.stateAbbr} and surrounding areas.
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES.map((s, i) => (
              <motion.div key={s.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={s.slug} className="flex flex-col items-center gap-3 bg-card border border-border rounded-xl px-4 py-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-center group">
                  <s.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-foreground">{s.name} in {city.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST SECTION (LOCALIZED) ─── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Trusted Junk Removal Company in {city.name}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Big Boys Junk Removal is {city.name}'s go-to choice for fast, reliable junk hauling. Licensed, insured, and backed by 5-star reviews.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Licensed & Insured", desc: "Full liability coverage for every job." },
              { icon: Clock, title: `Same-Day in ${city.name}`, desc: "Book now, we arrive today." },
              { icon: Star, title: "5-Star Reviews", desc: "Consistently rated 5 stars by local customers." },
              { icon: Users, title: "Local Crew", desc: `Our team knows ${city.name} inside and out.` },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><item.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS (CITY-CONTEXTUALIZED) ─── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
            What {city.name} Customers Say
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-center text-muted-foreground mb-10">
            Rated 5.0 ★ from {REVIEWS.length}+ verified reviews
          </motion.p>

          {/* Carousel */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mb-12">
            <div className="relative bg-primary rounded-2xl p-8 sm:p-10 text-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={activeReview} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                  <div className="flex gap-1 justify-center mb-3">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-5 h-5 fill-primary-foreground text-primary-foreground" />)}
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-primary-foreground mb-1">"{REVIEWS[activeReview].title}"</p>
                  <p className="text-sm sm:text-base text-primary-foreground/80 max-w-xl mx-auto mb-4">{REVIEWS[activeReview].quote}</p>
                  <p className="text-sm font-bold text-primary-foreground/90">: {REVIEWS[activeReview].name}, Customer in {city.name}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-1.5 mt-6">
                {REVIEWS.map((_, i) => (
                  <button key={i} onClick={() => setActiveReview(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeReview ? "bg-primary-foreground w-6": "bg-primary-foreground/30"}`} aria-label={`Go to review ${i + 1}`} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReviews.map((r, i) => (
              <motion.div key={r.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 3} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex gap-0.5 mb-2">{Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
                <p className="text-sm font-semibold text-foreground mb-1">{r.title}</p>
                <p className="text-sm text-muted-foreground mb-3">"{r.quote}"</p>
                <p className="text-xs font-semibold text-muted-foreground">: {r.name}</p>
              </motion.div>
            ))}
          </div>
          {!showAllReviews && REVIEWS.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => setShowAllReviews(true)} className="rounded-xl font-semibold">Show All {REVIEWS.length} Reviews</Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── SERVICE AREA MAP ─── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-10">
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Serving {city.name} &amp; Surrounding Areas
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl">
                Big Boys Junk Removal proudly serves {city.name} and all nearby communities within a 50-mile radius. Same-day junk removal available in most locations.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-shrink-0 w-48 sm:w-56">
              <img src={haulerImg} alt={`Big Boys junk removal crew serving ${city.name}`} width={680} height={960} loading="lazy" className="w-full h-auto" />
            </motion.div>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-3 mb-10">
            {city.nearbyAreas.map((area) => (
              <span key={area} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="w-3.5 h-3.5" /> {area}
              </span>
            ))}
          </motion.div>

          {/* Map embed */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe
              title={`Service area map for ${city.name}`}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(city.mapEmbedQuery)}&zoom=11`}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions: {city.name}
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null: i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm sm:text-base font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180": ""}`} />
                </button>
                {faqOpen === i && <div className="px-5 pb-5 pt-0"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTERNAL LINKING ─── */}
      <section className="bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold text-foreground text-center mb-6">Junk Removal in Nearby Cities</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {linkedCities.map((c) => (
              <Link key={c.slug} to={`/${c.slug}`} className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Junk Removal in {c.name}
              </Link>
            ))}
            <Link to="/book" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              View Pricing
            </Link>
            <Link to="/" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STICKY CTA BAR (Mobile) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex gap-2 lg:hidden">
        <Button onClick={() => navigate("/book")} className="flex-1 h-12 rounded-xl font-semibold">
          Get Quote <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button variant="outline" asChild className="h-12 rounded-xl font-semibold">
          <a href={PHONE_NUMBER}><Phone className="w-4 h-4 mr-1" /> Call</a>
        </Button>
      </div>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-primary py-16 sm:py-24 mb-16 lg:mb-0">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
            Ready to Get Rid of Your Junk in {city.name}?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-primary-foreground/80 mb-8">
            {city.name}'s fastest junk removal: get your price in seconds, no commitment.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="flex justify-center">
            <ZipForm buttonText="Get My Price" dark city={city.name} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CityLandingPage;

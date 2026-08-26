import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Star, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CITIES } from "@/data/cities";
import { SERVICE_LINKS } from "@/data/services";
import { useSeoOverride } from "@/hooks/useSeoOverride";
import Seo from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const commonServiceFaqs = (service: string) => [
  {
    q: `How should I prepare for ${service.toLowerCase()}?`,
    a: "Identify everything that should go, remove personal documents and valuables, and mention stairs, elevators, gates, parking limits, or disassembly needs when you book.",
  },
  {
    q: "Do I need to move everything to the curb?",
    a: "No. The crew can remove approved items from inside the home, garage, office, storage area, or other agreed pickup location. Clear access when practical, but leave the heavy lifting to the team.",
  },
  {
    q: "What can change the final price?",
    a: "The amount of material, item type, weight, stairs, disassembly, long carries, access, and any items added after booking can affect the final scope. The crew confirms the work before removal begins.",
  },
  {
    q: "Can I schedule service for an apartment, rental, or business?",
    a: "Yes. Provide building access, parking or loading instructions, gate codes, elevator rules, and the name of the person authorized to approve the pickup.",
  },
];

export interface ServicePageData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  icon: LucideIcon;
  intro: string;
  benefits: string[];
  howItWorks: string[];
  whyUs: string[];
  faq: { q: string; a: string }[];
  ctaText: string;
}

const ServicePageTemplate = ({ data }: { data: ServicePageData }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const otherServices = SERVICE_LINKS.filter((s) => s.slug !== pathname);
  const seo = useSeoOverride(pathname);

  const metaTitle = seo?.title || data.metaTitle;
  const metaDescription = seo?.description || data.metaDescription;
  const heroHeading = seo?.h1 || data.heroHeading;
  const faqs = [...data.faq, ...commonServiceFaqs(data.title)];
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    serviceType: data.title,
    description: metaDescription,
    url: `https://bigboysjr.com${pathname}`,
    provider: { "@id": "https://bigboysjr.com/#business" },
    areaServed: { "@type": "State", name: "Georgia" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bigboysjr.com/" },
      { "@type": "ListItem", position: 2, name: data.title, item: `https://bigboysjr.com${pathname}` },
    ],
  };

  return (
    <>
      <Seo title={metaTitle} description={metaDescription} path={pathname} schemas={[serviceSchema, breadcrumbSchema]} />

      <div className="scroll-smooth">
        {/* Hero */}
        <section className="bg-background pt-16 pb-12 sm:pt-24 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <data.icon className="w-8 h-8" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">{heroHeading}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{data.heroSubheading}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/book")} size="lg" className="h-14 px-10 text-lg rounded-xl font-semibold">
                  Get Instant Price <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg rounded-xl font-semibold">
                  <a href="tel:+14706606874"><Phone className="w-5 h-5 mr-2" /> (470) 660-6874</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust */}
        <section className="bg-secondary/60 border-y border-border">
          <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheck, text: "Fully insured" },
              { icon: Clock, text: "Same-day service" },
              { icon: Star, text: "4.9★ rated" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <t.icon className="w-4 h-4 text-primary" /> {t.text}
              </div>
            ))}
          </div>
        </section>

        {/* Intro */}
        <section className="bg-background py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">{data.intro}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">What's Included</h2>
              <ul className="space-y-3">
                {data.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/40 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center"
            >
              How {data.title} Works
            </motion.h2>
            <div className="space-y-6">
              {data.howItWorks.map((step, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex gap-4 items-start"
                >
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm sm:text-base text-foreground pt-1">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="bg-background py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center"
            >
              Why Choose Big Boys for {data.title}?
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.whyUs.map((reason, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <p className="text-sm text-foreground font-medium">{reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Planning and pricing context */}
        <section className="bg-background py-16 sm:py-20 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Planning Your {data.title} Pickup</h2>
              <p className="text-muted-foreground leading-relaxed">
                A few job details help the crew plan the right amount of space, labor, and time before arrival. You can provide them during online booking and confirm the final scope before removal begins.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <article className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">Amount and item type</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Choose individual items when the list is clear, or estimate trailer space for mixed piles and larger cleanouts.</p>
              </article>
              <article className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">Access and labor</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Mention stairs, long carries, tight doorways, disassembly needs, gates, parking limits, and other access details.</p>
              </article>
              <article className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">Pickup timing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Select a preferred date and time window. Same-day requests depend on route capacity and the scope of the job.</p>
              </article>
            </div>
            <div className="mt-8 bg-primary/5 border border-primary/15 rounded-xl p-5 sm:p-6">
              <h3 className="font-semibold text-foreground mb-2">Before the crew arrives</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Identify everything that should go, separate personal documents or valuables, and keep a clear path when practical. You do not need to move bulky items to the curb; the crew handles the lifting and loading from the agreed pickup area.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bg-muted/40 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions About {data.title}</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  }),
                }}
              />
            </div>
          </section>
        )}

        {/* Internal links: cities + related services */}
        <section className="bg-muted/40 py-14 sm:py-16 border-t border-border">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
              {data.title} Near You
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide {data.title.toLowerCase()} across Metro Atlanta and North Georgia: pick your city for local pricing and availability.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {CITIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}`}
                  className="bg-card border border-border text-foreground px-4 py-2 rounded-full text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {data.title} in {c.name}, {c.stateAbbr}
                </Link>
              ))}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
              Related Junk Removal Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  to={s.slug}
                  className="flex flex-col items-center gap-3 bg-card border border-border rounded-xl px-4 py-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-center group"
                >
                  <s.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">{data.ctaText}</h2>
            <p className="text-primary-foreground/80 mb-8">Get your price in seconds: no obligation.</p>
            <Button
              onClick={() => navigate("/book")}
              size="lg"
              className="h-14 px-10 text-lg rounded-xl font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Get Instant Quote <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePageTemplate;

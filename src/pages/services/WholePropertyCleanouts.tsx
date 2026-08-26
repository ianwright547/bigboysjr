import { Helmet } from "react-helmet-async";
import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Home } from "lucide-react";

const CANONICAL = "https://bigboysjr.com/services/whole-property-cleanouts";

const data: ServicePageData = {
  title: "Whole-Property Cleanouts",
  metaTitle: "Whole-Property Junk Removal & Cleanouts | Big Boys Junk Removal",
  metaDescription: "Estate cleanouts, garage cleanouts, rental turnovers, contractor debris, and commercial junk removal across Metro Atlanta. Free on-site estimates.",
  heroHeading: "Whole-Property Cleanouts in Atlanta, GA",
  heroSubheading: "Estate cleanouts, garage cleanouts, rental property turnovers, contractor debris, and commercial junk removal. Free on-site estimates.",
  icon: Home,
  intro: "When an entire property needs to be cleared, you need a crew that can handle volume without slowing down. Big Boys Junk Removal specializes in large-scale, whole-property cleanouts across Metro Atlanta and North Georgia: from single-family estates and hoarding situations to multi-unit rentals, offices, retail spaces, and active job sites. We bring the trucks, the manpower, and the disposal partnerships to clear a property in a single visit whenever possible. Our team sorts, loads, hauls, and disposes of everything: furniture, appliances, mattresses, boxes, clothing, yard debris, construction material, and general clutter. Usable items are donated whenever we can, and recyclables are routed properly. Large cleanouts are priced by truck load, so the more volume you have, the better the value: and for big jobs we come out and give you a free on-site estimate before any work starts, so you know the number up front.",
  benefits: [
    "Estate cleanouts: full-home clearing handled with care and discretion",
    "Garage, basement, and attic cleanouts in one visit",
    "Rental property turnovers: fast clearing between tenants",
    "Contractor and construction debris hauling from active job sites",
    "Commercial cleanouts: offices, retail, warehouses, and restaurants",
    "Hoarding and foreclosure cleanouts with full-crew support",
    "Free on-site estimates on large-volume jobs",
    "Broom-swept finish so the property is ready to show or list",
  ],
  howItWorks: [
    "Tell us about the property: size, access, and roughly what's inside.",
    "We schedule a free on-site estimate and give you a firm load-based price.",
    "Our crew arrives with trucks and manpower sized to the job.",
    "We clear, sort, donate, recycle, and dispose: then leave the property broom-swept.",
  ],
  whyUs: [
    "Built for volume: multiple trucks and crew for large properties",
    "Free on-site estimates so there are no surprise charges",
    "Load-based pricing that saves money on high-volume jobs",
    "Experienced with estates, foreclosures, and hoarding conditions",
    "Trusted by landlords, realtors, property managers, and contractors",
    "Fully insured, same-day and next-day availability",
  ],
  faq: [
    { q: "How much does a whole-property cleanout cost?", a: "It depends on volume and access. Most full-property cleanouts range from $600 to several thousand dollars. We provide a free on-site estimate and a firm price before any work begins." },
    { q: "Do you offer free on-site estimates?", a: "Yes. For large cleanouts we come to the property, walk the job with you, and give you a firm load-based price at no cost and with no obligation." },
    { q: "Can you clear a property in one day?", a: "Most cleanouts are completed in a single visit. For very large estates or commercial spaces we schedule multiple trucks or consecutive days." },
    { q: "Do I need to sort or bag anything first?", a: "No. We handle all sorting, lifting, loading, and disposal. Just point out anything you want kept." },
    { q: "Do you work with realtors and property managers?", a: "Absolutely. We regularly handle rental turnovers, pre-listing cleanouts, and foreclosure clearing on tight timelines." },
    { q: "What's included in a whole-property cleanout?", a: "Everything from the walkthrough to the final sweep: labor, sorting, lifting, loading, hauling, dump and recycling fees, donation drop-offs, and a broom-swept finish. We clear furniture, appliances, mattresses, electronics, boxes, clothing, yard debris, and construction material. There are no separate charges for stairs on load-priced cleanouts, and the $49 area service fee is included in the quoted price." },
    { q: "Is there anything you can't take?", a: "We can't haul hazardous material: paint, solvents, motor oil, propane tanks, asbestos, or medical waste. Point these out during the estimate and we'll tell you exactly how to dispose of them locally." },
    { q: "How long does a whole-property cleanout take?", a: "A garage or single-room cleanout usually takes 1-3 hours. A full apartment or rental turnover runs 3-6 hours. A whole-house estate cleanout is typically a full day, and very large or multi-unit properties are scheduled across two or more days with additional trucks." },
    { q: "How soon can you get started?", a: "On-site estimates are usually available same day or next day, and many cleanouts can start immediately after the walkthrough. For scheduled jobs we normally book within 24-72 hours." },
    { q: "What should I prepare for a free on-site estimate?", a: "Very little. Have access to every area that needs clearing: garage, basement, attic, sheds, and storage units: and unlock any gates or units. Flag anything staying behind, note items that are especially heavy or need disassembly, and let us know about parking or driveway limits. If you're acting for an estate or a landlord, have authorization to clear the property." },
    { q: "How long does an on-site estimate take?", a: "Usually 15-20 minutes. We walk the property with you, measure the volume in truck loads, and hand you a firm written price on the spot: free, with no obligation to book." },
    { q: "Will the price change after the estimate?", a: "No. The on-site estimate is a firm price for the scope we walked. It only changes if you add items or areas we didn't see, and we'd confirm the new number with you before touching anything." },
  ],
  ctaText: "Ready to Clear the Whole Property?",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${CANONICAL}#service`,
  name: "Whole-Property Junk Removal & Cleanouts",
  serviceType: "Whole-property junk removal and cleanouts",
  description: data.metaDescription,
  url: CANONICAL,
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://bigboysjr.com/#organization",
    name: "Big Boys Junk Removal",
    telephone: "+1-470-660-6874",
    email: "support@bigboysjr.com",
    url: "https://bigboysjr.com/",
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressRegion: "GA", addressCountry: "US" },
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Metro Atlanta, GA" },
    { "@type": "AdministrativeArea", name: "North Georgia" },
  ],
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    description: "Free on-site estimates for large cleanouts. Load-based pricing.",
    url: "https://bigboysjr.com/book",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Whole-Property Cleanout Services",
    itemListElement: [
      "Estate cleanouts",
      "Garage, basement & attic cleanouts",
      "Rental property turnovers",
      "Contractor & construction debris removal",
      "Commercial junk removal",
      "Hoarding & foreclosure cleanouts",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bigboysjr.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://bigboysjr.com/services/junk-removal" },
    { "@type": "ListItem", position: 3, name: "Whole-Property Cleanouts", item: CANONICAL },
  ],
};

const WholePropertyCleanouts = () => (
  <>
    <Helmet>
      <title>{data.metaTitle}</title>
      <meta name="description" content={data.metaDescription} />
      <meta
        name="keywords"
        content="whole property cleanout, estate cleanout Atlanta, garage cleanout, rental property turnover, contractor debris removal, commercial junk removal"
      />
      <meta property="og:site_name" content="Big Boys Junk Removal" />
      <meta property="og:title" content={data.metaTitle} />
      <meta property="og:description" content={data.metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={CANONICAL} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.metaTitle} />
      <meta name="twitter:description" content={data.metaDescription} />
      <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
    <ServicePageTemplate data={data} />
  </>
);
export default WholePropertyCleanouts;

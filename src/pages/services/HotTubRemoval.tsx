import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Flame } from "lucide-react";

const data: ServicePageData = {
  title: "Hot Tub Removal",
  metaTitle: "Hot Tub Removal | Spa Demolition & Hauling | Big Boys Junk Removal",
  metaDescription: "Professional hot tub removal across Metro Atlanta & North Georgia. We demolish, disassemble, and haul away hot tubs and spas. Instant pricing, same-day service.",
  heroHeading: "Hot Tub Removal in Atlanta, GA",
  heroSubheading: "We disassemble, demolish, and haul away hot tubs and spas. No job too big for our crew.",
  icon: Flame,
  intro: "Removing a hot tub is not a DIY job. These heavy, bulky units often weigh 500-1,000 pounds and require demolition, disconnection, and heavy hauling. Big Boys Junk Removal provides professional hot tub removal across Metro Atlanta and the surrounding North Georgia area. Our experienced crew will disconnect, disassemble or demolish your old hot tub, load the debris onto our truck, and haul it away for proper disposal. We handle all types and sizes of hot tubs and spas: from portable inflatable units to large built-in models. Whether your hot tub is on a deck, patio, or in a backyard enclosure, we have the tools and expertise to get it out safely without damaging your property. Same-day hot tub removal is available across our full service area. Book online, get instant pricing, and let us handle the heavy work.",
  benefits: [
    "Full hot tub disassembly and demolition included",
    "All types: portable, acrylic, wooden, built-in spas",
    "Removal from decks, patios, and backyard enclosures",
    "Complete hauling and disposal: we take everything",
    "Safe electrical disconnection coordination",
    "Area cleanup after removal",
  ],
  howItWorks: [
    "Book online or call us to describe your hot tub and its location.",
    "Get instant pricing: no on-site estimate required for most jobs.",
    "Our crew arrives with demolition tools and equipment.",
    "We disassemble the hot tub, load debris, haul it away, and clean up the area.",
  ],
  whyUs: [
    "Specialized equipment for hot tub demolition",
    "Experienced crews that protect your deck and property",
    "All-inclusive pricing: demo, hauling, and cleanup included",
    "Fast turnaround: most jobs done in 2-3 hours",
    "Serving Metro Atlanta and all surrounding areas",
    "Fully insured for your peace of mind",
  ],
  faq: [
    { q: "How much does hot tub removal cost?", a: "Hot tub removal typically ranges from $300-$600 depending on size, location, and accessibility. Get an exact quote with our pricing tool." },
    { q: "Do you remove hot tubs from decks?", a: "Yes. We safely remove hot tubs from decks, patios, and enclosed areas." },
    { q: "How long does hot tub removal take?", a: "Most hot tub removals are completed in 2-3 hours from start to finish." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Ready to Remove That Old Hot Tub?",
};

const HotTubRemoval = () => <ServicePageTemplate data={data} />;
export default HotTubRemoval;

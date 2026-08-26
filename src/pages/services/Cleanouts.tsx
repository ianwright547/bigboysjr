import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Package } from "lucide-react";

const data: ServicePageData = {
  title: "Garage & Basement Cleanouts",
  metaTitle: "Garage & Basement Cleanout | Estate Cleanouts | Big Boys Junk Removal",
  metaDescription: "Professional garage, basement, and estate cleanout services across Metro Atlanta & North Georgia. We clear everything fast. Same-day service, instant pricing.",
  heroHeading: "Garage and Basement Cleanouts in Atlanta, GA",
  heroSubheading: "We clear out garages, basements, attics, storage units, and entire estates. Fast, thorough, and affordable across our full service area.",
  icon: Package,
  intro: "Years of accumulated stuff can turn your garage, basement, or storage area into an unusable space. Big Boys Junk Removal provides comprehensive cleanout services across Metro Atlanta and surrounding North Georgia communities. We handle everything from single-room cleanouts to full estate clearing. Our team will sort, load, haul, and properly dispose of everything: furniture, boxes, old equipment, clothing, and general clutter. We work efficiently to get your space cleared quickly, and we always leave the area clean and broom-swept. Cleanouts are priced by truck load, so you get great value when clearing large volumes. Our transparent pricing system shows you exactly what a load costs before we start. Whether you're preparing a home for sale, managing an estate, clearing a rental property, or simply reclaiming your garage, we make the process simple and stress-free.",
  benefits: [
    "Garage cleanouts: clear decades of accumulated items",
    "Basement cleanouts: furniture, boxes, equipment, and debris",
    "Attic cleanouts: safely remove items from upper levels",
    "Estate cleanouts: compassionate, thorough clearing of entire homes",
    "Storage unit cleanouts: we handle everything inside",
    "Rental property turnovers: fast clearing for landlords",
    "Broom-swept cleanup after every job",
  ],
  howItWorks: [
    "Book online or call to describe the scope of your cleanout.",
    "Choose 'Price by Load' for the best value on large cleanouts.",
    "Our crew arrives and begins sorting, loading, and hauling.",
    "We dispose of items responsibly, donate what's usable, and leave the space clean.",
  ],
  whyUs: [
    "We handle everything: no need to sort or bag items first",
    "Volume-based pricing saves money on large cleanouts",
    "Compassionate estate cleanout service",
    "Fast turnaround: most cleanouts done in one visit",
    "Serving Metro Atlanta, Marietta, Decatur, Roswell, and beyond",
    "Eco-friendly disposal with donation partnerships",
  ],
  faq: [
    { q: "How much does a garage cleanout cost?", a: "Costs depend on volume. A typical single-car garage cleanout runs $250-$500. Use our load-size pricing tool for an estimate." },
    { q: "Do I need to sort everything first?", a: "No! We handle all sorting, loading, and disposal. Just show us the space." },
    { q: "Can you do an estate cleanout?", a: "Yes. We provide compassionate, thorough estate cleanout services. We'll work with you or your representative to identify items to keep, donate, or dispose of." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Ready to Clear Out Your Space?",
};

const Cleanouts = () => <ServicePageTemplate data={data} />;
export default Cleanouts;

import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { HardHat } from "lucide-react";

const data: ServicePageData = {
  title: "Construction Debris Removal",
  metaTitle: "Construction Debris Removal | Renovation Cleanup | Big Boys Junk Removal",
  metaDescription: "Construction debris removal across Metro Atlanta & North Georgia. We haul drywall, wood, tile, concrete, and renovation waste. Same-day service, instant pricing.",
  heroHeading: "Construction Debris Removal in Atlanta, GA",
  heroSubheading: "We haul drywall, lumber, tile, concrete, and all renovation waste. Keep your job site clean.",
  icon: HardHat,
  intro: "Renovation and construction projects create a lot of waste. Big Boys Junk Removal provides fast, reliable construction debris removal across Metro Atlanta and the surrounding North Georgia area. Whether you're a homeowner finishing a bathroom remodel or a contractor needing job site cleanup, we'll haul away all your construction waste quickly and affordably. We handle all types of construction and renovation debris including drywall, lumber, plywood, tile, flooring, carpet, concrete, brick, roofing materials, and general demo waste. Our crew loads everything: no need to pile it at the curb. Pricing is based on load volume, so you get great value even for large amounts of debris. We serve contractors, property managers, and homeowners across the entire Metro Atlanta area.",
  benefits: [
    "Drywall, sheetrock, and plaster removal",
    "Lumber, plywood, and wood scraps",
    "Tile, flooring, and carpet debris",
    "Concrete, brick, and masonry waste",
    "Roofing materials and shingles",
    "General demo and renovation cleanup",
    "Job site broom-sweep included",
  ],
  howItWorks: [
    "Book online or call to describe your construction debris.",
    "Get load-based pricing: perfect for large volume jobs.",
    "Our crew arrives and loads all debris onto the truck.",
    "We haul it away for proper disposal and leave the site clean.",
  ],
  whyUs: [
    "We work with contractors and homeowners alike",
    "Volume pricing saves money on large debris loads",
    "Fast same-day and next-day availability",
    "No dumpster rental needed: we load and go",
    "Proper disposal at certified facilities",
    "Serving all of Metro Atlanta and surrounding areas",
  ],
  faq: [
    { q: "Is this cheaper than renting a dumpster?", a: "Often yes: especially for single-load jobs. No rental fees, delivery fees, or overage charges. We load, haul, and dispose in one visit." },
    { q: "Can you do recurring job site pickups?", a: "Yes! We work with contractors on scheduled pickups. Call us to set up a recurring schedule." },
    { q: "Do you remove concrete and brick?", a: "Yes, we handle concrete, brick, and masonry debris. Heavy materials may be priced at a premium." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Clear Your Construction Debris Fast",
};

const ConstructionDebris = () => <ServicePageTemplate data={data} />;
export default ConstructionDebris;

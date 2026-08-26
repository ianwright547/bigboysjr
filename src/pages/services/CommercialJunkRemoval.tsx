import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Building2 } from "lucide-react";

const data: ServicePageData = {
  title: "Commercial Junk Removal",
  metaTitle: "Office Junk Removal & Warehouse Cleanouts Atlanta | Big Boys",
  metaDescription: "Commercial junk removal in Metro Atlanta: office cleanouts, warehouse clear-outs, retail fixtures, and e-waste. Instant pricing, after-hours crews, fully insured.",
  heroHeading: "Commercial Junk Removal in Atlanta, GA",
  heroSubheading: "Offices, warehouses, retail spaces, and construction sites across Metro Atlanta. Flexible scheduling, after-hours pickups, and instant upfront pricing.",
  icon: Building2,
  intro:
    "When your business is moving, downsizing, or renovating, the last thing you need is old cubicles and pallets blocking the floor. Big Boys Junk Removal handles commercial junk removal across Metro Atlanta: office furniture, desks, filing cabinets, conference tables, retail fixtures, warehouse racking, pallets, and e-waste. We work around your operating hours, including evenings and weekends, so your team and customers are never disrupted. Our crews are fully insured, background-checked, and used to loading docks, freight elevators, and property-manager requirements. You get an upfront price online before we arrive: no on-site estimate, no surprise invoice. We serve offices and warehouses in Atlanta, Marietta, Decatur, Alpharetta, Sandy Springs, Roswell, Kennesaw, Smyrna, and surrounding areas.",
  benefits: [
    "Office cleanouts: desks, cubicles, chairs, filing cabinets, conference tables",
    "Warehouse cleanouts: pallets, racking, shelving, and bulk scrap",
    "Retail fixtures, displays, shelving, and store closeouts",
    "E-waste: monitors, printers, servers, and old IT equipment",
    "After-hours and weekend scheduling so business keeps running",
    "Fully insured crews familiar with loading docks and building rules",
    "Recycling and donation of usable office furniture whenever possible",
  ],
  howItWorks: [
    "Enter your ZIP code and price the job by item or by load size online.",
    "Pick a pickup window: including evenings and weekends for occupied spaces.",
    "Our insured crew arrives, loads everything, and clears freight paths and docks.",
    "We sweep the space and send documentation for your property manager if needed.",
  ],
  whyUs: [
    "Upfront online pricing: no waiting on a commercial site visit",
    "Same-day and next-day availability for urgent move-outs",
    "Experienced with multi-tenant buildings, docks, and elevators",
    "Responsible disposal: we donate and recycle office furniture and e-waste",
    "One crew for everything: furniture, debris, and electronics",
    "Rated 4.9 ★ by hundreds of Metro Atlanta customers",
  ],
  faq: [
    { q: "How much does office junk removal cost?", a: "Commercial jobs are priced by volume or by item. Single items start at $49, and full office or warehouse cleanouts are priced by load size: you see the total online before booking." },
    { q: "Can you work after business hours?", a: "Yes. We schedule evening and weekend pickups so your office or storefront stays open during the day." },
    { q: "Do you handle warehouse cleanouts?", a: "We do: pallets, racking, shelving, packaging waste, and leftover inventory, including multi-truck jobs." },
    { q: "Do you remove old office electronics?", a: "Yes. Monitors, printers, servers, and other e-waste are hauled and recycled through proper channels." },
    { q: "Do you provide documentation for property managers?", a: "Yes. We can provide proof of insurance and disposal documentation on request before or after the job." },
  ],
  ctaText: "Get instant pricing for your office or warehouse cleanout",
};

const CommercialJunkRemoval = () => <ServicePageTemplate data={data} />;

export default CommercialJunkRemoval;

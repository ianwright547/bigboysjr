import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Trash2 } from "lucide-react";

const data: ServicePageData = {
  title: "Junk Removal",
  metaTitle: "Junk Removal | Same-Day Hauling Service | Big Boys Junk Removal",
  metaDescription: "Fast, affordable junk removal across Metro Atlanta & North Georgia. Same-day service, instant pricing online. We haul furniture, appliances, yard waste, and more.",
  heroHeading: "Junk Removal in Atlanta, GA",
  heroSubheading: "Top-rated junk hauling across Metro Atlanta and surrounding areas. Same-day pickup, instant pricing, and no hidden fees.",
  icon: Trash2,
  intro: "Whether you're decluttering your home, cleaning out a garage, or managing a property cleanout, Big Boys Junk Removal is your go-to junk hauling service. We remove practically anything non-hazardous: from old furniture and appliances to yard waste, electronics, and general household junk. Our professional, background-checked crews handle all the heavy lifting. Just point to what needs to go, and we'll take care of the rest. No need to sort, bag, or move anything to the curb. We come to wherever your junk is and load it onto our truck. Big Boys Junk Removal serves the entire Metro Atlanta area and surrounding communities within 50 miles. We're known for fast response times, transparent pricing, and friendly service. Most jobs are completed same-day: many within hours of booking. Our instant online pricing system lets you see exactly what you'll pay before we arrive. No surprise fees, no haggling, no on-site estimates required.",
  benefits: [
    "Household junk, clutter, and miscellaneous items",
    "Old furniture, electronics, and small appliances",
    "Yard waste, branches, and outdoor debris",
    "Office furniture, equipment, and e-waste",
    "Storage unit cleanouts",
    "Post-renovation cleanup",
    "We load, haul, and dispose: you don't lift a finger",
  ],
  howItWorks: [
    "Enter your ZIP code to check if we serve your area.",
    "Choose to price by individual item or by truck load size.",
    "See your transparent price instantly: no hidden fees.",
    "Pick a date and time. Our crew arrives, loads everything, and cleans up.",
  ],
  whyUs: [
    "Instant online pricing: know your cost before we arrive",
    "Same-day junk removal across our full service area",
    "Background-checked, fully insured crews",
    "Eco-friendly: we donate and recycle whenever possible",
    "We handle all the heavy lifting, sorting, and loading",
    "Rated 4.9 ★ by hundreds of satisfied customers",
  ],
  faq: [
    { q: "What items can't you remove?", a: "We can't remove hazardous materials like paint, chemicals, asbestos, or biohazardous waste. Almost everything else is fair game." },
    { q: "How fast can you come?", a: "We offer same-day service across our entire service area. Book online and we can often arrive within hours." },
    { q: "Do I need to be home?", a: "Someone 18+ needs to be present to authorize the removal and show us what to take." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Get Rid of Your Junk Today",
};

const JunkRemoval = () => <ServicePageTemplate data={data} />;
export default JunkRemoval;

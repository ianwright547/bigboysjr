import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Refrigerator } from "lucide-react";

const data: ServicePageData = {
  title: "Appliance Removal",
  metaTitle: "Appliance Removal | Refrigerator, Washer, Dryer Pickup | Big Boys Junk Removal",
  metaDescription: "Fast appliance removal across Metro Atlanta & North Georgia. We pick up refrigerators, washers, dryers, ovens, dishwashers and more. Same-day service, instant pricing.",
  heroHeading: "Appliance Removal in Atlanta, GA",
  heroSubheading: "We remove refrigerators, washers, dryers, ovens, dishwashers, and all major appliances. Fast, safe, and affordable across our full service area.",
  icon: Refrigerator,
  intro: "Old appliances are heavy, awkward, and often impossible to move alone. Big Boys Junk Removal specializes in safe appliance removal across Metro Atlanta and the surrounding North Georgia area. Whether you're replacing a refrigerator, upgrading your laundry setup, or clearing out a kitchen, we'll disconnect (if applicable), carry out, and properly dispose of your old appliances. We handle all types of major appliances including refrigerators, freezers, washing machines, dryers, stoves, ovens, dishwashers, water heaters, and window AC units. Our crews are trained to navigate tight spaces, stairs, and doorways without damaging your property. Same-day appliance removal is available across our entire service area. We ensure responsible disposal: appliances are recycled at certified facilities whenever possible, keeping harmful materials out of landfills.",
  benefits: [
    "All major appliances: refrigerators, washers, dryers, ovens, dishwashers",
    "Water heaters, window AC units, freezers, and microwaves",
    "Safe removal from any location in your home",
    "Environmentally responsible recycling and disposal",
    "Same-day service across Metro Atlanta and surrounding areas",
    "No hidden fees: transparent instant pricing",
  ],
  howItWorks: [
    "Enter your ZIP code on our booking page to check service availability.",
    "Select the appliances you need removed and see your price instantly.",
    "Pick a date and time: same-day slots often available.",
    "Our crew arrives, safely removes the appliance, loads the truck, and cleans up.",
  ],
  whyUs: [
    "We handle heavy, awkward appliances so you don't have to",
    "Trained crews that protect your floors, walls, and doorways",
    "Eco-friendly disposal: appliances recycled at certified facilities",
    "Instant pricing means no waiting for estimates",
    "Same-day availability across our full service area",
    "Fully insured and background-checked team",
  ],
  faq: [
    { q: "Can you remove a refrigerator from a tight kitchen?", a: "Yes. Our crews are experienced in navigating tight spaces, narrow doorways, and stairs." },
    { q: "Do you disconnect appliances?", a: "We can disconnect standard appliances. Gas disconnections require a licensed plumber: we'll let you know if that's needed." },
    { q: "How much does appliance removal cost?", a: "Prices start at $49 per appliance. Get an exact price using our instant online pricing tool." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Need an Appliance Removed Today?",
};

const ApplianceRemoval = () => <ServicePageTemplate data={data} />;
export default ApplianceRemoval;

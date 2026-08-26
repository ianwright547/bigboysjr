import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { TreePine } from "lucide-react";

const data: ServicePageData = {
  title: "Yard Waste Removal",
  metaTitle: "Yard Waste Removal | Branches, Debris & Brush Hauling | Big Boys Junk Removal",
  metaDescription: "Yard waste and brush removal across Metro Atlanta & North Georgia. We haul branches, leaves, dirt, sod, and outdoor debris. Same-day service, instant pricing.",
  heroHeading: "Yard Waste Removal in Atlanta, GA",
  heroSubheading: "We haul branches, brush, leaves, dirt, sod, and all outdoor debris. Keep your yard clean and clear.",
  icon: TreePine,
  intro: "After a landscaping project, storm cleanup, or seasonal yard work, you're often left with piles of branches, leaves, brush, and debris that won't fit in your regular trash pickup. Big Boys Junk Removal handles yard waste removal across Metro Atlanta and the surrounding North Georgia area, so you don't have to make multiple trips to the dump. We remove all types of yard waste including tree branches, brush, leaves, grass clippings, dirt, sod, mulch, and general outdoor debris. Our crew loads everything onto our truck and disposes of it properly. Whether you've got a small pile of trimmings or a full yard of storm debris, we'll get it cleared fast.",
  benefits: [
    "Tree branches, limbs, and brush removal",
    "Leaves, grass clippings, and yard trimmings",
    "Dirt, sod, mulch, and gravel hauling",
    "Storm debris cleanup",
    "Fence and deck demolition debris",
    "Same-day service available across our full service area",
  ],
  howItWorks: [
    "Book online and describe the type and volume of yard waste.",
    "Get instant pricing based on load size.",
    "Our crew arrives, loads all yard waste onto the truck.",
    "We haul it away and dispose of it properly: many materials are composted.",
  ],
  whyUs: [
    "No trips to the dump: we handle everything",
    "Volume-based pricing for great value",
    "Eco-friendly disposal and composting",
    "Fast same-day service across Metro Atlanta and beyond",
    "We handle heavy items like logs and stumps",
    "Professional, uniformed crews",
  ],
  faq: [
    { q: "Do you remove tree stumps?", a: "We can remove small stumps. Large stumps may require a specialized stump grinding service." },
    { q: "Can you clean up after a storm?", a: "Yes! We provide storm debris cleanup across our entire service area." },
    { q: "How is yard waste priced?", a: "Yard waste is priced by load size. Use our online tool for an instant estimate." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Clean Up Your Yard Today",
};

const YardWaste = () => <ServicePageTemplate data={data} />;
export default YardWaste;

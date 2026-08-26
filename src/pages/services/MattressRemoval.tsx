import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { BedDouble } from "lucide-react";

const data: ServicePageData = {
  title: "Mattress Removal",
  metaTitle: "Mattress Removal | Same-Day Disposal | Big Boys Junk Removal",
  metaDescription: "Fast mattress removal and disposal across Metro Atlanta & North Georgia. We pick up mattresses, box springs, and bed frames. Same-day service, instant pricing.",
  heroHeading: "Mattress Removal in Atlanta, GA",
  heroSubheading: "We remove mattresses, box springs, and bed frames from any room. Same-day pickup available across our full service area.",
  icon: BedDouble,
  intro: "Mattresses are bulky, difficult to transport, and often rejected by regular trash pickup. Big Boys Junk Removal makes mattress disposal simple across Metro Atlanta and surrounding communities. We'll come to your home, carry the mattress out from any room or floor, load it on our truck, and dispose of it properly. We handle all sizes: twin, full, queen, king, and California king. We also remove box springs, bed frames, headboards, and adjustable bases. Whether you're replacing a mattress, cleaning out a bedroom, or managing a rental property turnover, we've got you covered. Same-day mattress removal is available across our entire service area. Book online in minutes and get instant, transparent pricing with no hidden fees.",
  benefits: [
    "All mattress sizes: twin, full, queen, king, California king",
    "Box springs, bed frames, headboards, and adjustable bases",
    "Pickup from any room or floor: we do the heavy lifting",
    "Eco-friendly disposal and recycling when possible",
    "Same-day service across Metro Atlanta and surrounding areas",
    "Instant online pricing: no estimates needed",
  ],
  howItWorks: [
    "Enter your ZIP code and select the mattress items you need removed.",
    "See your exact price instantly: no waiting for quotes.",
    "Choose a pickup time. Same-day slots are often available.",
    "Our crew arrives, carries out the mattress, and cleans up the area.",
  ],
  whyUs: [
    "No need to drag your mattress to the curb: we come to you",
    "Proper disposal that meets local regulations",
    "Fast booking: most jobs completed same day",
    "Affordable flat-rate pricing starting at $49",
    "Serving Metro Atlanta and all surrounding cities",
    "Background-checked, professional crews",
  ],
  faq: [
    { q: "Can you take a mattress from upstairs?", a: "Yes! We carry mattresses from any floor at no extra charge." },
    { q: "Do you recycle mattresses?", a: "We work with recycling partners to divert mattresses from landfills whenever possible." },
    { q: "How much does mattress removal cost?", a: "Mattress removal starts at $49. Use our online tool for an instant quote." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Get Rid of Your Old Mattress Today",
};

const MattressRemoval = () => <ServicePageTemplate data={data} />;
export default MattressRemoval;

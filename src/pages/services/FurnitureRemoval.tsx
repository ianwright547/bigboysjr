import ServicePageTemplate, { type ServicePageData } from "./ServicePageTemplate";
import { Sofa } from "lucide-react";

const data: ServicePageData = {
  title: "Furniture Removal",
  metaTitle: "Furniture Removal | Same-Day Pickup | Big Boys Junk Removal",
  metaDescription: "Same-day couch, sofa, table, and chair removal across Metro Atlanta. Instant online pricing, no hidden fees. Book furniture pickup in 30 seconds.",
  heroHeading: "Furniture Removal in Atlanta, GA",
  heroSubheading: "We remove couches, sofas, tables, chairs, dressers, desks, and more. Same-day pickup available across Metro Atlanta and surrounding areas.",
  icon: Sofa,
  intro: "Getting rid of old furniture shouldn't be a hassle. Whether you're upgrading your living room, clearing out a rental property, or downsizing, Big Boys Junk Removal makes furniture removal fast, affordable, and stress-free. Our professional crews handle all the heavy lifting: from oversized sectional sofas to bulky entertainment centers. We'll carry it out of your home, load it onto our truck, and dispose of it responsibly. No need to drag anything to the curb. We come to you, wherever the furniture is: upstairs, basement, garage, or backyard. Most furniture removal jobs are completed same-day. Simply book online, get instant pricing, and we'll handle the rest. We serve the entire Metro Atlanta area including Marietta, Decatur, Roswell, Alpharetta, Sandy Springs, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and beyond.",
  benefits: [
    "Same-day furniture pickup across our entire service area",
    "We carry items from any room: no need to move anything yourself",
    "Couches, sofas, recliners, love seats, and sectionals",
    "Tables, chairs, desks, dressers, and bookshelves",
    "Bed frames, headboards, and entertainment centers",
    "Responsible disposal: we donate or recycle when possible",
    "No hidden fees: instant transparent pricing online",
  ],
  howItWorks: [
    "Enter your ZIP code and select 'Price by Item' to see furniture pricing instantly.",
    "Add the furniture items you need removed to your cart. Adjust quantities as needed.",
    "Choose your preferred pickup date and time. Same-day slots are often available.",
    "Our insured crew arrives, carries out your furniture, loads the truck, and sweeps up. Done!",
  ],
  whyUs: [
    "Instant online pricing: no waiting for on-site estimates",
    "Same-day service available across our full service area",
    "Fully insured with background-checked crews",
    "We donate usable furniture to local charities",
    "We handle all the heavy lifting: stairs included",
    "Rated 4.9 ★ by hundreds of satisfied customers",
  ],
  faq: [
    { q: "How much does furniture removal cost?", a: "Single item removal starts at $49. Prices vary by item type and size. Use our instant pricing tool for an exact quote." },
    { q: "Do you remove furniture from upstairs?", a: "Yes! Our crew will carry furniture from any floor, room, or location in your home at no extra charge." },
    { q: "Can you remove a sectional sofa?", a: "Absolutely. We handle oversized items including sectionals, sleeper sofas, and entertainment centers." },
    { q: "Do you donate furniture?", a: "Yes. Usable items in good condition are donated to local charities whenever possible." },
    { q: "What areas do you serve?", a: "We serve the entire Metro Atlanta area including Marietta, Roswell, Alpharetta, Sandy Springs, Decatur, Suwanee, Buford, Lawrenceville, Kennesaw, Smyrna, and surrounding communities." },
  ],
  ctaText: "Ready to Get Rid of Old Furniture?",
};

const FurnitureRemoval = () => <ServicePageTemplate data={data} />;
export default FurnitureRemoval;

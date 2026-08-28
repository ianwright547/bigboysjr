import { Sofa, Refrigerator, BedDouble, Flame, TreePine, Trash2, Package, HardHat, Building2, Home, type LucideIcon } from "lucide-react";
import fridgeImage from "@/assets/icons/fridge.png";

export interface ServiceLink {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
}

/** Single source of truth for service page links used across the site's internal linking. */
export const SERVICE_LINKS: ServiceLink[] = [
  { icon: Trash2, name: "General Junk Removal", slug: "/services/junk-removal", description: "Mixed household clutter, boxes, bags, electronics, and everyday unwanted items.", image: "/photos/jobs/bagged-junk-before.jpg", imageAlt: "Bagged household junk, boxes, and containers ready for removal" },
  { icon: Sofa, name: "Furniture Removal", slug: "/services/furniture-removal", description: "Couches, sectionals, dressers, tables, chairs, bed frames, and bulky furnishings.", image: "/photos/jobs/curbside-pickup-before.jpg", imageAlt: "Bulky furniture and outdoor pieces staged for removal" },
  { icon: Refrigerator, name: "Appliance Removal", slug: "/services/appliance-removal", description: "Refrigerators, washers, dryers, ovens, freezers, and other heavy appliances.", image: fridgeImage, imageAlt: "Refrigerator representing appliance removal service", imageFit: "contain" },
  { icon: BedDouble, name: "Mattress Removal", slug: "/services/mattress-removal", description: "Mattresses, box springs, bed frames, headboards, and adjustable bases from any room.", image: "/photos/services/mattress-removal.jpg", imageAlt: "Mattress and bed frame ready for removal from a home" },
  { icon: Flame, name: "Hot Tub Removal", slug: "/services/hot-tub-removal", description: "Careful disassembly, loading, and haul-away for hot tubs, spas, and their components.", image: "/photos/services/hot-tub-removal-generated.jpg", imageAlt: "Weathered hot tub partially dismantled with its side panels stacked for removal" },
  { icon: TreePine, name: "Yard Waste Removal", slug: "/services/yard-waste-removal", description: "Branches, brush, storm debris, trimmings, and other landscaping waste.", image: "/photos/services/yard-waste.jpg", imageAlt: "Cut branches and brush ready for yard waste removal" },
  { icon: Package, name: "Garage & Basement Cleanouts", slug: "/services/cleanouts", description: "Room-by-room clearing for garages, basements, attics, storage units, and estates.", image: "/photos/garage-cleanout-before.jpg", imageAlt: "Cluttered garage with boxes and household items before a cleanout" },
  { icon: HardHat, name: "Construction Debris", slug: "/services/construction-debris", description: "Lumber, flooring, drywall, tile, fixtures, cabinets, and renovation leftovers.", image: "/photos/services/construction-debris-generated.jpg", imageAlt: "Organized pile of lumber, drywall, carpet, and renovation debris on a residential driveway" },
  { icon: Building2, name: "Commercial Junk Removal", slug: "/services/commercial-junk-removal", description: "Furniture, boxed materials, fixtures, equipment, and property-management pickups.", image: "/photos/services/commercial-junk-removal-generated.jpg", imageAlt: "Office desks, chairs, filing cabinet, shelving, and boxes prepared for commercial junk removal" },
  { icon: Home, name: "Whole-Property Cleanouts", slug: "/services/whole-property-cleanouts", description: "High-volume cleanouts for estates, rentals, renovations, moves, and major transitions.", image: "/photos/services/whole-property-cleanout-generated.jpg", imageAlt: "Large organized load of mattresses, furniture, boxes, bags, and household items outside a home" },
];

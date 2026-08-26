import { Sofa, Refrigerator, BedDouble, Flame, TreePine, Trash2, Package, HardHat, Building2, Home, type LucideIcon } from "lucide-react";

export interface ServiceLink {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
  image: string;
}

/** Single source of truth for service page links used across the site's internal linking. */
export const SERVICE_LINKS: ServiceLink[] = [
  { icon: Trash2, name: "General Junk Removal", slug: "/services/junk-removal", description: "Mixed household clutter, boxes, bags, electronics, and everyday unwanted items.", image: "/photos/jobs/bagged-junk-before.jpg" },
  { icon: Sofa, name: "Furniture Removal", slug: "/services/furniture-removal", description: "Couches, sectionals, dressers, tables, chairs, bed frames, and bulky furnishings.", image: "/photos/jobs/curbside-pickup-before.jpg" },
  { icon: Refrigerator, name: "Appliance Removal", slug: "/services/appliance-removal", description: "Refrigerators, washers, dryers, ovens, freezers, and other heavy appliances.", image: "/photos/jobs/driveway-pickup-before.jpg" },
  { icon: BedDouble, name: "Mattress Removal", slug: "/services/mattress-removal", description: "Mattresses, box springs, bed frames, headboards, and adjustable bases from any room.", image: "/photos/jobs/household-cleanout-before.jpg" },
  { icon: Flame, name: "Hot Tub Removal", slug: "/services/hot-tub-removal", description: "Careful disassembly, loading, and haul-away for spas and bulky outdoor equipment.", image: "/photos/jobs/patio-cleanout-before.jpg" },
  { icon: TreePine, name: "Yard Waste Removal", slug: "/services/yard-waste-removal", description: "Branches, brush, storm debris, tires, outdoor equipment, and landscaping waste.", image: "/photos/jobs/tire-removal-before.jpg" },
  { icon: Package, name: "Garage & Basement Cleanouts", slug: "/services/cleanouts", description: "Room-by-room clearing for garages, basements, attics, storage units, and estates.", image: "/photos/jobs/paint-removal-before.jpg" },
  { icon: HardHat, name: "Construction Debris", slug: "/services/construction-debris", description: "Lumber, flooring, drywall, tile, fixtures, cabinets, and renovation leftovers.", image: "/photos/jobs/driveway-pickup-before.jpg" },
  { icon: Building2, name: "Commercial Junk Removal", slug: "/services/commercial-junk-removal", description: "Office furniture, retail fixtures, warehouse clutter, and property-management pickups.", image: "/photos/jobs/outdoor-items-before.jpg" },
  { icon: Home, name: "Whole-Property Cleanouts", slug: "/services/whole-property-cleanouts", description: "High-volume cleanouts for estates, rentals, renovations, moves, and major transitions.", image: "/photos/jobs/patio-cleanout-before.jpg" },
];

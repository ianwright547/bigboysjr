import { Sofa, Refrigerator, BedDouble, Flame, TreePine, Trash2, Package, HardHat, Building2, Home, type LucideIcon } from "lucide-react";

export interface ServiceLink {
  icon: LucideIcon;
  name: string;
  slug: string;
}

/** Single source of truth for service page links used across the site's internal linking. */
export const SERVICE_LINKS: ServiceLink[] = [
  { icon: Trash2, name: "General Junk Removal", slug: "/services/junk-removal" },
  { icon: Sofa, name: "Furniture Removal", slug: "/services/furniture-removal" },
  { icon: Refrigerator, name: "Appliance Removal", slug: "/services/appliance-removal" },
  { icon: BedDouble, name: "Mattress Removal", slug: "/services/mattress-removal" },
  { icon: Flame, name: "Hot Tub Removal", slug: "/services/hot-tub-removal" },
  { icon: TreePine, name: "Yard Waste Removal", slug: "/services/yard-waste-removal" },
  { icon: Package, name: "Garage & Basement Cleanouts", slug: "/services/cleanouts" },
  { icon: HardHat, name: "Construction Debris", slug: "/services/construction-debris" },
  { icon: Building2, name: "Commercial Junk Removal", slug: "/services/commercial-junk-removal" },
  { icon: Home, name: "Whole-Property Cleanouts", slug: "/services/whole-property-cleanouts" },
];

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ItemSelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
  category: string;
}

export interface AddOns {
  stairs: number;
  disassembly: number;
  sameDay: boolean;
}

export const ADDON_UNIT_PRICES = {
  stairs: 10,
  disassembly: 20,
  sameDay: 20,
} as const;

// Mandatory fee added to every order (transportation + service loading costs)
export const AREA_SERVICE_FEE = 49;

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  date: Date | undefined;
  timeSlot: string;
  notes: string;
}

export const ITEM_CATEGORIES = [
  "Furniture",
  "Appliances",
  "Electronics",
  "Outdoor & Yard",
  "Office",
  "Cleanouts & Bulk Jobs",
  "Miscellaneous",
  "Heavy / Specialty Items",
] as const;

// Synonyms for fuzzy search
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  "sofa": ["couch-basic", "couch-futon", "couch-reclining", "couch-loveseat-reclining", "couch-sleeper", "couch-sectional-2", "couch-sectional-3", "couch-sectional-4", "couch-sectional-5", "couch-sectional-6", "couch-sectional-sleeper", "couch-sectional-recliner", "recliner"],
  "loveseat": ["couch-basic", "couch-loveseat-reclining"],
  "bed": ["mattress-crib", "mattress-twin", "mattress-full", "mattress-queen", "mattress-king", "bed-frame", "boxspring-twin", "boxspring-full", "boxspring-queen", "boxspring-king", "baby-crib"],
  "television": ["tv-small", "tv-medium", "tv-large"],
  "refrigerator": ["fridge", "mini-fridge"],
  "stove": ["oven"],
  "range": ["oven"],
  "wardrobe": ["dresser-vertical", "dresser-vertical-chest", "dresser-combo"],
  "cabinet": ["filing-cabinet", "dresser-nightstand"],
  "table": ["table-generic", "table-coffee", "table-dining", "table-conference", "pool-table"],
  "chair": ["chair-generic", "office-chair", "recliner", "baby-high-chair", "outdoor-chair"],
  "junk": ["bag-of-junk", "load-small", "load-medium", "load-large", "load-full"],
  "trash": ["bag-of-junk", "yard-waste"],
  "garbage": ["bag-of-junk"],
  "workout": ["treadmill-residential", "treadmill-commercial", "elliptical", "exercise-equip", "exercise-bike", "rowing-machine", "stair-climber"],
  "gym": ["treadmill-residential", "treadmill-commercial", "elliptical", "exercise-equip", "exercise-bike", "rowing-machine", "stair-climber"],
  "baby": ["baby-crib", "baby-stroller", "baby-car-seat", "baby-high-chair", "baby-changing-table"],
  "nursery": ["baby-crib", "baby-changing-table"],
  "bbq": ["grill"],
  "barbecue": ["grill"],
  "spa": ["hot-tub"],
  "jacuzzi": ["hot-tub"],
  "freezer": ["freezer-chest", "freezer-residential", "freezer-commercial"],
  "toolbox": ["toolbox-small", "toolbox-freestanding", "toolbox-large"],
  "tools": ["toolbox-small", "toolbox-freestanding", "toolbox-large", "misc-power-tools"],
  "vanity": ["vanity-small", "vanity-medium", "vanity-large"],
  "mower": ["lawnmower-push", "lawnmower-riding"],
  "lawn": ["lawnmower-push", "lawnmower-riding", "yard-waste"],
  "wine": ["wine-cooler-small", "wine-cooler-large"],
  "countertop": ["countertop-laminate", "countertop-stone"],
  "counter": ["countertop-laminate", "countertop-stone"],
  "treadmill": ["treadmill-residential", "treadmill-commercial"],
  "patio": ["outdoor-furniture", "outdoor-chair", "outdoor-sectional"],
  "outdoor": ["outdoor-furniture", "outdoor-chair", "outdoor-sectional", "trampoline"],
};

export const DEFAULT_ITEMS: ItemSelection[] = [
  // === Furniture ===
  // Couch variants (popup)
  { id: "couch-basic", name: "Couch / Loveseat", price: 30, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-futon", name: "Futon", price: 50, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-reclining", name: "Reclining Sofa", price: 95, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-loveseat-reclining", name: "Loveseat - Reclining", price: 75, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sleeper", name: "Sleeper Sofa", price: 70, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-2", name: "Sectional Sofa - 2 pieces", price: 50, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-3", name: "Sectional Sofa - 3 pieces", price: 75, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-4", name: "Sectional Sofa - 4 pieces", price: 125, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-5", name: "Sectional Sofa - 5 pieces", price: 150, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-6", name: "Sectional Sofa - 6+ pieces", price: 200, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-sleeper", name: "Sectional - with built in Sleeper", price: 250, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "couch-sectional-recliner", name: "Sectional - with built in Recliner", price: 225, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "recliner", name: "Recliner", price: 90, quantity: 0, icon: "💺", category: "Furniture" },
  // Table variants (popup)
  { id: "table-coffee", name: "Coffee Table", price: 25, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "table-generic", name: "Table", price: 40, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "table-dining", name: "Dining Table", price: 40, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "table-conference", name: "Conference Room Table", price: 75, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "tv-stand", name: "TV Stand / Media Console", price: 70, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "bookshelf", name: "Bookshelf", price: 65, quantity: 0, icon: "📚", category: "Furniture" },
  // Mattress variants (popup)
  { id: "mattress-crib", name: "Crib Mattress", price: 15, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "mattress-twin", name: "Twin Mattress", price: 25, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "mattress-full", name: "Full Mattress", price: 30, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "mattress-queen", name: "Queen Mattress", price: 35, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "mattress-king", name: "King Mattress", price: 40, quantity: 0, icon: "🛏️", category: "Furniture" },
  // Box Spring variants (popup)
  { id: "boxspring-twin", name: "Twin Box Spring", price: 15, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "boxspring-full", name: "Full Box Spring", price: 20, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "boxspring-queen", name: "Queen Box Spring", price: 20, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "boxspring-king", name: "King Box Spring", price: 30, quantity: 0, icon: "🛏️", category: "Furniture" },
  { id: "bed-frame", name: "Bed Frame", price: 50, quantity: 0, icon: "🛏️", category: "Furniture" },
  // Dresser variants (popup)
  { id: "dresser-nightstand", name: "Nightstand", price: 20, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-mirror", name: "Mirror - Dresser", price: 30, quantity: 0, icon: "🪞", category: "Furniture" },
  { id: "dresser-lingerie", name: "Lingerie Chest", price: 35, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-vertical", name: "Vertical Dresser", price: 40, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-vertical-chest", name: "Vertical Chest of Drawers", price: 40, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-horizontal", name: "Horizontal Dresser", price: 50, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-horizontal-chest", name: "Horizontal Chest of Drawers", price: 50, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-double", name: "Double Dresser", price: 55, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-combo", name: "Combo Dresser", price: 60, quantity: 0, icon: "🗄️", category: "Furniture" },
  { id: "dresser-gentlemans", name: "Gentleman's Chest", price: 50, quantity: 0, icon: "🗄️", category: "Furniture" },
  // Vanity variants (popup)
  { id: "vanity-small", name: "Vanity - Small", price: 35, quantity: 0, icon: "🪞", category: "Furniture" },
  { id: "vanity-medium", name: "Vanity - Medium", price: 40, quantity: 0, icon: "🪞", category: "Furniture" },
  { id: "vanity-large", name: "Vanity - Large", price: 75, quantity: 0, icon: "🪞", category: "Furniture" },
  // Standalone furniture
  { id: "chair-generic", name: "Chair", price: 20, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "stool", name: "Stool", price: 15, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "bench", name: "Bench", price: 25, quantity: 0, icon: "🪑", category: "Furniture" },
  { id: "ottoman", name: "Ottoman", price: 25, quantity: 0, icon: "🛋️", category: "Furniture" },
  { id: "mirror", name: "Mirror", price: 30, quantity: 0, icon: "🪞", category: "Furniture" },

  // === Appliances ===
  { id: "fridge", name: "Refrigerator", price: 100, quantity: 0, icon: "❄️", category: "Appliances" },
  { id: "mini-fridge", name: "Mini Fridge", price: 50, quantity: 0, icon: "❄️", category: "Appliances" },
  // Freezer variants (popup)
  { id: "freezer-chest", name: "Freezer Chest", price: 50, quantity: 0, icon: "❄️", category: "Appliances" },
  { id: "freezer-residential", name: "Freezer - Residential Upright", price: 55, quantity: 0, icon: "❄️", category: "Appliances" },
  { id: "freezer-commercial", name: "Freezer - Commercial Size", price: 450, quantity: 0, icon: "❄️", category: "Appliances" },
  { id: "washer", name: "Washer", price: 85, quantity: 0, icon: "🫧", category: "Appliances" },
  { id: "dryer", name: "Dryer", price: 85, quantity: 0, icon: "🌀", category: "Appliances" },
  { id: "dishwasher", name: "Dishwasher", price: 75, quantity: 0, icon: "🍽️", category: "Appliances" },
  { id: "oven", name: "Oven / Stove", price: 95, quantity: 0, icon: "🔥", category: "Appliances" },
  { id: "microwave", name: "Microwave", price: 25, quantity: 0, icon: "📡", category: "Appliances" },
  { id: "water-heater", name: "Water Heater", price: 120, quantity: 0, icon: "🚿", category: "Appliances" },
  // Wine Cooler variants (popup)
  { id: "wine-cooler-small", name: "Wine Cooler - Small", price: 50, quantity: 0, icon: "🍷", category: "Appliances" },
  { id: "wine-cooler-large", name: "Wine Cooler - Large", price: 150, quantity: 0, icon: "🍷", category: "Appliances" },
  { id: "ice-machine", name: "Ice Machine", price: 100, quantity: 0, icon: "🧊", category: "Appliances" },

  // === Electronics ===
  { id: "tv-small", name: "TV (small <40\")", price: 40, quantity: 0, icon: "📺", category: "Electronics" },
  { id: "tv-medium", name: "TV (40-70\")", price: 60, quantity: 0, icon: "📺", category: "Electronics" },
  { id: "tv-large", name: "TV (75\"+)", price: 100, quantity: 0, icon: "📺", category: "Electronics" },
  { id: "computer", name: "Computer / Desktop", price: 30, quantity: 0, icon: "🖥️", category: "Electronics" },
  { id: "printer", name: "Printer", price: 25, quantity: 0, icon: "🖨️", category: "Electronics" },
  { id: "stereo", name: "Stereo System", price: 50, quantity: 0, icon: "🔊", category: "Electronics" },

  // === Outdoor & Yard ===
  { id: "yard-waste", name: "Yard Waste Bag", price: 15, quantity: 0, icon: "🍂", category: "Outdoor & Yard" },
  { id: "tree-branch", name: "Tree Branch Bundle", price: 25, quantity: 0, icon: "🌿", category: "Outdoor & Yard" },
  // Lawnmower variants (popup)
  { id: "lawnmower-push", name: "Lawnmower - Push", price: 50, quantity: 0, icon: "🌱", category: "Outdoor & Yard" },
  { id: "lawnmower-riding", name: "Lawnmower - Riding", price: 300, quantity: 0, icon: "🌱", category: "Outdoor & Yard" },
  // Outdoor Furniture variants (popup)
  { id: "outdoor-furniture", name: "Outdoor Furniture", price: 30, quantity: 0, icon: "⛱️", category: "Outdoor & Yard" },
  { id: "outdoor-chair", name: "Outdoor Chair", price: 30, quantity: 0, icon: "⛱️", category: "Outdoor & Yard" },
  { id: "outdoor-sectional", name: "Outdoor Furniture - Sectional", price: 175, quantity: 0, icon: "⛱️", category: "Outdoor & Yard" },
  { id: "grill", name: "Grill / BBQ", price: 70, quantity: 0, icon: "🔥", category: "Outdoor & Yard" },
  { id: "trampoline", name: "Trampoline", price: 140, quantity: 0, icon: "🤸", category: "Outdoor & Yard" },
  { id: "shed", name: "Shed (small)", price: 350, quantity: 0, icon: "🏚️", category: "Outdoor & Yard" },

  // === Office ===
  // Desk variants (popup)
  { id: "desk-basic", name: "Desk", price: 30, quantity: 0, icon: "🪑", category: "Office" },
  { id: "desk-podium", name: "Podium", price: 20, quantity: 0, icon: "🎤", category: "Office" },
  { id: "desk-hutch", name: "Hutch", price: 35, quantity: 0, icon: "🪑", category: "Office" },
  { id: "desk-l-shaped", name: "Desk - L-Shaped", price: 40, quantity: 0, icon: "📐", category: "Office" },
  { id: "desk-u-shaped", name: "Desk - U Shaped", price: 35, quantity: 0, icon: "📐", category: "Office" },
  { id: "desk-motorized", name: "Desk - Motorized Sit/Stand", price: 50, quantity: 0, icon: "⚡", category: "Office" },
  { id: "desk-executive", name: "Desk - Executive", price: 80, quantity: 0, icon: "💼", category: "Office" },
  { id: "desk-cubicle", name: "Cubicle", price: 90, quantity: 0, icon: "🏢", category: "Office" },
  { id: "office-chair", name: "Office Chair", price: 20, quantity: 0, icon: "💺", category: "Office" },
  { id: "filing-cabinet", name: "Filing Cabinet", price: 50, quantity: 0, icon: "🗄️", category: "Office" },

  // === Cleanouts & Bulk Jobs ===
  { id: "bag-of-junk", name: "Bag of Junk", price: 20, quantity: 0, icon: "🗑️", category: "Cleanouts & Bulk Jobs" },
  { id: "boxes", name: "Boxes (per box)", price: 10, quantity: 0, icon: "📦", category: "Cleanouts & Bulk Jobs" },
  { id: "storage-bin", name: "Storage Bin", price: 12, quantity: 0, icon: "📦", category: "Cleanouts & Bulk Jobs" },
  { id: "load-small", name: "Small Load (pickup truck)", price: 150, quantity: 0, icon: "🚛", category: "Cleanouts & Bulk Jobs" },
  { id: "load-medium", name: "Medium Load", price: 250, quantity: 0, icon: "🚛", category: "Cleanouts & Bulk Jobs" },
  { id: "load-large", name: "Large Load", price: 400, quantity: 0, icon: "🚛", category: "Cleanouts & Bulk Jobs" },
  { id: "load-full", name: "Full Truck Load", price: 550, quantity: 0, icon: "🚛", category: "Cleanouts & Bulk Jobs" },
  // Construction debris
  { id: "drywall", name: "Drywall (per pile)", price: 100, quantity: 0, icon: "🧱", category: "Cleanouts & Bulk Jobs" },
  { id: "wood-debris", name: "Wood Debris", price: 120, quantity: 0, icon: "🪵", category: "Cleanouts & Bulk Jobs" },
  { id: "flooring", name: "Flooring (per room)", price: 150, quantity: 0, icon: "🏗️", category: "Cleanouts & Bulk Jobs" },
  { id: "tiles-concrete", name: "Tiles / Concrete", price: 200, quantity: 0, icon: "🧱", category: "Cleanouts & Bulk Jobs" },
  // Countertop variants (popup)
  { id: "countertop-laminate", name: "Countertop - Laminates", price: 30, quantity: 0, icon: "🏗️", category: "Cleanouts & Bulk Jobs" },
  { id: "countertop-stone", name: "Countertop - Stone", price: 50, quantity: 0, icon: "🏗️", category: "Cleanouts & Bulk Jobs" },
  // Custom jobs
  { id: "custom-xs", name: "Custom Job - XS", price: 75, quantity: 0, icon: "🔧", category: "Cleanouts & Bulk Jobs" },
  { id: "custom-s", name: "Custom Job - Small", price: 150, quantity: 0, icon: "🔧", category: "Cleanouts & Bulk Jobs" },
  { id: "custom-m", name: "Custom Job - Medium", price: 300, quantity: 0, icon: "🔧", category: "Cleanouts & Bulk Jobs" },
  { id: "custom-l", name: "Custom Job - Large", price: 500, quantity: 0, icon: "🔧", category: "Cleanouts & Bulk Jobs" },

  // === Miscellaneous ===
  { id: "rug", name: "Rug / Carpet", price: 30, quantity: 0, icon: "🧶", category: "Miscellaneous" },
  { id: "exercise-equip", name: "Exercise Equipment", price: 80, quantity: 0, icon: "🏋️", category: "Miscellaneous" },
  // Treadmill variants (popup)
  { id: "treadmill-residential", name: "Treadmill - Residential", price: 95, quantity: 0, icon: "🏃", category: "Miscellaneous" },
  { id: "treadmill-commercial", name: "Treadmill - Commercial", price: 200, quantity: 0, icon: "🏃", category: "Miscellaneous" },
  { id: "elliptical", name: "Elliptical", price: 95, quantity: 0, icon: "🏋️", category: "Miscellaneous" },
  { id: "exercise-bike", name: "Exercise Bike", price: 50, quantity: 0, icon: "🚴", category: "Miscellaneous" },
  { id: "rowing-machine", name: "Rowing Exercise Machine", price: 100, quantity: 0, icon: "🚣", category: "Miscellaneous" },
  { id: "stair-climber", name: "Stair Climbing Machine", price: 95, quantity: 0, icon: "🏋️", category: "Miscellaneous" },
  // Toolbox variants (popup)
  { id: "toolbox-small", name: "Tool Box - Small", price: 25, quantity: 0, icon: "🧰", category: "Miscellaneous" },
  { id: "toolbox-freestanding", name: "Toolbox - Freestanding", price: 30, quantity: 0, icon: "🧰", category: "Miscellaneous" },
  { id: "toolbox-large", name: "Toolbox - Large Rolling", price: 150, quantity: 0, icon: "🧰", category: "Miscellaneous" },
  { id: "misc-power-tools", name: "Miscellaneous Power Tools", price: 15, quantity: 0, icon: "🔧", category: "Miscellaneous" },
  { id: "ladder", name: "Ladder", price: 25, quantity: 0, icon: "🪜", category: "Miscellaneous" },
  { id: "lamp", name: "Lamp (floor/table)", price: 15, quantity: 0, icon: "💡", category: "Miscellaneous" },
  { id: "fan", name: "Fan (standing)", price: 15, quantity: 0, icon: "🌀", category: "Miscellaneous" },
  { id: "vacuum", name: "Vacuum Cleaner", price: 20, quantity: 0, icon: "🧹", category: "Miscellaneous" },
  { id: "suitcase", name: "Suitcase / Luggage", price: 15, quantity: 0, icon: "🧳", category: "Miscellaneous" },
  { id: "mileage", name: "Mileage Surcharge", price: 25, quantity: 0, icon: "🚛", category: "Miscellaneous" },
  // Misc Unlisted variants (popup)
  { id: "misc-unlisted-small", name: "Misc. Small Unlisted Item", price: 35, quantity: 0, icon: "📦", category: "Miscellaneous" },
  { id: "misc-unlisted-medium", name: "Misc. Medium Unlisted Item", price: 75, quantity: 0, icon: "📦", category: "Miscellaneous" },
  { id: "misc-unlisted-large", name: "Misc. Large Unlisted Item", price: 150, quantity: 0, icon: "📦", category: "Miscellaneous" },
  // Baby items
  { id: "baby-crib", name: "Baby Crib", price: 45, quantity: 0, icon: "🍼", category: "Miscellaneous" },
  { id: "baby-stroller", name: "Stroller", price: 20, quantity: 0, icon: "🍼", category: "Miscellaneous" },
  { id: "baby-car-seat", name: "Car Seat", price: 15, quantity: 0, icon: "🍼", category: "Miscellaneous" },
  { id: "baby-high-chair", name: "High Chair", price: 20, quantity: 0, icon: "🍼", category: "Miscellaneous" },
  { id: "baby-changing-table", name: "Changing Table", price: 35, quantity: 0, icon: "🍼", category: "Miscellaneous" },

  // === Heavy / Specialty Items ===
  { id: "hot-tub", name: "Hot Tub / Spa", price: 500, quantity: 0, icon: "🛁", category: "Heavy / Specialty Items" },
  { id: "piano-upright", name: "Piano - Upright", price: 250, quantity: 0, icon: "🎹", category: "Heavy / Specialty Items" },
  { id: "piano-grand", name: "Piano - Grand / Baby Grand", price: 450, quantity: 0, icon: "🎹", category: "Heavy / Specialty Items" },
  { id: "safe-small", name: "Safe (under 200 lbs)", price: 150, quantity: 0, icon: "🔒", category: "Heavy / Specialty Items" },
  { id: "safe-large", name: "Safe (200+ lbs)", price: 300, quantity: 0, icon: "🔒", category: "Heavy / Specialty Items" },
  { id: "pool-table", name: "Pool Table", price: 350, quantity: 0, icon: "🎱", category: "Heavy / Specialty Items" },
];

export interface LoadSize {
  id: string;
  fraction: number;
  price: number;
}

interface FunnelState {
  step: number;
  zip: string;
  pricingMethod: "items" | "load" | null;
  selectedLoadSize: LoadSize | null;
  items: ItemSelection[];
  addOns: AddOns;
  customerInfo: CustomerInfo;
  totalPrice: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
}

interface FunnelContextType extends Omit<FunnelState, 'subtotal' | 'discountPercent' | 'discountAmount'> {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  setStep: (s: number) => void;
  setZip: (z: string) => void;
  setPricingMethod: (m: "items" | "load") => void;
  setSelectedLoadSize: (l: LoadSize | null) => void;
  setItems: (items: ItemSelection[]) => void;
  setAddOns: (a: AddOns) => void;
  setCustomerInfo: (c: CustomerInfo) => void;
  calculateTotal: () => { total: number; subtotal: number; discountPercent: number; discountAmount: number };
  next: () => void;
  back: () => void;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export const useFunnel = () => {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider");
  return ctx;
};

export const FunnelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(0);
  const [zip, setZip] = useState("");
  const [pricingMethod, setPricingMethod] = useState<"items" | "load" | null>(null);
  const [selectedLoadSize, setSelectedLoadSize] = useState<LoadSize | null>(null);
  const [items, setItems] = useState<ItemSelection[]>(DEFAULT_ITEMS);

  // Load catalog from database (admin-managed). Falls back to DEFAULT_ITEMS on error.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("id, name, price, icon, category, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (cancelled || error || !data || data.length === 0) return;
      // Preserve any quantities already in state (in case of re-fetch / restore from localStorage)
      setItems((prev) => {
        const qtyMap = new Map(prev.map((p) => [p.id, p.quantity]));
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          price: Number(d.price) || 0,
          quantity: qtyMap.get(d.id) ?? 0,
          icon: d.icon,
          category: d.category,
        }));
      });
    })();
    return () => { cancelled = true; };
  }, []);
  const [addOns, setAddOns] = useState<AddOns>({ stairs: 0, disassembly: 0, sameDay: false });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "", phone: "", email: "", address: "", date: undefined, timeSlot: "", notes: "",
  });

  const calculateTotal = useCallback(() => {
    let itemsTotal = 0;
    if (pricingMethod === "load" && selectedLoadSize) {
      itemsTotal = selectedLoadSize.price;
    } else {
      itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    let addOnsTotal = 0;
    addOnsTotal += (Number(addOns.stairs) || 0) * ADDON_UNIT_PRICES.stairs;
    addOnsTotal += (Number(addOns.disassembly) || 0) * ADDON_UNIT_PRICES.disassembly;
    if (addOns.sameDay) addOnsTotal += ADDON_UNIT_PRICES.sameDay;

    // Volume discounts / promotions are disabled.
    const discountPercent = 0;
    const discountAmount = 0;
    const subtotal = itemsTotal + addOnsTotal + AREA_SERVICE_FEE;
    const total = subtotal;
    return { total, subtotal, discountPercent, discountAmount };
  }, [items, addOns, pricingMethod, selectedLoadSize]);

  const { total: totalPrice, subtotal, discountPercent, discountAmount } = calculateTotal();

  const next = () => setStep((s) => Math.min(s + 1, 8));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Persist to localStorage
  useEffect(() => {
    const data = { zip, pricingMethod, selectedLoadSize, items, addOns, customerInfo: { ...customerInfo, date: customerInfo.date?.toISOString() } };
    localStorage.setItem("junkfunnel", JSON.stringify(data));
  }, [zip, items, addOns, customerInfo]);

  return (
    <FunnelContext.Provider value={{
      step, zip, pricingMethod, selectedLoadSize, items, addOns, customerInfo, totalPrice, subtotal, discountPercent, discountAmount,
      setStep, setZip, setPricingMethod, setSelectedLoadSize, setItems, setAddOns, setCustomerInfo, calculateTotal, next, back,
    }}>
      {children}
    </FunnelContext.Provider>
  );
};

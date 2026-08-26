import { useFunnel, SEARCH_SYNONYMS } from "@/context/FunnelContext";
import { ITEM_CATEGORIES } from "@/context/FunnelContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ChevronDown, Star, Clock, Search, ShieldCheck, Tag, X, Award, HelpCircle } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import CustomItemModal from "./CustomItemModal";
import LiveAgentCard from "./LiveAgentCard";
import { ITEM_ICONS, VIRTUAL_ICONS } from "@/assets/icons";

const ItemIcon = ({ id, name, size = "w-7 h-7" }: { id: string; name: string; size?: string }) => {
  const src = ITEM_ICONS[id];
  if (src) {
    return <img src={src} alt={name} width={48} height={48} className={`${size} object-contain`} loading="lazy" decoding="async" />;
  }
  return <span className="text-2xl">📦</span>;
};

// IDs that require popup config
const MATTRESS_VARIANT_IDS = ["mattress-crib", "mattress-twin", "mattress-full", "mattress-queen", "mattress-king"];
const BOXSPRING_VARIANT_IDS = ["boxspring-twin", "boxspring-full", "boxspring-queen", "boxspring-king"];
const COUCH_VARIANT_IDS = [
  "couch-basic", "couch-futon", "couch-reclining", "couch-loveseat-reclining", "couch-sleeper",
  "couch-sectional-2", "couch-sectional-3", "couch-sectional-4", "couch-sectional-5", "couch-sectional-6",
  "couch-sectional-sleeper", "couch-sectional-recliner",
];
const DRESSER_VARIANT_IDS = [
  "dresser-nightstand", "dresser-mirror", "dresser-lingerie",
  "dresser-vertical", "dresser-vertical-chest",
  "dresser-horizontal", "dresser-horizontal-chest", "dresser-double",
  "dresser-combo", "dresser-gentlemans",
];
const DESK_VARIANT_IDS = [
  "desk-basic", "desk-podium", "desk-hutch",
  "desk-l-shaped", "desk-u-shaped", "desk-motorized",
  "desk-executive", "desk-cubicle",
];
const TABLE_VARIANT_IDS = ["table-coffee", "table-generic", "table-dining", "table-conference"];
const FREEZER_VARIANT_IDS = ["freezer-chest", "freezer-residential", "freezer-commercial"];
const TOOLBOX_VARIANT_IDS = ["toolbox-small", "toolbox-freestanding", "toolbox-large"];
const VANITY_VARIANT_IDS = ["vanity-small", "vanity-medium", "vanity-large"];
const LAWNMOWER_VARIANT_IDS = ["lawnmower-push", "lawnmower-riding"];
const TREADMILL_VARIANT_IDS = ["treadmill-residential", "treadmill-commercial"];
const WINE_COOLER_VARIANT_IDS = ["wine-cooler-small", "wine-cooler-large"];
const COUNTERTOP_VARIANT_IDS = ["countertop-laminate", "countertop-stone"];
const MISC_UNLISTED_VARIANT_IDS = ["misc-unlisted-small", "misc-unlisted-medium", "misc-unlisted-large"];
const OUTDOOR_FURNITURE_VARIANT_IDS = ["outdoor-furniture", "outdoor-chair", "outdoor-sectional"];

const HIDDEN_VARIANT_IDS = [
  ...MATTRESS_VARIANT_IDS, ...BOXSPRING_VARIANT_IDS, ...COUCH_VARIANT_IDS,
  ...DRESSER_VARIANT_IDS, ...DESK_VARIANT_IDS, ...TABLE_VARIANT_IDS,
  ...FREEZER_VARIANT_IDS, ...TOOLBOX_VARIANT_IDS, ...VANITY_VARIANT_IDS,
  ...LAWNMOWER_VARIANT_IDS, ...TREADMILL_VARIANT_IDS, ...WINE_COOLER_VARIANT_IDS,
  ...COUNTERTOP_VARIANT_IDS, ...MISC_UNLISTED_VARIANT_IDS, ...OUTDOOR_FURNITURE_VARIANT_IDS,
];

// Recommended high-value items
const RECOMMENDED_IDS = new Set(["hot-tub", "piano-upright", "piano-grand", "safe-small", "safe-large", "pool-table", "shed"]);

// Virtual popular items (triggers popup)
const VIRTUAL_POPULAR = [
  { id: "mattress", name: "Mattress", priceLabel: "From $15" },
  { id: "boxspring", name: "Box Spring", priceLabel: "From $15" },
  { id: "couch", name: "Couch / Loveseat", priceLabel: "From $30" },
  { id: "dresser", name: "Dresser", priceLabel: "From $20" },
  { id: "desk", name: "Desk", priceLabel: "From $20" },
  { id: "table", name: "Table", priceLabel: "From $25" },
  { id: "freezer", name: "Freezer", priceLabel: "From $50" },
  { id: "toolbox", name: "Toolbox", priceLabel: "From $25" },
];

const COUCH_GROUPS = [
  { label: "Basic Seating", ids: ["couch-basic", "couch-futon"] },
  { label: "Reclining / Specialty", ids: ["couch-reclining", "couch-loveseat-reclining", "couch-sleeper"], mostCommon: ["couch-reclining", "couch-sleeper"] },
  { label: "Sectionals", ids: ["couch-sectional-2", "couch-sectional-3", "couch-sectional-4", "couch-sectional-5", "couch-sectional-6"] },
  { label: "Premium Sectionals", ids: ["couch-sectional-sleeper", "couch-sectional-recliner"] },
];

const DRESSER_GROUPS = [
  { label: "Small Items", ids: ["dresser-nightstand", "dresser-mirror", "dresser-lingerie"], mostCommon: ["dresser-nightstand"] },
  { label: "Vertical Storage", ids: ["dresser-vertical", "dresser-vertical-chest"] },
  { label: "Horizontal / Standard", ids: ["dresser-horizontal", "dresser-horizontal-chest", "dresser-double"], mostCommon: ["dresser-horizontal", "dresser-double"] },
  { label: "Larger / Premium Storage", ids: ["dresser-combo", "dresser-gentlemans"] },
];

const DESK_GROUPS = [
  { label: "Basic / Standard", ids: ["desk-basic", "desk-podium", "desk-hutch"] },
  { label: "Specialty Desks", ids: ["desk-l-shaped", "desk-u-shaped", "desk-motorized", "desk-executive"], mostCommon: ["desk-executive"] },
  { label: "Office / Commercial", ids: ["desk-cubicle"], mostCommon: ["desk-cubicle"] },
];

type ConfigPopup =
  | "mattress" | "boxspring" | "couch" | "dresser" | "desk"
  | "table" | "freezer" | "toolbox" | "vanity" | "lawnmower"
  | "treadmill" | "wine-cooler" | "countertop" | "misc-unlisted"
  | "outdoor-furniture" | null;

// Items that trigger a popup when added from search
const POPUP_TRIGGER_MAP: Record<string, ConfigPopup> = {};
MATTRESS_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "mattress");
BOXSPRING_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "boxspring");
COUCH_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "couch");
DRESSER_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "dresser");
DESK_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "desk");
TABLE_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "table");
FREEZER_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "freezer");
TOOLBOX_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "toolbox");
VANITY_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "vanity");
LAWNMOWER_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "lawnmower");
TREADMILL_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "treadmill");
WINE_COOLER_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "wine-cooler");
COUNTERTOP_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "countertop");
MISC_UNLISTED_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "misc-unlisted");
OUTDOOR_FURNITURE_VARIANT_IDS.forEach(id => POPUP_TRIGGER_MAP[id] = "outdoor-furniture");

const StepItems = () => {
  const { items, setItems, totalPrice, setStep } = useFunnel();
  const [openCategory, setOpenCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [configPopup, setConfigPopup] = useState<ConfigPopup>(null);
  const [customItemModal, setCustomItemModal] = useState(false);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateQty = (id: string, delta: number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) }: item
    ));
  };

  const addVariant = (id: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 }: item
    ));
    setConfigPopup(null);
  };

  const handleAddItem = (id: string) => {
    if (POPUP_TRIGGER_MAP[id]) {
      setConfigPopup(POPUP_TRIGGER_MAP[id]!);
      return;
    }
    updateQty(id, 1);
    setSearch("");
    setSearchFocused(false);
  };

  // Count of variants in cart
  const countVariants = (ids: string[]) => items.filter(i => ids.includes(i.id) && i.quantity > 0).reduce((s, i) => s + i.quantity, 0);
  const mattressCount = countVariants(MATTRESS_VARIANT_IDS);
  const boxspringCount = countVariants(BOXSPRING_VARIANT_IDS);
  const couchCount = countVariants(COUCH_VARIANT_IDS);
  const dresserCount = countVariants(DRESSER_VARIANT_IDS);
  const deskCount = countVariants(DESK_VARIANT_IDS);
  const tableCount = countVariants(TABLE_VARIANT_IDS);
  const freezerCount = countVariants(FREEZER_VARIANT_IDS);
  const toolboxCount = countVariants(TOOLBOX_VARIANT_IDS);

  const hasItems = items.some((i) => i.quantity > 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = totalPrice;

  // Promotions/volume discounts are disabled.


  // Real popular items (non-popup)
  const realPopularItems = items.filter((i) => ["recliner", "bag-of-junk"].includes(i.id));

  // Fuzzy search with synonyms
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();

    const synonymMatches = new Set<string>();
    Object.entries(SEARCH_SYNONYMS).forEach(([keyword, ids]) => {
      if (keyword.includes(q) || q.includes(keyword)) {
        ids.forEach(id => synonymMatches.add(id));
      }
    });

    return items.filter(i => {
      if (HIDDEN_VARIANT_IDS.includes(i.id)) {
        return i.name.toLowerCase().includes(q);
      }
      return i.name.toLowerCase().includes(q) ||
             i.category.toLowerCase().includes(q) ||
             synonymMatches.has(i.id);
    }).slice(0, 12);
  }, [search, items]);

  const showDropdown = searchFocused && search.trim().length > 0;

  // Cart variants
  const cartVariants = items.filter(i => HIDDEN_VARIANT_IDS.includes(i.id) && i.quantity > 0);
  const cartRegular = items.filter(i => !HIDDEN_VARIANT_IDS.includes(i.id) && i.quantity > 0);

  // Category items (exclude hidden variants)
  const getVisibleCategoryItems = (cat: string) =>
    items.filter(i => i.category === cat && !HIDDEN_VARIANT_IDS.includes(i.id));

  const getCategoryCount = (cat: string) =>
    items.filter((i) => i.category === cat && i.quantity > 0).length;

  // Variants data for popups
  const getVariants = (ids: string[]) => items.filter(i => ids.includes(i.id));

  // Helper to get virtual popular count
  const getVirtualCount = (id: string): number => {
    switch (id) {
      case "mattress": return mattressCount;
      case "boxspring": return boxspringCount;
      case "couch": return couchCount;
      case "dresser": return dresserCount;
      case "desk": return deskCount;
      case "table": return tableCount;
      case "freezer": return freezerCount;
      case "toolbox": return toolboxCount;
      default: return 0;
    }
  };

  // Simple popup renderer for flat variant lists
  const renderSimplePopup = (
    popupId: ConfigPopup,
    title: string,
    subtitle: string,
    variantIds: string[],
  ) => (
    <Dialog open={configPopup === popupId} onOpenChange={(open) => !open && setConfigPopup(null)}>
      <DialogContent className="sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl p-0 gap-0">
        <DialogHeader className="p-5 pb-2">
          <DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </DialogHeader>
        <div className="p-5 pt-2 space-y-2">
          {getVariants(variantIds).map((variant) => (
            <button
              key={variant.id}
              onClick={() => addVariant(variant.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <ItemIcon id={variant.id} name={variant.name} />
                <span className="font-medium text-foreground">{variant.name}</span>
              </div>
              <span className="text-lg font-bold text-primary">${variant.price}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Grouped popup renderer
  const renderGroupedPopup = (
    popupId: ConfigPopup,
    title: string,
    subtitle: string,
    groups: { label: string; ids: string[]; mostCommon?: string[]; note?: string }[],
    footerNote?: string,
  ) => (
    <Dialog open={configPopup === popupId} onOpenChange={(open) => !open && setConfigPopup(null)}>
      <DialogContent className="sm:max-w-lg mx-auto rounded-t-2xl sm:rounded-2xl p-0 gap-0 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="p-5 pb-2 sticky top-0 bg-card z-10">
          <DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </DialogHeader>
        <div className="p-5 pt-2 space-y-5">
          {groups.map((group) => {
            const groupVariants = items.filter(i => group.ids.includes(i.id));
            return (
              <div key={group.label}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{group.label}</p>
                {group.note && <p className="text-[11px] text-muted-foreground mb-2">{group.note}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groupVariants.map((variant) => {
                    const isMostCommon = group.mostCommon?.includes(variant.id);
                    return (
                      <button
                        key={variant.id}
                        onClick={() => addVariant(variant.id)}
                        className="relative flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary transition-all active:scale-[0.98]"
                      >
                        {isMostCommon && (
                          <Badge className="absolute -top-2 -right-1 text-[9px] px-1.5 py-0 bg-primary/90">Most Common</Badge>
                        )}
                        <div className="flex items-center gap-3">
                          <ItemIcon id={variant.id} name={variant.name} size="w-6 h-6" />
                          <span className="font-medium text-foreground text-sm text-left">{variant.name}</span>
                        </div>
                        <span className="text-base font-bold text-primary ml-2 whitespace-nowrap">${variant.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {footerNote && <p className="text-xs text-muted-foreground text-center pt-1">{footerNote}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-lg mx-auto px-4 py-6 pb-32"
    >
      <h2 className="text-2xl font-bold text-foreground mb-1">What are we picking up?</h2>
      <p className="text-muted-foreground mb-3 text-sm">Search or browse • Instant upfront pricing</p>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <span>Save more when you remove more</span>
        </div>
      </div>

      {/* Urgency banner */}
      <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-2.5 mb-4">
        <Clock className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">Limited same-day slots available</span>
      </div>




      {/* === MOST POPULAR ITEMS === */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Most Popular Items</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VIRTUAL_POPULAR.map((vItem) => {
            const count = getVirtualCount(vItem.id);
            return (
              <div
                key={vItem.id}
                className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                  count > 0
                    ? "border-primary bg-primary/10 shadow-sm"
                   : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <Badge className="absolute -top-2 -right-1 text-[9px] px-1.5 py-0 bg-primary/90">
                  Most Booked
                </Badge>
                {VIRTUAL_ICONS[vItem.id] ? <img src={VIRTUAL_ICONS[vItem.id]} alt={vItem.name} width={28} height={28} className="w-7 h-7 mb-1 object-contain" loading="lazy" decoding="async" />: null}
                <p className="text-xs font-medium text-foreground text-center leading-tight">{vItem.name}</p>
                <p className="text-sm font-bold text-primary mt-0.5">{vItem.priceLabel}</p>
                {count === 0 ? (
                  <button
                    onClick={() => setConfigPopup(vItem.id as ConfigPopup)}
                    className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    + Add
                  </button>
                ): (
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-primary">{count} in cart</span>
                    <button
                      onClick={() => setConfigPopup(vItem.id as ConfigPopup)}
                      className="text-xs font-medium text-primary underline underline-offset-2"
                    >
                      Add another
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {realPopularItems.map((item) => (
            <div
              key={item.id}
              className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                item.quantity > 0
                  ? "border-primary bg-primary/10 shadow-sm"
                 : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <Badge className="absolute -top-2 -right-1 text-[9px] px-1.5 py-0 bg-primary/90">
                Most Booked
              </Badge>
              <ItemIcon id={item.id} name={item.name} />
              <p className="text-xs font-medium text-foreground text-center leading-tight">{item.name}</p>
              <p className="text-sm font-bold text-primary mt-0.5">${item.price}</p>
              {item.quantity === 0 ? (
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  + Add
                </button>
              ): (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === CART SELECTIONS === */}
      {(cartVariants.length > 0 || cartRegular.length > 0 || customItems.length > 0) && (
        <div className="mb-6 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Your Selections</p>
          <div className="space-y-2">
            {[...cartVariants, ...cartRegular].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <ItemIcon id={item.id} name={item.name} size="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price} each</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Custom items pending pricing */}
            {customItems.map((desc, i) => (
              <div key={`custom-${i}`} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">📋</span>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">Custom: {desc}</p>
                    <p className="text-xs text-muted-foreground italic">Price Pending</p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomItems(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {customItems.length > 0 && (
            <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">We will confirm custom item pricing before final charge.</p>
          )}
          <button
            onClick={() => setCustomItemModal(true)}
            className="mt-2 text-xs text-primary hover:underline font-medium"
          >
            + Add unlisted item
          </button>
        </div>
      )}

      {/* === SMART SEARCH === */}
      <div className="mb-5 relative">
        <h3 className="font-semibold text-foreground mb-3">Find Any Item</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <input
            ref={searchRef}
            type="text"
            placeholder='Search for anything (e.g. couch, fridge, treadmill, piano…)'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-9 pr-10 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button onClick={() => { setSearch(""); setSearchFocused(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-40 max-h-[320px] overflow-y-auto"
            >
              {searchResults.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No items found for "{search}"</p>
                  <button
                    onClick={() => { setCustomItemModal(true); setSearchFocused(false); }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Can't find it? We'll price it for you →
                  </button>
                </div>
              ): (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleAddItem(item.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ItemIcon id={item.id} name={item.name} size="w-6 h-6" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                          {RECOMMENDED_IDS.has(item.id) && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/50 text-primary">
                              <Award className="w-2.5 h-2.5 mr-0.5" /> Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-primary">${item.price}</span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-primary text-primary-foreground">
                        {item.quantity > 0 ? `${item.quantity} ✓`: "+ Add"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Can't find your item CTA */}
        <button
          onClick={() => setCustomItemModal(true)}
          className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          Can't find your item? We'll price it for you.
        </button>
      </div>

      {/* === CATEGORY BROWSING === */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-3">Browse by Category</h3>
      </div>
      <div className="space-y-2.5">
        {ITEM_CATEGORIES.map((cat) => {
          const catItems = getVisibleCategoryItems(cat);
          if (catItems.length === 0) return null;
          const isOpen = openCategory === cat;
          const count = getCategoryCount(cat);

          return (
            <div key={cat} className="rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenCategory(isOpen ? "": cat)}
                className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{cat}</span>
                  {count > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180": ""}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border overflow-hidden"
                  >
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border transition-colors ${
                          item.quantity > 0 ? "bg-secondary": ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemIcon id={item.id} name={item.name} size="w-6 h-6" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                              {RECOMMENDED_IDS.has(item.id) && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/50 text-primary whitespace-nowrap">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">${item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.quantity === 0 ? (
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                              + Add
                            </button>
                          ): (
                            <>
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="mt-6">
        <Button variant="outline" onClick={() => setStep(2)} className="w-full h-12 rounded-xl">Back</Button>
      </div>

      <LiveAgentCard />

      {/* === STICKY BOTTOM BAR === */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {hasItems ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">${subtotal}</span>
                </div>
                <p className="text-xs text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s": ""}</p>
              </>
            ): (
              <p className="text-sm text-muted-foreground">Select items above</p>
            )}
          </div>
          <Button
            onClick={() => setStep(5)}
            disabled={!hasItems}
            className="h-12 px-6 rounded-xl font-semibold whitespace-nowrap"
          >
            View Price & Book
          </Button>
        </div>
      </div>

      {/* === POPUP DIALOGS === */}

      {/* Mattress */}
      {renderSimplePopup("mattress", "What type of mattress do you have?", "Select your item size for accurate pricing", MATTRESS_VARIANT_IDS)}

      {/* Box Spring */}
      {renderSimplePopup("boxspring", "What size box spring?", "Select your item size for accurate pricing", BOXSPRING_VARIANT_IDS)}

      {/* Couch */}
      {renderGroupedPopup("couch", "What type of couch are you removing?", "Select the option that best matches your item for accurate pricing", COUCH_GROUPS)}

      {/* Dresser */}
      {renderGroupedPopup("dresser", "What type of dresser or bedroom furniture are you removing?", "Select the closest match for accurate pricing", DRESSER_GROUPS, "We safely remove all bedroom furniture")}

      {/* Desk */}
      {renderGroupedPopup("desk", "What type of desk or office furniture are you removing?", "Choose the closest match for accurate pricing", DESK_GROUPS, "We safely remove home and office furniture")}

      {/* Table */}
      {renderSimplePopup("table", "What type of table are you removing?", "Select the closest match for accurate pricing", TABLE_VARIANT_IDS)}

      {/* Freezer */}
      {renderSimplePopup("freezer", "What type of freezer do you have?", "Select the size for accurate pricing", FREEZER_VARIANT_IDS)}

      {/* Toolbox */}
      {renderSimplePopup("toolbox", "What type of toolbox?", "Select the size for accurate pricing", TOOLBOX_VARIANT_IDS)}

      {/* Vanity */}
      {renderSimplePopup("vanity", "What size vanity are you removing?", "Select the size for accurate pricing", VANITY_VARIANT_IDS)}

      {/* Lawnmower */}
      {renderSimplePopup("lawnmower", "What type of lawnmower?", "Select the type for accurate pricing", LAWNMOWER_VARIANT_IDS)}

      {/* Treadmill */}
      {renderSimplePopup("treadmill", "What type of treadmill?", "Select the type for accurate pricing", TREADMILL_VARIANT_IDS)}

      {/* Wine Cooler */}
      {renderSimplePopup("wine-cooler", "What size wine cooler?", "Select the size for accurate pricing", WINE_COOLER_VARIANT_IDS)}

      {/* Countertop */}
      {renderSimplePopup("countertop", "What type of countertop?", "Material affects removal difficulty and pricing", COUNTERTOP_VARIANT_IDS)}

      {/* Misc Unlisted */}
      {renderSimplePopup("misc-unlisted", "What size is the unlisted item?", "Select the closest size match", MISC_UNLISTED_VARIANT_IDS)}

      {/* Outdoor Furniture */}
      {renderSimplePopup("outdoor-furniture", "What type of outdoor furniture?", "Select the closest match for accurate pricing", OUTDOOR_FURNITURE_VARIANT_IDS)}

      {/* === CUSTOM ITEM MODAL === */}
      <CustomItemModal
        open={customItemModal}
        onClose={() => setCustomItemModal(false)}
        onItemAdded={(desc) => setCustomItems(prev => [...prev, desc])}
      />
    </motion.div>
  );
};

export default StepItems;

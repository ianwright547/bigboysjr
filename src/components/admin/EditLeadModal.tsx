import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Trash2, Search, Save, Loader2, RefreshCw } from "lucide-react";
import { DEFAULT_ITEMS, ADDON_UNIT_PRICES, AREA_SERVICE_FEE } from "@/context/FunnelContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


type LineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon?: string;
  category?: string;
};

type AddOnsState = { stairs: number; disassembly: number; sameDay: boolean };

type LoadSize = { id: string; fraction?: number; price: number } | null;

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  zip_code: string | null;
  pricing_method: string | null;
  selected_items: any;
  load_size: any;
  add_ons: any;
  total_price: number | null;
  message: string | null;
  status: string;
  booking_date: string | null;
  time_slot: string | null;
}

interface Props {
  lead: Lead;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Lead) => void;
  mode?: "edit" | "create";
}

const ADDON_PRICES = ADDON_UNIT_PRICES;

// Load size tiers — must stay in sync with the customer funnel (StepLoadSize)
const LOAD_LEVELS = [
  { fraction: 1, label: "1/8 Load (~2 cu yd)", price: 99 },
  { fraction: 2, label: "2/8 Load (~4 cu yd)", price: 199 },
  { fraction: 3, label: "3/8 Load (~6 cu yd)", price: 250 },
  { fraction: 4, label: "4/8 Load (~8 cu yd)", price: 379 },
  { fraction: 5, label: "5/8 Load (~10 cu yd)", price: 450 },
  { fraction: 6, label: "6/8 Load (~12 cu yd)", price: 499 },
  { fraction: 7, label: "7/8 Load (~14 cu yd)", price: 599 },
  { fraction: 8, label: "Full Load (~16 cu yd)", price: 649 },
];


// Read add-ons from a lead row, supporting both new (number/sameDay) and legacy (boolean stairs/heavy/disassembly) shapes.
const parseAddOns = (raw: any): AddOnsState => {
  const a = raw || {};
  const stairs = typeof a.stairs === "number" ? a.stairs : a.stairs ? 1 : 0;
  const disassembly = typeof a.disassembly === "number" ? a.disassembly : a.disassembly ? 1 : 0;
  const sameDay = !!a.sameDay;
  return { stairs, disassembly, sameDay };
};

const EditLeadModal = ({ lead, open, onClose, onSaved, mode = "edit" }: Props) => {
  const isCreate = mode === "create";
  // Form state
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email || "");
  const [address, setAddress] = useState(lead.address || "");
  const [zip, setZip] = useState(lead.zip_code || "");
  const [pricingMethod, setPricingMethod] = useState<string>(lead.pricing_method || "items");
  const [items, setItems] = useState<LineItem[]>(
    Array.isArray(lead.selected_items) ? (lead.selected_items as LineItem[]) : []
  );
  const [loadSize, setLoadSize] = useState<LoadSize>(
    lead.load_size && typeof lead.load_size === "object" ? (lead.load_size as LoadSize) : null
  );
  const [addOns, setAddOns] = useState<AddOnsState>(parseAddOns(lead.add_ons));
  const [totalPrice, setTotalPrice] = useState<string>(lead.total_price != null ? String(lead.total_price) : "");
  const [overrideTotal, setOverrideTotal] = useState(false);
  const [bookingDate, setBookingDate] = useState(lead.booking_date || "");
  const [timeSlot, setTimeSlot] = useState(lead.time_slot || "");
  const [notes, setNotes] = useState(lead.message || "");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [catalog, setCatalog] = useState<{ id: string; name: string; price: number; icon: string; category: string }[]>(
    DEFAULT_ITEMS.map((i) => ({ id: i.id, name: i.name, price: i.price, icon: i.icon, category: i.category }))
  );

  // Load the live catalog so prices always match what customers see
  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data } = await supabase
        .from("catalog_items")
        .select("id, name, price, icon, category")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length) {
        setCatalog(data.map((d) => ({ ...d, price: Number(d.price) })));
      }
    })();
  }, [open]);

  // Reset state when lead changes
  useEffect(() => {
    setName(lead.name);
    setPhone(lead.phone);
    setEmail(lead.email || "");
    setAddress(lead.address || "");
    setZip(lead.zip_code || "");
    setPricingMethod(lead.pricing_method || "items");
    setItems(Array.isArray(lead.selected_items) ? (lead.selected_items as LineItem[]) : []);
    setLoadSize(lead.load_size && typeof lead.load_size === "object" ? (lead.load_size as LoadSize) : null);
    setAddOns(parseAddOns(lead.add_ons));
    setTotalPrice(lead.total_price != null ? String(lead.total_price) : "");
    setOverrideTotal(false);
    setBookingDate(lead.booking_date || "");
    setTimeSlot(lead.time_slot || "");
    setNotes(lead.message || "");
    setSearch("");
  }, [lead.id]);

  const itemsSubtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0),
    [items]
  );

  const addOnsSubtotal = useMemo(
    () =>
      (Number(addOns.stairs) || 0) * ADDON_PRICES.stairs +
      (Number(addOns.disassembly) || 0) * ADDON_PRICES.disassembly +
      (addOns.sameDay ? ADDON_PRICES.sameDay : 0),
    [addOns]
  );

  const baseSubtotal = pricingMethod === "load" ? loadSize?.price || 0 : itemsSubtotal;

  // Auto-recalc total unless overridden
  const calculatedTotal = useMemo(
    () => baseSubtotal + addOnsSubtotal + AREA_SERVICE_FEE,
    [baseSubtotal, addOnsSubtotal]
  );

  useEffect(() => {
    if (!overrideTotal) setTotalPrice(String(calculatedTotal));
  }, [calculatedTotal, overrideTotal]);

  const filteredCatalog = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return catalog
      .filter((i) => i.name.toLowerCase().includes(q) || (i.category || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, catalog]);

  // Items whose saved price differs from the current catalog price
  const stalePriceCount = useMemo(
    () =>
      items.filter((i) => {
        const c = catalog.find((c) => c.id === i.id);
        return c && Number(c.price) !== Number(i.price);
      }).length,
    [items, catalog]
  );

  const syncCatalogPrices = () => {
    setItems((prev) =>
      prev.map((i) => {
        const c = catalog.find((c) => c.id === i.id);
        return c ? { ...i, price: Number(c.price), name: c.name } : i;
      })
    );
    setOverrideTotal(false);
    toast.success("Item prices updated to current catalog");
  };



  const addItemFromCatalog = (catalogItem: { id: string; name: string; price: number; icon: string; category: string }) => {
    const existing = items.find((i) => i.id === catalogItem.id);
    if (existing) {
      setItems(items.map((i) => (i.id === catalogItem.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setItems([
        ...items,
        { id: catalogItem.id, name: catalogItem.name, price: catalogItem.price, quantity: 1, icon: catalogItem.icon, category: catalogItem.category },
      ]);
    }
    setSearch("");
  };

  const addCustomItem = () => {
    const id = `custom-${Date.now()}`;
    setItems([...items, { id, name: "Custom Item", price: 0, quantity: 1, icon: "🔧", category: "Custom" }]);
  };

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  // Summary of changes for confirmation dialog
  const changes = useMemo(() => {
    const list: string[] = [];
    if (name.trim() !== lead.name) list.push(`Name: "${lead.name}" to "${name.trim()}"`);
    if (phone.trim() !== lead.phone) list.push(`Phone: "${lead.phone}" to "${phone.trim()}"`);
    if ((email.trim() || null) !== (lead.email || null)) list.push(`Email: "${lead.email || "Not set"}" to "${email.trim() || "Not set"}"`);
    if ((address.trim() || null) !== (lead.address || null)) list.push(`Address changed`);
    if ((zip.trim() || null) !== (lead.zip_code || null)) list.push(`ZIP: "${lead.zip_code || "Not set"}" to "${zip.trim() || "Not set"}"`);
    if (pricingMethod !== (lead.pricing_method || "items")) list.push(`Pricing method: ${lead.pricing_method || "items"} to ${pricingMethod}`);
    const origItems = Array.isArray(lead.selected_items) ? (lead.selected_items as LineItem[]) : [];
    if (pricingMethod === "items" && JSON.stringify(items) !== JSON.stringify(origItems)) {
      list.push(`Items updated (${origItems.length} to ${items.length})`);
    }
    if (pricingMethod === "load" && JSON.stringify(loadSize) !== JSON.stringify(lead.load_size)) {
      list.push(`Load size updated`);
    }
    const origAddOns = parseAddOns(lead.add_ons);
    if (JSON.stringify(addOns) !== JSON.stringify(origAddOns)) list.push(`Add-ons changed`);
    const newTotal = totalPrice === "" ? null : Number(totalPrice);
    if (newTotal !== lead.total_price) list.push(`Total: $${lead.total_price ?? "Not set"} to $${newTotal ?? "Not set"}`);
    if ((bookingDate || null) !== (lead.booking_date || null)) list.push(`Date: ${lead.booking_date || "Not set"} to ${bookingDate || "Not set"}`);
    if ((timeSlot || null) !== (lead.time_slot || null)) list.push(`Time slot: ${lead.time_slot || "Not set"} to ${timeSlot || "Not set"}`);
    if ((notes.trim() || null) !== (lead.message || null)) list.push(`Notes changed`);
    return list;
  }, [name, phone, email, address, zip, pricingMethod, items, loadSize, addOns, totalPrice, bookingDate, timeSlot, notes, lead]);

  const requestSave = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    if (!isCreate && changes.length === 0) {
      toast.info("No changes to save");
      return;
    }
    setShowConfirm(true);
  };

  const handleSave = async () => {
    setShowConfirm(false);
    setSaving(true);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      address: address.trim() || null,
      zip_code: zip.trim() || null,
      pricing_method: pricingMethod,
      selected_items: pricingMethod === "items" ? items : null,
      load_size: pricingMethod === "load" ? loadSize : null,
      add_ons: addOns,
      total_price: totalPrice === "" ? null : Number(totalPrice),
      booking_date: bookingDate || null,
      time_slot: timeSlot || null,
      message: notes.trim() || null,
    };

    if (isCreate) {
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...payload, request_type: "admin_order", save_source: "admin", status: "New" })
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast.error("Failed to create order: " + error.message);
        return;
      }
      toast.success("Order created");
      onSaved(data as Lead);
      onClose();
      return;
    }

    const { data, error } = await supabase.from("leads").update(payload).eq("id", lead.id).select().single();
    setSaving(false);
    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }
    toast.success("Lead updated");
    onSaved(data as Lead);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? "New Order" : `Edit Order: ${lead.name}`}</DialogTitle>
        </DialogHeader>


        <div className="space-y-5 py-2">
          {/* Customer Info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Customer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">ZIP</Label>
                <Input value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
          </section>

          {/* Pricing Method */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Pricing Method</h3>
            <Select value={pricingMethod} onValueChange={setPricingMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="items">📋 By Item</SelectItem>
                <SelectItem value="load">🚛 By Load Size</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Items */}
          {pricingMethod === "items" && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">Items ({items.length})</h3>
                <div className="flex items-center gap-2">
                  {stalePriceCount > 0 && (
                    <Button size="sm" variant="secondary" onClick={syncCatalogPrices} className="h-8 text-xs">
                      <RefreshCw className="w-3 h-3 mr-1" /> Update {stalePriceCount} price{stalePriceCount === 1 ? "" : "s"}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={addCustomItem} className="h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Custom
                  </Button>
                </div>
              </div>


              {/* Search catalog */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search catalog to add (e.g. couch, fridge)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                {filteredCatalog.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCatalog.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => addItemFromCatalog(c)}
                        className="w-full px-3 py-2 text-left hover:bg-muted flex items-center justify-between gap-2 text-sm"
                      >
                        <span>{c.icon} {c.name}</span>
                        <span className="text-xs text-muted-foreground">${c.price}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Item list */}
              <div className="space-y-2">
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No items. Search or add custom.</p>
                )}
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <span className="text-lg">{item.icon || "📦"}</span>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="h-8 text-sm flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, { price: Number(e.target.value) || 0 })}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded text-destructive hover:bg-destructive/10 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Load Size */}
          {pricingMethod === "load" && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Load Size</h3>
              <Select
                value={loadSize?.fraction ? String(loadSize.fraction) : ""}
                onValueChange={(v) => {
                  const level = LOAD_LEVELS.find((l) => String(l.fraction) === v)!;
                  setLoadSize({ id: `load-${level.fraction}`, fraction: level.fraction, price: level.price });
                  setOverrideTotal(false);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select load size" /></SelectTrigger>
                <SelectContent>
                  {LOAD_LEVELS.map((l) => (
                    <SelectItem key={l.fraction} value={String(l.fraction)}>
                      {l.label}: ${l.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <Label className="text-xs">Load price ($): adjust only if quoting a custom load</Label>
                <Input
                  type="number"
                  value={loadSize?.price ?? ""}
                  onChange={(e) =>
                    setLoadSize({ ...(loadSize || { id: "load-custom" }), price: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </section>
          )}

          {/* Add-ons */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Add-Ons</h3>
            <div className="space-y-2">
              {([
                { key: "stairs" as const, label: "Stairs", unit: "stair" },
                { key: "disassembly" as const, label: "Disassembly", unit: "item" },
              ]).map(({ key, label, unit }) => {
                const count = Number(addOns[key]) || 0;
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg gap-2">
                    <span className="text-sm">
                      {label} <span className="text-xs text-muted-foreground">(${ADDON_PRICES[key]} / {unit})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setAddOns({ ...addOns, [key]: Math.max(0, count - 1) })}
                        disabled={count === 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        value={count}
                        onChange={(e) => setAddOns({ ...addOns, [key]: Math.max(0, Number(e.target.value) || 0) })}
                        className="h-7 w-14 text-center px-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setAddOns({ ...addOns, [key]: count + 1 })}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm">Same Day Service <span className="text-xs text-muted-foreground">(+${ADDON_PRICES.sameDay})</span></span>
                <Switch checked={addOns.sameDay} onCheckedChange={(v) => setAddOns({ ...addOns, sameDay: v })} />
              </div>
            </div>
          </section>



          {/* Booking */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Booking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Time Slot</Label>
                <Select value={timeSlot || "none"} onValueChange={(v) => setTimeSlot(v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="morning">Morning (8am–12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm–4pm)</SelectItem>
                    <SelectItem value="evening">Evening (4pm–7pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Total */}
          <section className="space-y-2 p-3 bg-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Total Price</h3>
              <Badge variant="outline" className="text-xs">Auto: ${calculatedTotal}</Badge>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground border-b border-border/60 pb-2">
              <div className="flex justify-between">
                <span>{pricingMethod === "load" ? "Load size" : `Items (${items.length})`}</span>
                <span>${baseSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>${addOnsSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Area service fee</span>
                <span>${AREA_SERVICE_FEE}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">$</span>
              <Input
                type="number"
                value={totalPrice}
                onChange={(e) => { setOverrideTotal(true); setTotalPrice(e.target.value); }}
                className="text-lg font-bold h-10"
              />
              {overrideTotal && (
                <Button size="sm" variant="ghost" onClick={() => { setOverrideTotal(false); setTotalPrice(String(calculatedTotal)); }}>
                  Reset
                </Button>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <Label className="text-xs font-semibold">Internal Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={requestSave} disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />{isCreate ? "Create Order" : "Save Changes"}</>}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isCreate ? "Create this order?" : "Save changes to this order?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                {isCreate ? (
                  <p>
                    A new order for {name.trim() || "this customer"} will be created with a total of $
                    {totalPrice === "" ? 0 : Number(totalPrice)}.
                  </p>
                ) : (
                  <>
                    <p>You're about to overwrite this order with {changes.length} change{changes.length === 1 ? "" : "s"}:</p>
                    <ul className="text-sm bg-muted/50 rounded-md p-3 space-y-1 max-h-48 overflow-y-auto list-disc list-inside">
                      {changes.map((c, i) => (
                        <li key={i} className="text-foreground">{c}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Confirm & Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default EditLeadModal;

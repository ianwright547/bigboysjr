import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Trash2, Save, Loader2, Package, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type CatalogItem = {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
  sort_order: number;
  active: boolean;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `item-${Date.now()}`;

const CatalogManager = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Failed to load catalog: " + error.message);
      return;
    }
    setItems((data || []) as CatalogItem[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q),
    );
  }, [items, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogItem[]>();
    filtered.forEach((i) => {
      if (!map.has(i.category)) map.set(i.category, []);
      map.get(i.category)!.push(i);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const allCategories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items],
  );

  const toggleCat = (cat: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleActive = async (item: CatalogItem) => {
    const next = !item.active;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: next } : i)));
    const { error } = await supabase
      .from("catalog_items")
      .update({ active: next })
      .eq("id", item.id);
    if (error) {
      toast.error("Failed to update: " + error.message);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: item.active } : i)));
    } else {
      toast.success(next ? "Item shown to customers" : "Item hidden from customers");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("catalog_items").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success(`Deleted "${deleteTarget.name}"`);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" /> Item Catalog
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage items shown to customers in "Price by Items". Changes go live immediately.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add New Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, category, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          Loading catalog…
        </div>
      ) : grouped.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">No items found.</div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([category, catItems]) => {
            const collapsed = collapsedCats.has(category);
            return (
              <div key={category} className="border border-border rounded-lg overflow-hidden bg-card">
                <button
                  onClick={() => toggleCat(category)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {collapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-semibold text-foreground">{category}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {catItems.length}
                    </Badge>
                  </div>
                </button>
                {!collapsed && (
                  <div className="divide-y divide-border">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 hover:bg-muted/30 transition-colors ${
                          !item.active ? "opacity-50" : ""
                        }`}
                      >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{item.id}</div>
                        </div>
                        <div className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                          ${item.price}
                        </div>
                        <Switch
                          checked={item.active}
                          onCheckedChange={() => toggleActive(item)}
                          aria-label="Show to customers"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditing(item)}
                          className="h-8 px-2 text-xs"
                        >
                          Edit
                        </Button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="w-8 h-8 rounded text-destructive hover:bg-destructive/10 flex items-center justify-center shrink-0"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Dialog */}
      {(editing || creating) && (
        <CatalogItemDialog
          item={editing}
          isNew={creating}
          existingIds={new Set(items.map((i) => i.id))}
          categories={allCategories}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(saved) => {
            setItems((prev) => {
              const exists = prev.find((i) => i.id === saved.id);
              if (exists) return prev.map((i) => (i.id === saved.id ? saved : i));
              return [...prev, saved];
            });
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the item from your catalog. Existing leads that already
              selected this item are unaffected. Consider toggling it off (hidden from customers)
              instead if you may bring it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface DialogProps {
  item: CatalogItem | null;
  isNew: boolean;
  existingIds: Set<string>;
  categories: string[];
  onClose: () => void;
  onSaved: (item: CatalogItem) => void;
}

const CatalogItemDialog = ({ item, isNew, existingIds, categories, onClose, onSaved }: DialogProps) => {
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState<string>(item ? String(item.price) : "");
  const [icon, setIcon] = useState(item?.icon || "📦");
  const [category, setCategory] = useState(item?.category || categories[0] || "Miscellaneous");
  const [newCategory, setNewCategory] = useState("");
  const [active, setActive] = useState(item?.active ?? true);
  const [sortOrder, setSortOrder] = useState<string>(item ? String(item.sort_order) : "9999");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const finalCategory = (newCategory.trim() || category).trim();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!finalCategory) {
      toast.error("Category is required");
      return;
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error("Price must be 0 or greater");
      return;
    }

    setSaving(true);

    if (isNew) {
      let id = slugify(name);
      let attempt = 1;
      const baseId = id;
      while (existingIds.has(id)) {
        id = `${baseId}-${attempt++}`;
      }
      const payload = {
        id,
        name: name.trim(),
        price: numericPrice,
        icon: icon || "📦",
        category: finalCategory,
        sort_order: Number(sortOrder) || 9999,
        active,
      };
      const { data, error } = await supabase
        .from("catalog_items")
        .insert(payload)
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast.error("Failed to create: " + error.message);
        return;
      }
      toast.success(`Added "${data.name}"`);
      onSaved(data as CatalogItem);
    } else if (item) {
      const payload = {
        name: name.trim(),
        price: numericPrice,
        icon: icon || "📦",
        category: finalCategory,
        sort_order: Number(sortOrder) || 9999,
        active,
      };
      const { data, error } = await supabase
        .from("catalog_items")
        .update(payload)
        .eq("id", item.id)
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast.error("Failed to save: " + error.message);
        return;
      }
      toast.success(`Updated "${data.name}"`);
      onSaved(data as CatalogItem);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Item" : `Edit "${item?.name}"`}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Create a new catalog item that customers can pick in the booking funnel."
              : "Update the name, price, category, or visibility of this catalog item."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Patio Heater" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Price ($) *</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs">Icon (emoji)</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                placeholder="📦"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Category *</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Or type a brand-new category…"
              className="mt-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label className="text-xs">Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="9999"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Lower = shown earlier</p>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg h-10">
              <span className="text-sm">Visible</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogManager;

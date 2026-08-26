import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CITIES } from "@/data/cities";
import { SERVICE_LINKS } from "@/data/services";
import { loadSeoOverrides } from "@/hooks/useSeoOverride";
import { Loader2, Save, Wand2, RotateCcw, Search } from "lucide-react";

type PageType = "service" | "city";

interface PageRow {
  path: string;
  label: string;
  pageType: PageType;
  title: string;
  description: string;
  h1: string;
  keywords: string;
  dirty: boolean;
}

const buildPages = (): PageRow[] => [
  ...SERVICE_LINKS.map((s) => ({
    path: s.slug, label: s.name, pageType: "service" as const,
    title: "", description: "", h1: "", keywords: "", dirty: false,
  })),
  ...CITIES.map((c) => ({
    path: `/${c.slug}`, label: `${c.name}, ${c.stateAbbr}`, pageType: "city" as const,
    title: "", description: "", h1: "", keywords: "", dirty: false,
  })),
];

/** Fills {keyword}, {page}, {brand} tokens in a template. */
const fill = (tpl: string, keyword: string, page: string) =>
  tpl.replace(/\{keyword\}/gi, keyword).replace(/\{page\}/gi, page).replace(/\{brand\}/gi, "Big Boys Junk Removal").trim();

const SeoBulkEditor = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<PageRow[]>(buildPages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [scope, setScope] = useState<"all" | PageType>("all");

  // Bulk generator inputs
  const [keywordList, setKeywordList] = useState("");
  const [titleTpl, setTitleTpl] = useState("{keyword} | {brand}");
  const [descTpl, setDescTpl] = useState("Same-day {keyword} with upfront pricing. Book online in minutes — fully insured crews across Metro Atlanta.");
  const [h1Tpl, setH1Tpl] = useState("{keyword}");

  const load = async () => {
    setLoading(true);
    const map = await loadSeoOverrides(true);
    setRows(buildPages().map((r) => {
      const o = map[r.path];
      return o ? { ...r, title: o.title ?? "", description: o.description ?? "", h1: o.h1 ?? "", keywords: o.keywords ?? "" } : r;
    }));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => rows.filter((r) =>
    (scope === "all" || r.pageType === scope) &&
    (filter === "" || r.label.toLowerCase().includes(filter.toLowerCase()) || r.path.includes(filter.toLowerCase()))
  ), [rows, scope, filter]);

  const update = (path: string, field: keyof PageRow, value: string) =>
    setRows((prev) => prev.map((r) => (r.path === path ? { ...r, [field]: value, dirty: true } : r)));

  /** Maps pasted keywords onto the visible pages in order, one keyword per page. */
  const applyKeywords = () => {
    const keywords = keywordList.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!keywords.length) { toast({ title: "Add at least one keyword", variant: "destructive" }); return; }
    const targets = visible.map((r) => r.path);
    setRows((prev) => prev.map((r) => {
      const idx = targets.indexOf(r.path);
      if (idx === -1) return r;
      const kw = keywords[idx % keywords.length];
      return {
        ...r,
        keywords: kw,
        title: fill(titleTpl, kw, r.label),
        description: fill(descTpl, kw, r.label),
        h1: fill(h1Tpl, kw, r.label),
        dirty: true,
      };
    }));
    toast({ title: `Applied ${keywords.length} keyword(s) to ${targets.length} page(s)`, description: "Review below, then Save all changes." });
  };

  const saveAll = async () => {
    const dirty = rows.filter((r) => r.dirty);
    if (!dirty.length) { toast({ title: "Nothing to save" }); return; }
    setSaving(true);
    const { error } = await supabase.from("seo_overrides").upsert(
      dirty.map((r) => ({
        path: r.path,
        page_type: r.pageType,
        title: r.title.trim() || null,
        description: r.description.trim() || null,
        h1: r.h1.trim() || null,
        keywords: r.keywords.trim() || null,
      })),
      { onConflict: "path" },
    );
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
    await loadSeoOverrides(true);
    toast({ title: `Saved ${dirty.length} page(s)`, description: "Live pages now use the new titles, descriptions and H1s." });
  };

  const clearRow = async (path: string) => {
    await supabase.from("seo_overrides").delete().eq("path", path);
    setRows((prev) => prev.map((r) => (r.path === path ? { ...r, title: "", description: "", h1: "", keywords: "", dirty: false } : r)));
    await loadSeoOverrides(true);
    toast({ title: "Reverted to default metadata" });
  };

  const dirtyCount = rows.filter((r) => r.dirty).length;

  return (
    <div className="space-y-6">
      {/* Bulk generator */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Bulk apply from keyword list</h3>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Keywords (one per line — applied in order to the filtered pages below)</Label>
            <Textarea
              rows={7} value={keywordList} onChange={(e) => setKeywordList(e.target.value)}
              placeholder={"furniture removal alpharetta ga\nmattress removal marietta ga\njunk removal suwanee ga"}
              className="mt-1 font-mono text-xs"
            />
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title template</Label>
              <Input value={titleTpl} onChange={(e) => setTitleTpl(e.target.value)} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Meta description template</Label>
              <Textarea rows={2} value={descTpl} onChange={(e) => setDescTpl(e.target.value)} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs">H1 template</Label>
              <Input value={h1Tpl} onChange={(e) => setH1Tpl(e.target.value)} className="mt-1 text-sm" />
            </div>
            <p className="text-xs text-muted-foreground">Tokens: <code>{"{keyword}"}</code>, <code>{"{page}"}</code>, <code>{"{brand}"}</code></p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={applyKeywords} size="sm"><Wand2 className="w-4 h-4 mr-1" /> Apply to {visible.length} filtered page(s)</Button>
          <Button onClick={saveAll} size="sm" variant="default" disabled={saving || dirtyCount === 0}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save all changes{dirtyCount ? ` (${dirtyCount})` : ""}
          </Button>
          <Button onClick={load} size="sm" variant="outline" disabled={loading}><RotateCcw className="w-4 h-4 mr-1" /> Reload</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter pages…" className="pl-9" />
        </div>
        {(["all", "service", "city"] as const).map((s) => (
          <Button key={s} size="sm" variant={scope === s ? "default" : "outline"} onClick={() => setScope(s)} className="capitalize">
            {s === "all" ? "All pages" : `${s} pages`}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <div key={r.path} className={`bg-card border rounded-xl p-4 space-y-3 ${r.dirty ? "border-primary" : "border-border"}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.dirty && <span className="text-xs font-medium text-primary">Unsaved</span>}
                  <Button size="sm" variant="ghost" onClick={() => clearRow(r.path)}>Reset to default</Button>
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div>
                  <Label className="text-xs">Title <span className={r.title.length > 60 ? "text-destructive" : "text-muted-foreground"}>({r.title.length}/60)</span></Label>
                  <Input value={r.title} onChange={(e) => update(r.path, "title", e.target.value)} placeholder="Uses page default" className="mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">H1</Label>
                  <Input value={r.h1} onChange={(e) => update(r.path, "h1", e.target.value)} placeholder="Uses page default" className="mt-1 text-sm" />
                </div>
                <div className="lg:col-span-2">
                  <Label className="text-xs">Meta description <span className={r.description.length > 160 ? "text-destructive" : "text-muted-foreground"}>({r.description.length}/160)</span></Label>
                  <Textarea rows={2} value={r.description} onChange={(e) => update(r.path, "description", e.target.value)} placeholder="Uses page default" className="mt-1 text-sm" />
                </div>
                <div className="lg:col-span-2">
                  <Label className="text-xs">Target keyword</Label>
                  <Input value={r.keywords} onChange={(e) => update(r.path, "keywords", e.target.value)} className="mt-1 text-sm" />
                </div>
              </div>
            </div>
          ))}
          {!visible.length && <p className="text-sm text-muted-foreground text-center py-8">No pages match that filter.</p>}
        </div>
      )}
    </div>
  );
};

export default SeoBulkEditor;

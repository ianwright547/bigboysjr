import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Search, RefreshCw, Calendar, MapPin, Package, DollarSign, Lock, LogOut, Mail, Clock, Wrench, FileText, ChevronDown, BarChart3, ClipboardList, Trash2, RotateCcw, Map, CheckCircle2, XCircle, Pencil, Activity, Plus } from "lucide-react";
// Lazy-load heavy admin panels so Leaflet (maps) + analytics charts never ship in the public/home bundle CSS graph.
const AnalyticsPanel = lazy(() => import("@/components/admin/AnalyticsPanel").then(m => ({ default: m.AnalyticsPanel })));
const LeadsMap = lazy(() => import("@/components/admin/LeadsMap").then(m => ({ default: m.LeadsMap })));
const EditLeadModal = lazy(() => import("@/components/admin/EditLeadModal"));
const CatalogManager = lazy(() => import("@/components/admin/CatalogManager"));
const WebVitalsPanel = lazy(() => import("@/components/admin/WebVitalsPanel"));
const SeoBulkEditor = lazy(() => import("@/components/admin/SeoBulkEditor"));

import { format } from "date-fns";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import type { User } from "@supabase/supabase-js";

type Lead = {
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
  request_type: string;
  message: string | null;
  urgency: string | null;
  status: string;
  created_at: string;
  booking_date: string | null;
  time_slot: string | null;
  save_source: string | null;
  idempotency_key: string | null;
};

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Booked: "bg-green-100 text-green-800 border-green-200",
  Trashed: "bg-red-100 text-red-800 border-red-200",
  Completed: "bg-purple-100 text-purple-800 border-purple-200",
};

const AdminLogin = ({ onAuth }: { onAuth: (user: User) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      toast.error("Access denied. You are not an admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    onAuth(data.user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet><title>Admin Login | Big Boys Junk Removal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <form onSubmit={handleLogin} className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-lg space-y-4">
        <div className="flex items-center justify-center mb-2">
          <Lock className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
            required
          />
        </div>
        <Button type="submit" className="w-full h-12 rounded-xl font-semibold" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <button
          type="button"
          onClick={async () => {
            if (!email) { toast.error("Enter your email first"); return; }
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) toast.error(error.message);
            else toast.success("Password reset email sent! Check your inbox.");
          }}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "completed" | "analytics" | "trash" | "catalog" | "vitals" | "pageseo">("leads");
  const [showMap, setShowMap] = useState(true);
  const [mapFilter, setMapFilter] = useState<"all" | "New" | "Contacted" | "Booked" | "Completed">("all");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<"all" | "direct" | "fallback" | "retry_suspects" | "key_collisions">("all");

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast.error("Failed to load leads");
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  // Realtime: highlight new leads as they arrive
  useEffect(() => {
    const channel = supabase
      .channel("admin-leads-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as Lead;
          setLeads((prev) => (prev.some((l) => l.id === lead.id) ? prev : [lead, ...prev]));
          toast.success(
            `🚛 New lead: ${lead.name}${lead.save_source === "fallback" ? " (server fallback)" : ""}`
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as Lead;
          setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, ...lead } : l)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "leads" },
        (payload) => {
          const old = payload.old as { id: string };
          setLeads((prev) => prev.filter((l) => l.id !== old.id));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      toast.success(
        newStatus === "Trashed" ? "Lead moved to trash" :
        newStatus === "Completed" ? "Lead marked as completed" :
        `Status updated to ${newStatus}`
      );
    }
  };

  const permanentDelete = async (id: string) => {
    if (!confirm("Permanently delete this lead? This cannot be undone.")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete lead");
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead permanently deleted");
    }
  };

  const activeLeads = leads.filter((l) => l.status !== "Trashed" && l.status !== "Completed");
  const completedLeads = leads.filter((l) => l.status === "Completed");
  const trashedLeads = leads.filter((l) => l.status === "Trashed");

  const currentList =
    activeTab === "trash" ? trashedLeads :
    activeTab === "completed" ? completedLeads :
    activeLeads;

  // ===== Reliability signals =====
  // Idempotency key collisions: any key appearing on >1 row (true duplicates,
  // shouldn't normally happen given the unique partial index, but worth flagging).
  const keyCounts = leads.reduce<Record<string, number>>((acc, l) => {
    if (l.idempotency_key) acc[l.idempotency_key] = (acc[l.idempotency_key] || 0) + 1;
    return acc;
  }, {});
  const collidingKeys = new Set(Object.entries(keyCounts).filter(([, c]) => c > 1).map(([k]) => k));

  // Retry suspects: same phone submitted ≥2 times within a 10-minute window
  // (proxy for client-side retry storms when no key was reused).
  const TEN_MIN = 10 * 60 * 1000;
  const sortedByPhone = [...leads].sort((a, b) =>
    a.phone.localeCompare(b.phone) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const retrySuspectIds = new Set<string>();
  for (let i = 0; i < sortedByPhone.length - 1; i++) {
    const cur = sortedByPhone[i];
    const nxt = sortedByPhone[i + 1];
    if (cur.phone === nxt.phone) {
      const dt = new Date(nxt.created_at).getTime() - new Date(cur.created_at).getTime();
      if (Math.abs(dt) <= TEN_MIN) {
        retrySuspectIds.add(cur.id);
        retrySuspectIds.add(nxt.id);
      }
    }
  }

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const reliability = {
    fallback24h: leads.filter((l) => l.save_source === "fallback" && new Date(l.created_at).getTime() > oneDayAgo).length,
    fallbackTotal: leads.filter((l) => l.save_source === "fallback").length,
    keyCollisions: collidingKeys.size,
    retrySuspects: retrySuspectIds.size,
  };

  const filtered = currentList.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.email && l.email.toLowerCase().includes(search.toLowerCase())) ||
      (l.address && l.address.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = activeTab === "trash" || activeTab === "completed" || statusFilter === "all" || l.status === statusFilter;
    const matchSource =
      sourceFilter === "all" ? true :
      sourceFilter === "direct" ? l.save_source === "direct" :
      sourceFilter === "fallback" ? l.save_source === "fallback" :
      sourceFilter === "retry_suspects" ? retrySuspectIds.has(l.id) :
      sourceFilter === "key_collisions" ? (l.idempotency_key ? collidingKeys.has(l.idempotency_key) : false) :
      true;
    return matchSearch && matchStatus && matchSource;
  });

  const stats = {
    total: activeLeads.length,
    new: activeLeads.filter((l) => l.status === "New").length,
    contacted: activeLeads.filter((l) => l.status === "Contacted").length,
    booked: activeLeads.filter((l) => l.status === "Booked").length,
    completed: completedLeads.length,
    trashed: trashedLeads.length,
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const renderLeadCard = (lead: Lead, showRecover = false) => (
    <div key={lead.id} id={`lead-${lead.id}`} className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
      >
        <Badge variant="outline" className={`shrink-0 text-xs ${statusColors[lead.status] || ""}`}>
          {lead.status}
        </Badge>
        {lead.save_source === "fallback" ? (
          <Badge variant="outline" className="shrink-0 text-xs bg-amber-100 text-amber-800 border-amber-200" title="Saved via server fallback (client insert failed)">
            ⚠ Fallback
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 text-xs bg-emerald-100 text-emerald-800 border-emerald-200" title="Saved via direct insert from booking form">
            ✓ Direct
          </Badge>
        )}
        {retrySuspectIds.has(lead.id) && (
          <Badge variant="outline" className="shrink-0 text-xs bg-orange-100 text-orange-800 border-orange-200" title="Same phone submitted within 10 minutes — likely retry">
            ↻ Retry
          </Badge>
        )}
        {lead.idempotency_key && collidingKeys.has(lead.idempotency_key) && (
          <Badge variant="outline" className="shrink-0 text-xs bg-red-100 text-red-800 border-red-200" title="Idempotency key collision">
            ⚠ Key dupe
          </Badge>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{lead.name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(lead.created_at), "MMM d, h:mm a")}
            {lead.total_price != null && ` · $${lead.total_price}`}
            {lead.booking_date && ` · 📅 ${format(new Date(lead.booking_date + "T12:00:00"), "MMM d")}`}
            {lead.time_slot && ` · ${lead.time_slot}`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {showRecover ? (
            <button
              onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "New"); }}
              className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
              title="Recover"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "Trashed"); }}
              className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              title="Trash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <a
            href={`tel:${lead.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </button>

      {expandedId === lead.id && (
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Phone</p>
                <a href={`tel:${lead.phone}`} className="text-primary font-medium">{lead.phone}</a>
              </div>
            </div>
            {lead.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-primary font-medium">{lead.email}</a>
                </div>
              </div>
            )}
            {lead.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p className="text-foreground">{lead.address}</p>
                </div>
              </div>
            )}
            {lead.zip_code && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">ZIP</p>
                  <p className="text-foreground">{lead.zip_code}</p>
                </div>
              </div>
            )}
          </div>

          {(lead.booking_date || lead.time_slot) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {lead.booking_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Requested Date</p>
                    <p className="text-foreground font-medium">{format(new Date(lead.booking_date + "T12:00:00"), "EEEE, MMM d, yyyy")}</p>
                  </div>
                </div>
              )}
              {lead.time_slot && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Time Slot</p>
                    <p className="text-foreground font-medium capitalize">
                      {lead.time_slot === "morning" ? "Morning (8am–12pm)" : lead.time_slot === "afternoon" ? "Afternoon (12pm–4pm)" : lead.time_slot === "evening" ? "Evening (4pm–7pm)" : lead.time_slot}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {lead.pricing_method && (
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Pricing Method</p>
              <Badge variant="outline" className="text-xs capitalize">{lead.pricing_method === "items" ? "📋 By Item" : "🚛 By Load Size"}</Badge>
            </div>
          )}

          {lead.selected_items && Array.isArray(lead.selected_items) && lead.selected_items.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Items</p>
              <div className="flex flex-wrap gap-1">
                {(lead.selected_items as any[]).map((item: any, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {item.icon} {item.name} × {item.quantity} {item.price != null && `($${item.price * item.quantity})`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {lead.load_size && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Load Size</p>
              <Badge variant="secondary" className="text-xs">
                🚛 {typeof lead.load_size === "object" ? `${(lead.load_size as any).id} - $${(lead.load_size as any).price}` : String(lead.load_size)}
              </Badge>
            </div>
          )}

          {lead.add_ons && typeof lead.add_ons === "object" && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Wrench className="w-3 h-3" /> Add-Ons</p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const a = lead.add_ons as any;
                  const stairs = Number(a?.stairs) || 0;
                  const disassembly = Number(a?.disassembly) || 0;
                  const sameDay = !!a?.sameDay;
                  const chips = [];
                  if (stairs > 0) chips.push(<Badge key="s" variant="secondary" className="text-xs">🪜 Stairs × {stairs} (${stairs * 10})</Badge>);
                  if (disassembly > 0) chips.push(<Badge key="d" variant="secondary" className="text-xs">🔧 Disassembly × {disassembly} (${disassembly * 20})</Badge>);
                  if (sameDay) chips.push(<Badge key="sd" variant="secondary" className="text-xs">⚡ Same Day ($20)</Badge>);
                  chips.push(<Badge key="fee" variant="secondary" className="text-xs">🚚 Area Fee ($49)</Badge>);
                  return chips;
                })()}
              </div>
            </div>
          )}

          {lead.total_price != null && (
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground text-lg">${lead.total_price}</span>
            </div>
          )}

          {lead.message && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm text-foreground">{lead.message}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Submitted {format(new Date(lead.created_at), "MMM d, yyyy 'at' h:mm a")}
            {lead.request_type && ` · ${lead.request_type.replace(/_/g, " ")}`}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
            <span className="text-xs text-muted-foreground">Status:</span>
            {["New", "Contacted", "Booked", "Completed"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={lead.status === s ? "default" : "outline"}
                className="h-7 text-xs rounded-lg"
                onClick={() => updateStatus(lead.id, s)}
              >
                {s}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-lg ml-auto"
              onClick={() => setEditingLead(lead)}
            >
              <Pencil className="w-3 h-3 mr-1" /> Edit Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Lead Dashboard | Big Boys Junk Removal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreatingOrder(true)} size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> New Order
            </Button>
            {activeTab !== "analytics" && activeTab !== "catalog" && activeTab !== "pageseo" && (
              <Button onClick={fetchLeads} variant="outline" size="sm" disabled={loading} className="rounded-xl">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "leads" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Leads
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "completed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Done {stats.completed > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{stats.completed}</Badge>}
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "trash" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trash2 className="w-4 h-4" /> Trash {stats.trashed > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{stats.trashed}</Badge>}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "analytics" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "catalog" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" /> Catalog
          </button>
          <button
            onClick={() => setActiveTab("vitals")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "vitals" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-4 h-4" /> Vitals
          </button>
          <button
            onClick={() => setActiveTab("pageseo")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "pageseo" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" /> Page SEO
          </button>
        </div>


        {activeTab === "pageseo" && (
          <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading page SEO editor…</div>}>
            <SeoBulkEditor />
          </Suspense>
        )}

        {activeTab === "analytics" && (
          <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading analytics…</div>}>
            <AnalyticsPanel />
          </Suspense>
        )}


        {activeTab === "vitals" && (
          <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading vitals…</div>}>
            <WebVitalsPanel />
          </Suspense>
        )}

        {activeTab === "catalog" && (
          <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading catalog…</div>}>
            <CatalogManager />
          </Suspense>
        )}

        {activeTab === "leads" && <>
          {/* Map */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Map className="w-4 h-4 text-green-600" /> Metro Atlanta — 35 Mile Radius
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    toast.info("Backfilling coordinates… this can take a moment.");
                    const { data, error } = await supabase.functions.invoke("backfill-lead-coords", { body: {} });
                    if (error) {
                      toast.error("Backfill failed");
                      console.error(error);
                    } else {
                      toast.success(`Backfill done: ${data?.ok ?? 0} ok, ${data?.fail ?? 0} failed`);
                      fetchLeads();
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Backfill Coords
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>
            </div>
            {showMap && (
              <>
                {/* Map pin filter */}
                <div className="flex gap-1 mb-2 flex-wrap">
                  {(["all", "New", "Contacted", "Booked", "Completed"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setMapFilter(f)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        mapFilter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {f === "all" ? "All Pins" : f}
                    </button>
                  ))}
                </div>
                <Suspense fallback={<div className="h-64 rounded-lg bg-muted/40 animate-pulse" />}>
                  <LeadsMap
                    leads={[...activeLeads, ...completedLeads]
                      .filter((l) => mapFilter === "all" ? l.status !== "Completed" : l.status === mapFilter)
                      .map((l) => ({
                        id: l.id,
                        name: l.name,
                        phone: l.phone,
                        status: l.status,
                        address: l.address,
                        total_price: l.total_price,
                        zip_code: l.zip_code,
                        latitude: (l as any).latitude ?? null,
                        longitude: (l as any).longitude ?? null,
                      }))}
                    focusLeadId={expandedId}
                    onSelectLead={(id) => {
                      setExpandedId(id);
                      setTimeout(() => {
                        document.getElementById(`lead-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 100);
                    }}
                  />
                </Suspense>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-foreground" },
              { label: "New", value: stats.new, color: "text-blue-600" },
              { label: "Contacted", value: stats.contacted, color: "text-yellow-600" },
              { label: "Booked", value: stats.booked, color: "text-green-600" },
              { label: "Completed", value: stats.completed, color: "text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, email, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as typeof sourceFilter)}>
              <SelectTrigger className="w-full sm:w-56 h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="direct">✓ Direct insert</SelectItem>
                <SelectItem value="fallback">⚠ Server fallback</SelectItem>
                <SelectItem value="retry_suspects">↻ Retry suspects (≤10m)</SelectItem>
                <SelectItem value="key_collisions">⚠ Idempotency collisions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reliability strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => setSourceFilter("fallback")}
              className={`text-left bg-card border rounded-xl p-3 transition-colors ${
                reliability.fallback24h > 0 ? "border-amber-300 hover:bg-amber-50" : "border-border hover:bg-muted/40"
              }`}
            >
              <p className="text-xs text-muted-foreground">Fallbacks · 24h</p>
              <p className={`text-lg font-bold ${reliability.fallback24h > 0 ? "text-amber-700" : "text-foreground"}`}>
                {reliability.fallback24h}
              </p>
            </button>
            <button
              onClick={() => setSourceFilter("fallback")}
              className="text-left bg-card border border-border rounded-xl p-3 hover:bg-muted/40 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Fallbacks · all time</p>
              <p className="text-lg font-bold text-foreground">{reliability.fallbackTotal}</p>
            </button>
            <button
              onClick={() => setSourceFilter("retry_suspects")}
              className={`text-left bg-card border rounded-xl p-3 transition-colors ${
                reliability.retrySuspects > 0 ? "border-amber-300 hover:bg-amber-50" : "border-border hover:bg-muted/40"
              }`}
            >
              <p className="text-xs text-muted-foreground">Retry suspects</p>
              <p className={`text-lg font-bold ${reliability.retrySuspects > 0 ? "text-amber-700" : "text-foreground"}`}>
                {reliability.retrySuspects}
              </p>
            </button>
            <button
              onClick={() => setSourceFilter("key_collisions")}
              className={`text-left bg-card border rounded-xl p-3 transition-colors ${
                reliability.keyCollisions > 0 ? "border-red-300 hover:bg-red-50" : "border-border hover:bg-muted/40"
              }`}
            >
              <p className="text-xs text-muted-foreground">Key collisions</p>
              <p className={`text-lg font-bold ${reliability.keyCollisions > 0 ? "text-red-700" : "text-foreground"}`}>
                {reliability.keyCollisions}
              </p>
            </button>
          </div>


          {/* Leads list */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {activeLeads.length === 0 ? "No leads yet" : "No leads match your filters"}
              </div>
            )}
            {filtered.map((lead) => renderLeadCard(lead, false))}
          </div>
        </>}

        {activeTab === "completed" && <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Completed jobs. {completedLeads.length} job{completedLeads.length !== 1 ? "s" : ""} done.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search completed jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No completed jobs yet</div>
            )}
            {filtered.map((lead) => renderLeadCard(lead, false))}
          </div>
        </>}

        {activeTab === "trash" && <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Trashed leads can be recovered or permanently deleted. {trashedLeads.length} lead{trashedLeads.length !== 1 ? "s" : ""} in trash.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search trashed leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">Trash is empty</div>
            )}
            {filtered.map((lead) => (
              <div key={lead.id} id={`lead-${lead.id}`} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="w-full px-4 py-3 flex items-center gap-3">
                  <Badge variant="outline" className={`shrink-0 text-xs ${statusColors[lead.status] || ""}`}>{lead.status}</Badge>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
                    <p className="font-semibold text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), "MMM d, h:mm a")}
                      {lead.total_price != null && ` · $${lead.total_price}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateStatus(lead.id, "New")}
                      className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                      title="Recover"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => permanentDelete(lead.id)}
                      className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Delete permanently"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}
      </div>

      {editingLead && (
        <Suspense fallback={null}>
          <EditLeadModal
            lead={editingLead}
            open={!!editingLead}
            onClose={() => setEditingLead(null)}
            onSaved={(updated) => {
              setLeads((prev) => prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l)));
            }}
          />
        </Suspense>
      )}

      {creatingOrder && (
        <Suspense fallback={null}>
          <EditLeadModal
            mode="create"
            lead={{
              id: "new",
              name: "",
              phone: "",
              email: null,
              address: null,
              zip_code: null,
              pricing_method: "items",
              selected_items: [],
              load_size: null,
              add_ons: { stairs: 0, disassembly: 0, sameDay: false },
              total_price: null,
              message: null,
              status: "New",
              booking_date: null,
              time_slot: null,
            } as any}
            open={creatingOrder}
            onClose={() => setCreatingOrder(false)}
            onSaved={(created) => {
              setLeads((prev) => (prev.some((l) => l.id === created.id) ? prev : [created as Lead, ...prev]));
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminRole = async (sessionUser: User | null) => {
      if (!sessionUser) {
        if (mounted) { setUser(null); setChecking(false); }
        return;
      }
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", sessionUser.id)
          .eq("role", "admin");
        if (mounted) {
          setUser(roles && roles.length > 0 ? sessionUser : null);
          setChecking(false);
        }
      } catch {
        if (mounted) { setUser(null); setChecking(false); }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminRole(session?.user ?? null);
    }).catch(() => {
      if (mounted) { setUser(null); setChecking(false); }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdminRole(session?.user ?? null);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onAuth={setUser} />;
  }

  return <AdminDashboard onLogout={() => setUser(null)} />;
};

export default Admin;

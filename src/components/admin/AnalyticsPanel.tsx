import { useState, useEffect, useCallback } from "react";
import { BarChart3, Users, DollarSign, Clock, TrendingUp, TrendingDown, Smartphone, Monitor, Globe, Eye, MousePointerClick, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type DailyData = { date: string; value: number };

type AnalyticsData = {
  range?: { start: string; end: string; days: number };
  leads: { total: number; booked?: number; daily: DailyData[] };
  revenue: { total: number; quoted?: number };
  conversionRate: number;
  statuses: { name: string; count: number }[];
  requestTypes: { name: string; count: number }[];
  visitors: {
    visitors: { total: number; daily: DailyData[] };
    pageviews: { total: number; daily: DailyData[] };
    sessions?: number;
    avgPagesPerVisit: number;
    avgSessionDuration: number;
    bounceRate: number;
    topPages: { path: string; count: number }[];
    sources: { name: string; count: number }[];
    devices: { name: string; count: number }[];
    updatedAt: string;
  } | null;
};


const StatCard = ({ icon: Icon, label, value, trend }: {
  icon: any; label: string; value: string | number; trend?: "up" | "down";
}) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      {trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
      {trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const MiniBar = ({ data, maxVal }: { data: DailyData[]; maxVal: number }) => {
  const step = data.length > 14 ? Math.ceil(data.length / 7) : 1;
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.value}`}>
          <div
            className="w-full bg-primary/80 rounded-t-sm min-h-[2px] transition-all"
            style={{ height: maxVal > 0 ? `${Math.max((d.value / maxVal) * 100, 3)}%` : "3%" }}
          />
          <span className="text-[9px] text-muted-foreground leading-none whitespace-nowrap">
            {i % step === 0
              ? new Date(d.date + "T12:00:00").toLocaleDateString("en", 
                  data.length > 14 ? { month: "numeric", day: "numeric" } : { weekday: "narrow" })
              : ""}
          </span>
        </div>
      ))}
    </div>
  );
};


const RankList = ({ items, icon: Icon }: { items: { name: string; count: number }[]; icon: any }) => {
  const max = Math.max(...items.map(i => i.count), 1);
  return (
    <div className="space-y-2">
      {items.slice(0, 8).map((item, i) => (
        <div key={i} className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-lg" style={{ width: `${(item.count / max) * 100}%` }} />
          <div className="relative flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">{item.name || "Unknown"}</span>
            </div>
            <span className="text-sm font-medium text-foreground shrink-0 ml-2">{item.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
};

const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const presetRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return { start: fmtDate(start), end: fmtDate(end) };
};

export const AnalyticsPanel = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [preset, setPreset] = useState<number | "custom">(7);
  const [dates, setDates] = useState(() => presetRange(7));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { start, end } = dates;
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-analytics?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
      );

      if (response.ok) {
        setData(await response.json());
        setLastRefresh(new Date());
      } else {
        setError(`Could not load analytics (${response.status})`);
      }
    } catch {
      setError("Could not reach the analytics service");
    }
    setLoading(false);
    setRefreshing(false);
  }, [dates]);


  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => loadAnalytics(), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const visitors = data?.visitors;
  const maxVisitors = visitors ? Math.max(...visitors.visitors.daily.map(d => d.value), 1) : 1;
  const maxPageviews = visitors ? Math.max(...visitors.pageviews.daily.map(d => d.value), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Range selector + refresh */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {([7, 14, 30, 90] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setPreset(r); setDates(presetRange(r)); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                preset === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r}d
            </button>
          ))}
          <button
            onClick={() => setPreset("custom")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              preset === "custom" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Custom
          </button>
          <button
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {lastRefresh && (
            <span className="text-[10px] text-muted-foreground ml-1">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>

        {preset === "custom" && (
          <div className="flex items-end gap-2 flex-wrap bg-card border border-border rounded-xl p-3">
            <div>
              <label className="block text-[10px] text-muted-foreground mb-1">From</label>
              <input
                type="date"
                value={dates.start}
                max={dates.end}
                onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))}
                className="h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground mb-1">To</label>
              <input
                type="date"
                value={dates.end}
                min={dates.start}
                max={fmtDate(new Date())}
                onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
                className="h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground"
              />
            </div>
            <button
              onClick={() => loadAnalytics(true)}
              className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90"
            >
              Apply
            </button>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Showing {dates.start} to {dates.end}
          {data?.range ? ` (${data.range.days} days)` : ""}
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>


      {/* Visitor metrics */}
      {visitors && (
        <>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Website Traffic</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <StatCard icon={Users} label="Visitors" value={visitors.visitors.total} />
              <StatCard icon={Eye} label="Pageviews" value={visitors.pageviews.total} />
              <StatCard icon={MousePointerClick} label="Pages / Visit" value={visitors.avgPagesPerVisit.toFixed(1)} />
              <StatCard icon={Clock} label="Avg Session" value={formatDuration(visitors.avgSessionDuration)} />
              <StatCard icon={BarChart3} label="Bounce Rate" value={`${visitors.bounceRate}%`}
                trend={visitors.bounceRate > 50 ? "down" : "up"} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Visitors (daily)</p>
              <MiniBar data={visitors.visitors.daily} maxVal={maxVisitors} />
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Pageviews (daily)</p>
              <MiniBar data={visitors.pageviews.daily} maxVal={maxPageviews} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Top Pages</p>
              <RankList items={visitors.topPages.map(p => ({ name: p.path, count: p.count }))} icon={Eye} />
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Traffic Sources</p>
              <RankList items={visitors.sources} icon={Globe} />
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Devices</p>
              <RankList items={visitors.devices} icon={visitors.devices[0]?.name === "mobile" ? Smartphone : Monitor} />
            </div>
          </div>
        </>
      )}

      {/* Leads metrics */}
      {data && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Lead Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total Leads" value={data.leads.total} />
            <StatCard
              icon={DollarSign}
              label="Booked Revenue"
              value={`$${data.revenue.total.toLocaleString()}`}
            />
            <StatCard icon={TrendingUp} label="Conversion" value={`${data.conversionRate}%`}
              trend={data.conversionRate > 20 ? "up" : "down"} />
            <StatCard
              icon={BarChart3}
              label="Booked + Completed"
              value={
                data.leads.booked ??
                data.statuses
                  .filter((s) => ["booked", "completed"].includes(s.name.toLowerCase()))
                  .reduce((sum, s) => sum + s.count, 0)
              }
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Quoted value of all leads in range: ${(data.revenue.quoted ?? 0).toLocaleString()}
          </p>

          {data.leads.daily.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 mt-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Leads (daily)</p>
              <MiniBar data={data.leads.daily} maxVal={Math.max(...data.leads.daily.map(d => d.value), 1)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

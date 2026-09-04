import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity } from "lucide-react";

type Vital = {
  id: string;
  name: string;
  value: number;
  rating: string | null;
  path: string;
  created_at: string;
};

type MetricName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
const METRICS: MetricName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];

// Web Vitals "good" thresholds (Google).
const THRESHOLDS: Record<MetricName, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

const fmt = (name: MetricName, v: number) => {
  if (name === "CLS") return v.toFixed(3);
  return `${Math.round(v)}${THRESHOLDS[name].unit}`;
};

const percentile = (sorted: number[], p: number): number | null => {
  if (sorted.length === 0) return null;
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
  return sorted[idx];
};

const ratingFor = (name: MetricName, v: number): "good" | "needs-improvement" | "poor" => {
  const t = THRESHOLDS[name];
  if (v <= t.good) return "good";
  if (v <= t.poor) return "needs-improvement";
  return "poor";
};

const ratingClass = (r: string) =>
  r === "good"
    ? "bg-green-100 text-green-800 border-green-200"
    : r === "needs-improvement"
    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
    : "bg-red-100 text-red-800 border-red-200";

const WebVitalsPanel = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowHours, setWindowHours] = useState(24);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - windowHours * 3600_000).toISOString();
    const { data, error } = await (supabase as any)
      .from("web_vitals")
      .select("id,name,value,rating,path,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (!error && data) setVitals(data as Vital[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [windowHours]);

  // Group by metric
  const byMetric: Record<MetricName, number[]> = {
    LCP: [], INP: [], CLS: [], FCP: [], TTFB: [],
  };
  for (const v of vitals) {
    if (METRICS.includes(v.name as MetricName)) {
      byMetric[v.name as MetricName].push(v.value);
    }
  }

  // Group by path → metric → values (for breakdown)
  const byPath: Record<string, Record<MetricName, number[]>> = {};
  for (const v of vitals) {
    if (!METRICS.includes(v.name as MetricName)) continue;
    byPath[v.path] ??= { LCP: [], INP: [], CLS: [], FCP: [], TTFB: [] };
    byPath[v.path][v.name as MetricName].push(v.value);
  }

  const topPaths = Object.entries(byPath)
    .map(([p, m]) => ({ path: p, total: METRICS.reduce((s, k) => s + m[k].length, 0), metrics: m }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Web Vitals</h2>
          <Badge variant="secondary" className="text-xs">{vitals.length} samples</Badge>
        </div>
        <div className="flex items-center gap-2">
          {[1, 24, 168].map((h) => (
            <Button
              key={h}
              size="sm"
              variant={windowHours === h ? "default" : "outline"}
              onClick={() => setWindowHours(h)}
            >
              {h === 1 ? "1h" : h === 24 ? "24h" : "7d"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Overview cards — p75 for each metric */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {METRICS.map((m) => {
          const sorted = [...byMetric[m]].sort((a, b) => a - b);
          const p75 = percentile(sorted, 0.75);
          const r = p75 != null ? ratingFor(m, p75) : null;
          return (
            <div key={m} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-muted-foreground">{m}</span>
                <span className="text-[10px] text-muted-foreground">p75</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {p75 != null ? fmt(m, p75) : "No data"}
              </div>
              <div className="flex items-center justify-between mt-2">
                {r ? (
                  <Badge variant="outline" className={`text-[10px] ${ratingClass(r)}`}>
                    {r === "good" ? "Good" : r === "needs-improvement" ? "Needs work" : "Poor"}
                  </Badge>
                ) : <span className="text-[10px] text-muted-foreground">No data</span>}
                <span className="text-[10px] text-muted-foreground">{sorted.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-path breakdown */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">By page (p75)</h3>
        </div>
        {topPaths.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No samples yet. Visit the live site (production build) and metrics will appear here within a minute.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Path</th>
                  {METRICS.map((m) => (
                    <th key={m} className="text-right px-3 py-2 font-medium">{m}</th>
                  ))}
                  <th className="text-right px-4 py-2 font-medium">Samples</th>
                </tr>
              </thead>
              <tbody>
                {topPaths.map(({ path, total, metrics }) => (
                  <tr key={path} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs truncate max-w-[260px]">{path}</td>
                    {METRICS.map((m) => {
                      const sorted = [...metrics[m]].sort((a, b) => a - b);
                      const p75 = percentile(sorted, 0.75);
                      if (p75 == null) return <td key={m} className="text-right px-3 py-2 text-muted-foreground">No data</td>;
                      const r = ratingFor(m, p75);
                      return (
                        <td key={m} className="text-right px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${ratingClass(r)}`}>
                            {fmt(m, p75)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="text-right px-4 py-2 text-muted-foreground">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Metrics are only recorded on production builds (your published site). Each visit emits one sample per metric. p75 is the value 75% of your visitors experience or better, Google's official ranking benchmark.
      </p>
    </div>
  );
};

export default WebVitalsPanel;

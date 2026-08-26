import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SeoOverride {
  path: string;
  page_type: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  keywords: string | null;
}

let cache: Record<string, SeoOverride> | null = null;
let inflight: Promise<Record<string, SeoOverride>> | null = null;

export async function loadSeoOverrides(force = false): Promise<Record<string, SeoOverride>> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;
  inflight = (async () => {
    const { data } = await supabase
      .from("seo_overrides")
      .select("path,page_type,title,description,h1,keywords");
    const map: Record<string, SeoOverride> = {};
    (data ?? []).forEach((row) => { map[row.path] = row as SeoOverride; });
    cache = map;
    inflight = null;
    return map;
  })();
  return inflight;
}

/** Returns the admin-managed SEO override for a route path, if one exists. */
export function useSeoOverride(path: string): SeoOverride | null {
  const [override, setOverride] = useState<SeoOverride | null>(cache?.[path] ?? null);

  useEffect(() => {
    let active = true;
    loadSeoOverrides().then((map) => { if (active) setOverride(map[path] ?? null); });
    return () => { active = false; };
  }, [path]);

  return override;
}

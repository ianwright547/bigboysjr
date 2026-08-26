import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LeadPin = {
  id: string;
  name: string;
  phone: string;
  status: string;
  address?: string | null;
  zip_code?: string | null;
  total_price?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

const statusPinColors: Record<string, string> = {
  New: "#3b82f6",
  Contacted: "#eab308",
  Booked: "#22c55e",
  Trashed: "#ef4444",
  Completed: "#a855f7",
};

const ZIP_COORDS: Record<string, [number, number]> = {
  "30301": [33.749, -84.388], "30302": [33.749, -84.388], "30303": [33.753, -84.392],
  "30305": [33.834, -84.377], "30306": [33.787, -84.349], "30307": [33.771, -84.340],
  "30308": [33.771, -84.378], "30309": [33.797, -84.385], "30310": [33.726, -84.418],
  "30311": [33.720, -84.457], "30312": [33.740, -84.378], "30313": [33.762, -84.400],
  "30314": [33.755, -84.425], "30315": [33.709, -84.389], "30316": [33.727, -84.330],
  "30317": [33.750, -84.325], "30318": [33.790, -84.430], "30319": [33.870, -84.335],
  "30324": [33.816, -84.356], "30326": [33.850, -84.364], "30327": [33.862, -84.415],
  "30328": [33.935, -84.360], "30329": [33.822, -84.324], "30030": [33.775, -84.296],
  "30032": [33.740, -84.262], "30033": [33.810, -84.281], "30034": [33.690, -84.255],
  "30035": [33.713, -84.213], "30024": [34.052, -84.072], "30518": [34.120, -84.004],
  "30046": [33.957, -84.002], "30060": [33.953, -84.549], "30062": [33.979, -84.490],
  "30064": [33.946, -84.577], "30066": [34.020, -84.470], "30067": [33.932, -84.450],
  "30068": [33.975, -84.440], "30075": [34.023, -84.350], "30076": [34.043, -84.320],
  "30077": [34.030, -84.340], "30009": [34.072, -84.290], "30022": [34.060, -84.230],
  "30004": [34.120, -84.290], "30005": [34.080, -84.260], "30080": [33.870, -84.510],
  "30082": [33.850, -84.515], "30126": [33.830, -84.560], "30144": [34.025, -84.615],
  "30152": [34.040, -84.600], "30189": [34.100, -84.520], "30260": [33.650, -84.340],
  "30274": [33.610, -84.350], "30281": [33.620, -84.250], "30294": [33.620, -84.270],
  "30331": [33.690, -84.490], "30336": [33.729, -84.507], "30337": [33.638, -84.378],
  "30338": [33.945, -84.320], "30339": [33.875, -84.460], "30340": [33.900, -84.280],
  "30341": [33.890, -84.290], "30342": [33.875, -84.360], "30344": [33.660, -84.420],
  "30345": [33.850, -84.280], "30346": [33.925, -84.310], "30349": [33.590, -84.460],
  "30350": [33.975, -84.320], "30354": [33.630, -84.370], "30360": [33.940, -84.280],
  // Additional metro Atlanta zips
  "30002": [33.774, -84.260], "30083": [33.790, -84.265], "30084": [33.820, -84.250],
  "30021": [33.800, -84.257], "30058": [33.700, -84.190], "30038": [33.680, -84.210],
  "30039": [33.720, -84.120], "30044": [33.920, -84.090], "30045": [33.960, -84.070],
  "30047": [33.880, -84.160], "30048": [33.870, -84.140], "30052": [33.810, -83.980],
  "30056": [33.850, -84.010], "30071": [33.940, -84.210],
  "30072": [33.790, -84.230], "30074": [33.820, -84.210], "30078": [33.880, -84.010],
  "30079": [33.790, -84.270], "30087": [33.805, -84.150], "30088": [33.760, -84.150],
  "30093": [33.900, -84.180], "30096": [33.990, -84.150], "30097": [34.020, -84.140],
  "30135": [33.820, -84.640], "30168": [33.800, -84.600], "30106": [33.790, -84.650],
  "30157": [34.080, -84.680], "30101": [34.060, -84.670], "30102": [34.070, -84.680],
  "30114": [34.230, -84.490], "30115": [34.250, -84.520], "30188": [34.100, -84.580],
  "30040": [34.200, -84.140], "30041": [34.250, -84.120], "30028": [34.280, -84.200],
  "30043": [33.990, -84.100], "30019": [33.970, -83.920], "30017": [33.900, -83.980],
  "30016": [33.620, -83.940], "30013": [33.620, -84.010], "30012": [33.680, -84.030],
  "30014": [33.610, -84.050], "30094": [33.640, -84.130],
};

const getZipFromLead = (lead: LeadPin): string | null => {
  const zipMatch = lead.address?.match(/\d{5}/);
  if (zipMatch) return zipMatch[0];
  return lead.zip_code?.trim().slice(0, 5) || null;
};

// Deterministic tiny jitter derived from the lead id so multiple leads that
// fall back to the same ZIP centroid don't stack on the exact same pixel.
// Real geocoded leads bypass this entirely — they use their stored lat/lng.
const jitterFromId = (id: string): [number, number] => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const dLat = (((h & 0xffff) / 0xffff) - 0.5) * 0.012; // ~±0.6 km
  const dLng = ((((h >> 16) & 0xffff) / 0xffff) - 0.5) * 0.012;
  return [dLat, dLng];
};

const getLeadLatLng = (lead: LeadPin): [number, number] | null => {
  if (
    typeof lead.latitude === "number" &&
    typeof lead.longitude === "number" &&
    Number.isFinite(lead.latitude) &&
    Number.isFinite(lead.longitude)
  ) {
    return [lead.latitude, lead.longitude];
  }
  const zip = getZipFromLead(lead);
  if (!zip || !ZIP_COORDS[zip]) return null;
  const [lat, lng] = ZIP_COORDS[zip];
  const [dLat, dLng] = jitterFromId(lead.id);
  return [lat + dLat, lng + dLng];
};

const CENTER: L.LatLngTuple = [33.749, -84.388];

// Georgia state bounds (approx)
const GA_BOUNDS: L.LatLngBoundsExpression = [
  [30.35, -85.61], // SW corner
  [35.00, -80.84], // NE corner
];

export const LeadsMap = ({
  leads,
  onSelectLead,
  focusLeadId,
}: {
  leads: LeadPin[];
  onSelectLead?: (id: string) => void;
  focusLeadId?: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const leadsRef = useRef(leads);
  const onSelectRef = useRef(onSelectLead);
  leadsRef.current = leads;
  onSelectRef.current = onSelectLead;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CENTER,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 9,
      maxBounds: GA_BOUNDS as L.LatLngBoundsExpression,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers whenever leads change
  const updateMarkers = useCallback(() => {
    const group = markersRef.current;
    if (!group) return;
    group.clearLayers();

    leadsRef.current.forEach((lead) => {
      const coords = getLeadLatLng(lead);
      if (!coords) return;
      const [lat, lng] = coords;
      const color = statusPinColors[lead.status] || "#3b82f6";

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:18px;height:18px;border-radius:50%;background:${color};
          border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);
          cursor:pointer;
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([lat, lng], { icon });

      // Popup with a "View Lead" button
      const popupHtml = `
        <div style="font-size:12px;min-width:160px;line-height:1.5;">
          <b style="font-size:14px;">${lead.name}</b><br/>
          <span style="color:#666;">${lead.address || lead.zip_code || "N/A"}</span><br/>
          <a href="tel:${lead.phone}" style="color:#2563eb;text-decoration:none;">${lead.phone}</a><br/>
          ${lead.total_price != null ? `<b style="color:#16a34a;">$${lead.total_price}</b><br/>` : ""}
          <span style="
            display:inline-block;margin-top:4px;padding:2px 8px;border-radius:10px;
            color:white;font-size:10px;font-weight:600;background:${color};
          ">${lead.status}</span>
          <br/>
          <button
            onclick="window.__selectLead__('${lead.id}')"
            style="
              margin-top:6px;padding:4px 12px;border-radius:8px;border:none;
              background:#22c55e;color:white;font-size:11px;font-weight:600;
              cursor:pointer;width:100%;
            "
          >View Lead ↓</button>
        </div>
      `;
      marker.bindPopup(popupHtml);
      group.addLayer(marker);
    });
  }, []);

  // Expose the select callback globally for popup button clicks
  useEffect(() => {
    (window as any).__selectLead__ = (id: string) => {
      onSelectRef.current?.(id);
    };
    return () => {
      delete (window as any).__selectLead__;
    };
  }, []);

  // Re-render markers when leads array changes
  useEffect(() => {
    updateMarkers();
  }, [leads, updateMarkers]);

  // Fly to focused lead when clicking a lead card
  useEffect(() => {
    if (!focusLeadId || !mapRef.current) return;
    const lead = leadsRef.current.find((l) => l.id === focusLeadId);
    if (!lead) return;
    const coords = getLeadLatLng(lead);
    if (!coords) return;
    mapRef.current.flyTo(coords, 14, { duration: 0.8 });
  }, [focusLeadId]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-border"
      style={{ height: 380, width: "100%" }}
    />
  );
};

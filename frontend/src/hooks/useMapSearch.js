import { useMemo } from "react";

// ============================================================
// LOCAL MAP SEARCH
//
// Operates entirely on the FeatureCollection that is already
// loaded in memory. Never hits the network — the map's dataset
// is small enough (hundreds of features) that filtering client
// side on every keystroke is effectively instant, and it keeps
// this behavior decoupled from useGlobalSearch (which is for
// the app-wide command palette and does query the API).
// ============================================================

const MAX_RESULTS = 8;

export function useMapSearch(data, query, { limit = MAX_RESULTS } = {}) {
  return useMemo(() => {
    const normalizedQuery = query?.trim().toLowerCase() ?? "";

    if (!normalizedQuery || !data?.features?.length) {
      return [];
    }

    const matches = [];

    for (const feature of data.features) {
      const p = feature.properties ?? {};

      const searchable = [p.seat_code, p.seat_name, p.state_name, p.dominant_party]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (searchable.includes(normalizedQuery)) {
        matches.push(feature);
        if (matches.length >= limit) break;
      }
    }

    return matches;
  }, [data, query, limit]);
}

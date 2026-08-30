import { useState, useEffect } from "react";
import { normalizeSeatCode, normalizeStateName } from "../utils/electoral";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

const PARLIAMENT_GEOJSON = "/geojson/malaysia.parlimen.geojson";
const DUN_GEOJSON = "/geojson/malaysia.dun.geojson";

// ============================================================
// SESSION-LEVEL CACHE
// ============================================================

const mergedDataCache = new Map();
const inFlightRequests = new Map();

export function clearGeoSpatialCache() {
  mergedDataCache.clear();
  inFlightRequests.clear();
}

export function useGeoSpatialData(layerType = "parliament", customApiBaseUrl) {
  const [data, setData] = useState(() => mergedDataCache.get(layerType) ?? null);
  const [loading, setLoading] = useState(!mergedDataCache.has(layerType));
  const [error, setError] = useState(null);

  const API_BASE_URL = customApiBaseUrl || DEFAULT_API_BASE_URL;

  useEffect(() => {
    let isMounted = true;

    // Cache hit: serve instantly, skip network entirely.
    if (mergedDataCache.has(layerType)) {
      setData(mergedDataCache.get(layerType));
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    const controller = new AbortController();

    async function fetchGeoSpatialData() {
      try {
        setLoading(true);
        setError(null);

        const isDun = layerType === "dun";
        const geoJsonUrl = isDun ? DUN_GEOJSON : PARLIAMENT_GEOJSON;

        // 1. Fetch GeoJSON independently first (guarantees map boundaries load)
        const geoResponse = await fetch(geoJsonUrl, { signal: controller.signal });
        if (!geoResponse.ok) {
          throw new Error(`Failed to load electoral GeoJSON: ${geoResponse.status}`);
        }
        const geoJson = await geoResponse.json();

        if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
          throw new Error("Invalid electoral GeoJSON format");
        }

        // 2. Safely fetch backend analytics with de-duplication and fallbacks
        let requestPromise = inFlightRequests.get(layerType);

        if (!requestPromise) {
          requestPromise = (async () => {
            try {
              // Create a short timeout fetch helper to prevent hanging pending states
              const fetchWithTimeout = async (url) => {
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                try {
                  const res = await fetch(url, { signal: controller.signal });
                  clearTimeout(timeoutId);
                  return res;
                } catch (e) {
                  clearTimeout(timeoutId);
                  throw e;
                }
              };

              const [seatsRes, performanceRes] = await Promise.all([
                fetchWithTimeout(`${API_BASE_URL}/seats`).catch(() => null),
                fetchWithTimeout(`${API_BASE_URL}/analytics/state-performance`).catch(() => null),
              ]);

              const seatsJson = seatsRes && seatsRes.ok ? await seatsRes.json() : [];
              const performanceJson = performanceRes && performanceRes.ok ? await performanceRes.json() : [];

              return {
                seats: seatsJson.data ?? seatsJson,
                performance: performanceJson.data ?? performanceJson,
              };
            } catch (apiErr) {
              console.warn("Backend analytics unreachable, rendering map with geometry only:", apiErr);
              return { seats: [], performance: [] };
            }
          })();

          inFlightRequests.set(layerType, requestPromise);
        }

        const { seats, performance } = await requestPromise;

        // --------------------------------------------------
        // SEAT LOOKUP (P.xxx vs N.xxx kept distinct)
        // --------------------------------------------------

        const seatLookup = new Map();
        if (Array.isArray(seats)) {
          seats.forEach((seat) => {
            const possibleCodes = [
              seat.seat_code,
              seat.code_parlimen,
              seat.code_dun,
              seat.parlimen,
              seat.dun,
              seat.code,
            ];

            for (const code of possibleCodes) {
              const normalized = normalizeSeatCode(code);
              if (!normalized) continue;

              if (isDun && !normalized.startsWith("N.")) continue;
              if (!isDun && !normalized.startsWith("P.")) continue;

              seatLookup.set(normalized, seat);
            }
          });
        }

        // --------------------------------------------------
        // STATE ANALYTICS LOOKUP
        // --------------------------------------------------

        const stateLookup = new Map();
        if (Array.isArray(performance)) {
          performance.forEach((state) => {
            const stateName = state.state_name ?? state.state ?? state.name;
            const normalized = normalizeStateName(stateName);
            if (!normalized) return;
            stateLookup.set(normalized, state);
          });
        }

        // --------------------------------------------------
        // MERGE GEOJSON WITH DATABASE ANALYTICS
        // --------------------------------------------------

        const mergedFeatures = geoJson.features.map((feature) => {
          const geoProperties = feature.properties ?? {};

          const geoSeatCode = getGeoJsonSeatCode(feature, geoProperties);
          const normalizedGeoSeatCode = normalizeSeatCode(geoSeatCode);
          const seat = seatLookup.get(normalizedGeoSeatCode);

          const stateName =
            geoProperties.state_name ??
            geoProperties.state ??
            geoProperties.STATE ??
            "Unknown State";

          const statePerformance = stateLookup.get(normalizeStateName(stateName));

          const totalVotes = Number(statePerformance?.total_votes ?? 0);
          const dominantParty = statePerformance?.dominant_party ?? "N/A";

          return {
            ...feature,
            properties: {
              ...geoProperties,

              seat_code: geoSeatCode ?? null,
              seat_name:
                geoProperties.name ??
                geoProperties.parlimen ??
                geoProperties.dun ??
                "Unknown Seat",
              state_name: stateName,
              state_code: geoProperties.state_code ?? null,
              state_id: geoProperties.state_id ?? null,

              database_seat_id: seat?.id ?? seat?.seat_id ?? null,
              database_seat_name: seat?.seat_name ?? seat?.name ?? null,

              seat_type: isDun ? "State Assembly" : "Parliamentary",

              total_votes: totalVotes,
              dominant_party: dominantParty,

              layer_type: isDun ? "dun" : "parliament",
            },
          };
        });

        const result = {
          type: "FeatureCollection",
          ...(geoJson.bbox ? { bbox: geoJson.bbox } : {}),
          features: mergedFeatures,
        };

        mergedDataCache.set(layerType, result);
        inFlightRequests.delete(layerType);

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        inFlightRequests.delete(layerType);

        if (err.name === "AbortError") return;

        console.error("GeoSpatial processing error:", err);

        if (isMounted) {
          setError(err.message ?? "Failed to load geospatial data");
          setLoading(false);
        }
      }
    }

    fetchGeoSpatialData();

    return () => {
      isMounted = false;
    };
  }, [layerType, API_BASE_URL]);

  return { data, loading, error };
}

// ============================================================
// GEOJSON SEAT CODE
// ============================================================

function getGeoJsonSeatCode(feature, properties) {
  return (
    properties.code_parlimen ??
    properties.code_dun ??
    properties.seat_code ??
    properties.parlimen ??
    properties.dun ??
    properties.code ??
    feature.id ??
    null
  );
}
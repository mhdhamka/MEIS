/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { normalizeSeatCode } from "../utils/electoral";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

const PARLIAMENT_GEOJSON = "/geojson/malaysia.parlimen.geojson";
const DUN_GEOJSON = "/geojson/malaysia.dun.geojson";

// ============================================================
// SESSION-LEVEL CACHE
//
// Keyed by layerType ("parliament" | "dun"). Once the merged
// FeatureCollection for a layer has been built, it is reused
// for the rest of the session — switching the `metric` prop
// elsewhere in the app must NEVER trigger a refetch here.
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

        // De-dupe concurrent requests for the same layer (e.g. StrictMode
        // double-invoke, or two components mounting the hook at once).
        let requestPromise = inFlightRequests.get(layerType);

        if (!requestPromise) {
          requestPromise = Promise.all([
            fetch(geoJsonUrl, { signal: controller.signal }),
            fetch(`${API_BASE_URL}/seats`, { signal: controller.signal }),
          ]);
          inFlightRequests.set(layerType, requestPromise);
        }

        const [geoResponse, seatsResponse] = await requestPromise;

        if (!geoResponse.ok) {
          throw new Error(`Failed to load electoral GeoJSON: ${geoResponse.status}`);
        }
        if (!seatsResponse.ok) {
          throw new Error(`Failed to load electoral seats: ${seatsResponse.status}`);
        }

        const geoJson = await geoResponse.json();
        const seatsJson = await seatsResponse.json();

        const seats = seatsJson.data ?? seatsJson;

        if (!Array.isArray(seats)) {
          throw new Error("Seats API did not return an array");
        }
        if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
          throw new Error("Invalid electoral GeoJSON format");
        }

        // --------------------------------------------------
        // SEAT LOOKUP (P.xxx vs N.xxx kept distinct)
        //
        // normalizeSeatCode strips punctuation but keeps the leading
        // P/N letter, so the startsWith check below must too.
        // --------------------------------------------------

        const seatLookup = new Map();

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

            if (isDun && !normalized.startsWith("N")) continue;
            if (!isDun && !normalized.startsWith("P")) continue;

            seatLookup.set(normalized, seat);
          }
        });

        // --------------------------------------------------
        // MERGE GEOJSON (source of truth for geometry/state)
        // WITH DATABASE ANALYTICS
        //
        // NOTE: we deliberately do NOT stamp state-level aggregates
        // (e.g. analytics/state-performance's total_votes) onto every
        // seat here — that produced identical, misleading numbers for
        // every constituency in a state. Real per-seat winner/votes/
        // vote-share/margin/turnout/candidate-count come later from
        // useMapResults + mergeElectionResults, keyed by seat_code.
        // Until that merge runs, these fields stay null/"N/A" so the
        // UI honestly shows "no data yet" instead of a fake number.
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

              // Placeholders — filled in per-seat by mergeElectionResults
              // once useMapResults resolves for the selected election.
              total_votes: null,
              dominant_party: null,
              winner_name: null,
              winner_votes: null,
              vote_share: null,
              majority: null,
              turnout: null,
              candidate_count: null,

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

        console.error("GeoSpatial API error:", err);

        if (isMounted) {
          setError(err.message ?? "Failed to load geospatial data");
          setLoading(false);
        }
      }
    }

    fetchGeoSpatialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // NOTE: `metric` is intentionally NOT a dependency anywhere this hook
    // is called — changing the visualization metric only changes styling,
    // never triggers a refetch.
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
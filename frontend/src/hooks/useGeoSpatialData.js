/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { normalizeSeatCode } from "../utils/electoral";

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

    if (mergedDataCache.has(layerType)) {
      setData(mergedDataCache.get(layerType));
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    async function fetchGeoSpatialData() {
      try {
        setLoading(true);
        setError(null);

        const isDun = layerType === "dun";
        const geoJsonUrl = isDun ? DUN_GEOJSON : PARLIAMENT_GEOJSON;

        // De-dupe concurrent requests by caching the parsed JSON promises, not the raw Response streams
        let requestPromise = inFlightRequests.get(layerType);

        if (!requestPromise) {
          requestPromise = (async () => {
            const [geoResponse, seatsResponse] = await Promise.all([
              fetch(geoJsonUrl),
              fetch(`${API_BASE_URL}/seats/`),
            ]);

            if (!geoResponse.ok) {
              throw new Error(`Failed to load electoral GeoJSON: ${geoResponse.status}`);
            }
            if (!seatsResponse.ok) {
              throw new Error(`Failed to load electoral seats: ${seatsResponse.status}`);
            }

            const geoJson = await geoResponse.json();
            const seatsJson = await seatsResponse.json();
            return { geoJson, seatsJson };
          })();

          inFlightRequests.set(layerType, requestPromise);
        }

        const { geoJson, seatsJson } = await requestPromise;

        const seats = seatsJson.data ?? seatsJson;

        if (!Array.isArray(seats)) {
          throw new Error("Seats API did not return an array");
        }
        if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
          throw new Error("Invalid electoral GeoJSON format");
        }

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
    };
  }, [layerType, API_BASE_URL]);

  return { data, loading, error };
}

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
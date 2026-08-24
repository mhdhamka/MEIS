import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8000/api/v1";

export function useGeoSpatialData(layerType) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGeoSpatialData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch states, seats, and party performance concurrently from your FastAPI backend
        const [statesRes, seatsRes, performanceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/states`),
          fetch(`${API_BASE_URL}/seats`),
          fetch(`${API_BASE_URL}/analytics/state-performance`)
        ]);

        if (!statesRes.ok || !seatsRes.ok || !performanceRes.ok) {
          throw new Error("Failed to fetch electoral data from database API");
        }

        const statesJson = await statesRes.json();
        const seatsJson = await seatsRes.json();
        const performanceJson = await performanceRes.json();

        // Transform database records into a standard GeoJSON FeatureCollection structure
        // (You can map database coordinates here if stored, or structure features by state/seat)
        const features = seatsJson.data.map((seat, index) => {
          const statePerf = performanceJson.find(
            (sp) => sp.state_name === seat.state_name
          );

          return {
            type: "Feature",
            properties: {
              id: seat.seat_code,
              name: seat.seat_name,
              state: seat.state_name,
              seatType: seat.seat_type,
              totalVotes: statePerf?.total_votes || 0,
              dominantParty: layerType === "party" ? (statePerf?.dominant_party || "N/A") : "Standard"
            },
            geometry: {
              type: "Polygon",
              coordinates: [] // Populate with real polygon boundary coordinates if available in your DB
            }
          };
        });

        if (isMounted) {
          setData({
            type: "FeatureCollection",
            features
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchGeoSpatialData();

    return () => {
      isMounted = false;
    };
  }, [layerType]);

  return { data, loading, error };
}
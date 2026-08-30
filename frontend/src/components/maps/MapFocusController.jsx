import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// ============================================================
// MapFocusController
//
// Renders nothing. Watches `feature` (a single GeoJSON Feature)
// and flies/fits the map to its bounds whenever it changes —
// this is what makes selecting a search result actually move
// the map, instead of just opening the inspector.
// ============================================================

export default function MapFocusController({ feature }) {
  const map = useMap();

  useEffect(() => {
    if (!feature?.geometry) {
      return;
    }

    try {
      const layer = L.geoJSON(feature);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
      }
    } catch (err) {
      console.warn("MapFocusController: could not compute bounds", err);
    }
  }, [feature, map]);

  return null;
}

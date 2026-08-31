import { GeoJSON } from "react-leaflet";
import {
  getFeatureStyle,
  getHoverStyle,
  getSelectedStyle,
  normalizeSeatCode,
} from "../../utils/electoral";

// ============================================================
// ConstituencyLayer
//
// Pure rendering component: polygons + styling + polygon events.
// Data fetching lives in the parent (ElectoralMapContainer) via
// useGeoSpatialData + useMapFilters, so this component never
// triggers its own network requests and never duplicates fetches
// when metric/search/state filters change.
// ============================================================

export default function ConstituencyLayer({
  data,
  metric = "boundaries",
  selectedSeatCode,
  onSelectConstituency,
  onHoverConstituency,
}) {
  if (!data?.features?.length) {
    return null;
  }

  const isSelected = (feature) =>
    !!selectedSeatCode &&
    normalizeSeatCode(feature.properties?.seat_code) === selectedSeatCode;

  // The "resting" style for a feature: its normal metric color, unless
  // it's the currently-selected constituency, in which case the
  // selection highlight persists even after the mouse leaves it.
  const styleForFeature = (feature) =>
    isSelected(feature) ? getSelectedStyle() : getFeatureStyle(feature, metric);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectConstituency?.(feature.properties);
      },

      mouseover: (event) => {
        if (!isSelected(feature)) {
          event.target.setStyle(getHoverStyle());
        }
        onHoverConstituency?.(feature.properties);
      },

      mouseout: (event) => {
        event.target.setStyle(styleForFeature(feature));
        onHoverConstituency?.(null);
      },
    });
  };

  return (
    <GeoJSON
      // Re-mounting on metric OR selection change guarantees every
      // polygon repaints cleanly (including dropping the highlight off
      // whatever was previously selected) without manually walking the
      // layer group.
      key={`${metric}-${selectedSeatCode ?? "none"}`}
      data={data}
      style={styleForFeature}
      onEachFeature={onEachFeature}
    />
  );
}

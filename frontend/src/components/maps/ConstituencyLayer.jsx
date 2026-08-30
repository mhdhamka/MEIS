import { GeoJSON } from "react-leaflet";
import { getFeatureStyle, getHoverStyle } from "../../utils/electoral";

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
  onSelectConstituency,
  onHoverConstituency,
}) {
  if (!data?.features?.length) {
    return null;
  }

  const styleForFeature = (feature) => getFeatureStyle(feature, metric);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectConstituency?.(feature.properties);
      },

      mouseover: (event) => {
        event.target.setStyle(getHoverStyle());
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
      // Re-mounting on metric change guarantees every polygon repaints
      // cleanly even mid-hover, without needing to walk the layer group.
      key={metric}
      data={data}
      style={styleForFeature}
      onEachFeature={onEachFeature}
    />
  );
}

import { GeoJSON } from "react-leaflet";
import { useGeoSpatialData } from "../../hooks/useGeoSpatialData";

export default function ConstituencyLayer({ activeLayer, onSelectConstituency }) {
  const { data: geoJsonData } = useGeoSpatialData(activeLayer);

  // Dynamic styling based on the active intelligence layer mode
  const getFeatureStyle = (feature) => {
    return {
      fillColor: feature.properties.dominantParty === "GPS" ? "#ffb703" : "#134074",
      weight: 1.5,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.65,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (onSelectConstituency) {
          onSelectConstituency(feature.properties);
        }
      },
    });
  };

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      key={activeLayer}
      data={geoJsonData}
      style={getFeatureStyle}
      onEachFeature={onEachFeature}
    />
  );
}
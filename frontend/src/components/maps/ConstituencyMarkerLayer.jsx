import { Marker, Popup } from "react-leaflet";

// ============================================================
// ConstituencyMarkerLayer
//
// Renamed from ConstituencyMarkerCluster: it renders one centroid
// marker per constituency, not a real polling-station cluster
// (there is no polling-station coordinate data yet). Data is
// passed down from ElectoralMapContainer — this component does
// not fetch anything itself, so toggling it on/off never causes
// a duplicate GeoJSON/API request.
// ============================================================

export default function ConstituencyMarkerLayer({ data, onSelectConstituency }) {
  const features = data?.features ?? [];

  return (
    <>
      {features.map((feature, index) => {
        const properties = feature.properties ?? {};
        const centroid = properties.centroid;

        if (!centroid) {
          return null;
        }

        return (
          <Marker
            key={properties.seat_code ?? feature.id ?? index}
            position={centroid}
            eventHandlers={{
              click: () => onSelectConstituency?.(properties),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[180px]">
                <h5 className="text-xs font-bold text-slate-900">
                  {properties.seat_name ?? "Unknown Constituency"}
                </h5>

                <p className="text-[11px] text-slate-600 mt-1">
                  State: <strong>{properties.state_name ?? "N/A"}</strong>
                </p>

                <p className="text-[11px] text-slate-600">
                  Code: <strong>{properties.seat_code ?? "N/A"}</strong>
                </p>

                <p className="text-[11px] text-slate-600">
                  Votes:{" "}
                  <strong>
                    {Number(properties.total_votes ?? 0).toLocaleString()}
                  </strong>
                </p>

                <p className="text-[11px] text-slate-600">
                  Dominant Party:{" "}
                  <strong>{properties.dominant_party ?? "N/A"}</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

import { Marker, Popup } from "react-leaflet";
import { useGeoSpatialData } from "../../hooks/useGeoSpatialData";

export default function PollingMarkerCluster({
    layerType = "parliament",
    intelligenceLayer = "boundaries",
    onSelectHub
}) {
    // Note: useGeoSpatialData expects (layerType, customApiBaseUrl) based on the updated hook signature
    const {
        data,
        loading,
        error
    } = useGeoSpatialData(layerType);

    if (loading || error || !data) {
        return null;
    }

    const features = data.features ?? [];

    return (
        <>
            {features.map((feature, index) => {
                const properties = feature.properties ?? {};
                const centroid = properties.centroid;

                // No valid geometry center
                if (!centroid) {
                    return null;
                }

                return (
                    <Marker
                        key={
                            properties.seat_code ??
                            feature.id ??
                            index
                        }
                        position={centroid}
                        eventHandlers={{
                            click: () => {
                                if (onSelectHub) {
                                    onSelectHub(properties);
                                }
                            }
                        }}
                    >
                        <Popup>
                            <div className="p-1 min-w-[180px]">
                                <h5 className="text-xs font-bold text-slate-900">
                                    {properties.seat_name ??
                                        "Unknown Constituency"}
                                </h5>

                                <p className="text-[11px] text-slate-600 mt-1">
                                    State:{" "}
                                    <strong>
                                        {properties.state_name ??
                                            "N/A"}
                                    </strong>
                                </p>

                                <p className="text-[11px] text-slate-600">
                                    Code:{" "}
                                    <strong>
                                        {properties.seat_code ??
                                            "N/A"}
                                    </strong>
                                </p>

                                <p className="text-[11px] text-slate-600">
                                    Votes:{" "}
                                    <strong>
                                        {Number(
                                            properties.total_votes ??
                                                0
                                        ).toLocaleString()}
                                    </strong>
                                </p>

                                <p className="text-[11px] text-slate-600">
                                    Dominant Party:{" "}
                                    <strong>
                                        {properties.dominant_party ??
                                            "N/A"}
                                    </strong>
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}
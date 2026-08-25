import { GeoJSON } from "react-leaflet";
import { useGeoSpatialData } from "../../hooks/useGeoSpatialData";

export default function ConstituencyLayer({
    activeLayer,
    layerType = "parliament",
    onSelectConstituency
}) {
    const {
        data: geoJsonData,
        loading,
        error
    } = useGeoSpatialData(layerType);

    // ============================================================
    // FEATURE STYLE
    // ============================================================

    const getFeatureStyle = (feature) => {
        const properties = feature.properties ?? {};

        if (activeLayer === "boundaries") {
            return {
                fillColor: "#134074",
                weight: 1.5,
                opacity: 1,
                color: "#ffffff",
                dashArray: "3",
                fillOpacity: 0.65
            };
        }

        if (activeLayer === "choropleth") {
            const party = properties.dominant_party;

            return {
                fillColor: getPartyColor(party),
                weight: 1.5,
                opacity: 1,
                color: "#ffffff",
                dashArray: "3",
                fillOpacity: 0.7
            };
        }

        if (activeLayer === "turnout") {
            const votes = Number(properties.total_votes ?? 0);

            return {
                fillColor: getTurnoutColor(votes),
                weight: 1.5,
                opacity: 1,
                color: "#ffffff",
                fillOpacity: 0.7
            };
        }

        return {
            fillColor: "#134074",
            weight: 1.5,
            opacity: 1,
            color: "#ffffff",
            fillOpacity: 0.65
        };
    };

    // ============================================================
    // FEATURE EVENTS
    // ============================================================

    const onEachFeature = (feature, layer) => {
        const properties = feature.properties ?? {};

        layer.on({
            mouseover: (event) => {
                event.target.setStyle({
                    weight: 3,
                    color: "#ffb703",
                    fillOpacity: 0.85
                });

                event.target.bringToFront();
            },

            mouseout: (event) => {
                event.target.setStyle(getFeatureStyle(feature));
            },

            click: () => {
                if (onSelectConstituency) {
                    onSelectConstituency(properties);
                }
            }
        });

        if (properties.seat_name) {
            layer.bindTooltip(
                `
                    <strong>
                        ${escapeHtml(properties.seat_name)}
                    </strong>
                    <br/>
                    ${escapeHtml(
                        properties.state_name ?? "Unknown State"
                    )}
                `,
                {
                    sticky: true
                }
            );
        }
    };

    // ============================================================
    // STATES
    // ============================================================

    if (loading) {
        return null;
    }

    if (error) {
        console.error("Constituency layer error:", error);
        return null;
    }

    if (!geoJsonData) {
        return null;
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <GeoJSON
            key={`${layerType}-${activeLayer}-${geoJsonData.features?.length || 0}`}
            data={geoJsonData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
        />
    );
}

// ============================================================
// PARTY COLORS
// ============================================================

function getPartyColor(party) {
    if (!party) {
        return "#94a3b8";
    }

    const normalized = String(party).toUpperCase().trim();

    switch (normalized) {
        case "GPS":
            return "#ffb703";

        case "PH":
            return "#e63946";

        case "PN":
            return "#2563eb";

        case "BN":
            return "#facc15";

        case "DAP":
            return "#dc2626";

        case "PAS":
            return "#16a34a";

        default:
            return "#64748b";
    }
}

// ============================================================
// TURNOUT / VOTE COLOR
// ============================================================

function getTurnoutColor(votes) {
    if (votes >= 100000) {
        return "#0b2545";
    }

    if (votes >= 75000) {
        return "#134074";
    }

    if (votes >= 50000) {
        return "#3b82a6";
    }

    if (votes >= 25000) {
        return "#60a5fa";
    }

    return "#bfdbfe";
}

// ============================================================
// HTML SAFETY
// ============================================================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
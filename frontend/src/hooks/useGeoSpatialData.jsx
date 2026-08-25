import { GeoJSON } from "react-leaflet";

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
    // LOADING
    // ============================================================

    if (loading) {
        return null;
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        console.error(
            "Constituency GeoJSON error:",
            error
        );

        return null;
    }

    // ============================================================
    // NO DATA
    // ============================================================

    if (!geoJsonData) {
        return null;
    }

    // ============================================================
    // FEATURE STYLE
    // ============================================================

    const getFeatureStyle = (feature) => {
        const properties =
            feature.properties ?? {};

        // --------------------------------------------
        // BOUNDARIES
        // --------------------------------------------

        if (activeLayer === "boundaries") {
            return {
                fillColor: "#134074",
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.65
            };
        }

        // --------------------------------------------
        // PARTY CHOROPLETH
        // --------------------------------------------

        if (activeLayer === "choropleth") {
            const party =
                properties.dominant_party;

            let fillColor = "#94a3b8";

            if (party === "GPS") {
                fillColor = "#ffb703";
            } else if (party === "PH") {
                fillColor = "#134074";
            } else if (party === "PN") {
                fillColor = "#2563eb";
            } else if (party === "BN") {
                fillColor = "#dc2626";
            }

            return {
                fillColor,
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.65
            };
        }

        // --------------------------------------------
        // TURNOUT
        // --------------------------------------------

        if (activeLayer === "turnout") {
            return {
                fillColor: "#134074",
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.45
            };
        }

        return {
            fillColor: "#134074",
            weight: 1.5,
            opacity: 1,
            color: "white",
            fillOpacity: 0.65
        };
    };

    // ============================================================
    // FEATURE EVENTS
    // ============================================================

    const onEachFeature = (
        feature,
        layer
    ) => {
        layer.on({
            click: () => {
                if (onSelectConstituency) {
                    onSelectConstituency(
                        feature.properties
                    );
                }
            },

            mouseover: (event) => {
                const target =
                    event.target;

                target.setStyle({
                    weight: 3,
                    color: "#ffb703",
                    fillOpacity: 0.8
                });
            },

            mouseout: (event) => {
                const target =
                    event.target;

                target.setStyle(
                    getFeatureStyle(feature)
                );
            }
        });
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <GeoJSON
            key={`${layerType}-${activeLayer}-${geoJsonData.features.length}`}
            data={geoJsonData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
        />
    );
}
import { GeoJSON } from "react-leaflet";
import { useGeoSpatialData } from "../../hooks/useGeoSpatialData";

export default function ConstituencyLayer({
    activeLayer,
    onSelectConstituency
}) {

    /*
     * The current map is displaying parliamentary
     * constituencies.
     *
     * Change this later for a DUN selector.
     */
    const geoLayerType = "parliament";


    const {
        data: geoJsonData,
        loading,
        error
    } = useGeoSpatialData(geoLayerType);


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
        const properties = feature.properties ?? {};

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
        // PARTY CHOROPLETH (Robust Multi-Coalition Match)
        // --------------------------------------------
        if (activeLayer === "choropleth") {
            const rawParty = properties.dominant_party ?? properties.party ?? properties.coalition ?? "";
            const party = rawParty.trim().toUpperCase();

            let fillColor = "#64748b"; // Default slate gray for unmapped labels

            // GPS / Sarawak Parties
            if (party.includes("GPS") || party.includes("PBB") || party.includes("SUPP") || party.includes("PRS") || party.includes("PDP")) {
                fillColor = "#ffb703"; // Amber (GPS theme)
            } 
            // PH / Component Parties
            else if (party.includes("PH") || party.includes("PKR") || party.includes("DAP") || party.includes("AMANAH")) {
                fillColor = "#1d4ed8"; // Strong Blue (PH theme)
            } 
            // PN / Component Parties
            else if (party.includes("PN") || party.includes("PAS") || party.includes("BERSATU") || party.includes("GERAKAN")) {
                fillColor = "#0ea5e9"; // Sky Blue (PN theme)
            } 
            // BN / Component Parties
            else if (party.includes("BN") || party.includes("UMNO") || party.includes("MCA") || party.includes("MIC")) {
                fillColor = "#dc2626"; // Red (BN theme)
            } 
            // GRS (Gabungan Rakyat Sabah)
            else if (party.includes("GRS")) {
                fillColor = "#059669"; // Emerald Green
            }
            // Warisan
            else if (party.includes("WARISAN")) {
                fillColor = "#7c3aed"; // Purple
            }
            // Independent / Bebas
            else if (party.includes("IND") || party.includes("BEBAS")) {
                fillColor = "#475569"; // Dark Slate
            }

            return {
                fillColor,
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.75
            };
        }

        // --------------------------------------------
        // TURNOUT / VOTER DENSITY HEATMAP
        // --------------------------------------------
        if (activeLayer === "turnout") {
            const votes = Number(properties.total_votes ?? properties.electorate ?? 0);
            
            let fillColor = "#e0f2fe"; 
            let fillOpacity = 0.4;

            if (votes > 80000) {
                fillColor = "#0369a1"; 
                fillOpacity = 0.85;
            } else if (votes > 50000) {
                fillColor = "#0284c7";
                fillOpacity = 0.7;
            } else if (votes > 25000) {
                fillColor = "#38bdf8";
                fillOpacity = 0.55;
            }

            return {
                fillColor,
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity
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
            key={activeLayer}
            data={geoJsonData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
        />
    );
}
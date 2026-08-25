import { useState } from "react";
import {
    MapContainer,
    TileLayer
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import ConstituencyLayer from "./ConstituencyLayer";
import PollingMarkerCluster from "./PollingMarkerCluster";
import MapTooltipOverlay from "./MapTooltipOverlay";

import ConstituencyDetailModal from "../modals/ConstituencyDetailModal";

export default function ElectoralMapContainer({
    activeLayer,
    layerType = "parliament"
}) {
    const [
        selectedConstituency,
        setSelectedConstituency
    ] = useState(null);

    const centralMalaysia = [
        2.5,
        112.5
    ];

    return (
        <div className="w-full h-full relative z-10">

            <MapContainer
                center={centralMalaysia}
                zoom={6}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
            >

                {/* =================================================
                    BASE MAP
                ================================================= */}

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />


                {/* =================================================
                    CONSTITUENCY BOUNDARIES
                ================================================= */}

                <ConstituencyLayer
                    activeLayer={activeLayer}
                    layerType={layerType}
                    onSelectConstituency={
                        setSelectedConstituency
                    }
                />


                {/* =================================================
                    DYNAMIC CONSTITUENCY MARKERS
                ================================================= */}

                <PollingMarkerCluster
                    layerType={layerType}
                    intelligenceLayer={activeLayer}
                    onSelectHub={
                        setSelectedConstituency
                    }
                />

            </MapContainer>


            {/* =====================================================
                LIVE TOOLTIP
            ===================================================== */}

            <MapTooltipOverlay
                activeConstituency={
                    selectedConstituency
                }
            />


            {/* =====================================================
                DETAIL MODAL
            ===================================================== */}

            {selectedConstituency && (
                <ConstituencyDetailModal
                    constituency={
                        selectedConstituency
                    }
                    onClose={() =>
                        setSelectedConstituency(
                            null
                        )
                    }
                />
            )}

        </div>
    );
}
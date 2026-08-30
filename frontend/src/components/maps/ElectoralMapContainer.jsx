import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import ConstituencyLayer from "./ConstituencyLayer";
import PollingMarkerCluster from "./PollingMarkerCluster";
import MapTooltipOverlay from "./MapTooltipOverlay";
import MapControlsOverlay from "./MapControlsOverlay";
import MapTelemetryBar from "./MapTelemetryBar";
import ConstituencyDetailModal from "../modals/ConstituencyDetailModal";
import { Info } from "lucide-react";

export default function ElectoralMapContainer({
    activeLayer,
    layerType = "parliament"
}) {
    const [selectedConstituency, setSelectedConstituency] = useState(null);
    const centralMalaysia = [2.5, 112.5];

    return (
        <div className="w-full h-full relative z-10">

            {/* Top Center Floating Instruction Banner */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex flex-col items-center gap-2">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700 pointer-events-auto">
                    <Info size={15} className="text-[#134074]" />
                    <span>Click any constituency boundary or marker to view regional metrics</span>
                </div>
            </div>

            <MapContainer
                center={centralMalaysia}
                zoom={6}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ConstituencyLayer
                    activeLayer={activeLayer}
                    layerType={layerType}
                    onSelectConstituency={setSelectedConstituency}
                />

                <PollingMarkerCluster
                    layerType={layerType}
                    intelligenceLayer={activeLayer}
                    onSelectHub={setSelectedConstituency}
                />

                {/* Floating Map Controls (Zoom/Compass/Fullscreen) */}
                <MapControlsOverlay />

                {/* Telemetry Bar placed inside MapContainer to access useMap() context */}
                <MapTelemetryBar activeLayer={activeLayer} layerType={layerType} />

            </MapContainer>

            <MapTooltipOverlay activeConstituency={selectedConstituency} />

            {selectedConstituency && (
                <ConstituencyDetailModal
                    constituency={selectedConstituency}
                    onClose={() => setSelectedConstituency(null)}
                />
            )}
        </div>
    );
}
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ConstituencyLayer from "./ConstituencyLayer";
import PollingMarkerCluster from "./PollingMarkerCluster";
import MapTooltipOverlay from "./MapTooltipOverlay";
import ConstituencyDetailModal from "../modals/ConstituencyDetailModal";

export default function ElectoralMapContainer({ activeLayer }) {
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const centralMalaysia = [2.5, 112.5]; // Centered nicely for regional mapping workflows

  return (
    <div className="w-full h-full relative z-10">
      <MapContainer
        center={centralMalaysia}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <ConstituencyLayer 
          activeLayer={activeLayer} 
          onSelectConstituency={setSelectedConstituency} 
        />

        <PollingMarkerCluster 
          onSelectHub={setSelectedConstituency} 
        />
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
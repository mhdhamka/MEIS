import { useState } from "react";
import MapToolbar from "../components/maps/MapToolBar";
import ElectoralMapContainer from "../components/maps/ElectoralMapContainer";

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState("boundaries");

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden flex flex-col">
      {/* Floating Control Toolbar */}
      <MapToolbar activeLayer={activeLayer} onLayerChange={setActiveLayer} />

      {/* Render Leaflet Map Viewport */}
      <div className="flex-1 w-full h-full relative">
        <ElectoralMapContainer
            activeLayer={activeLayer}
            layerType="parliament"
        />
      </div>
    </div>
  );
}
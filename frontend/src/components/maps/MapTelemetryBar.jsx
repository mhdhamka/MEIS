import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Globe, Layers, Navigation } from "lucide-react";

export default function MapTelemetryBar({ activeLayer, layerType }) {
  const map = useMap();
  const [coordinates, setCoordinates] = useState({ lat: 2.5000, lng: 112.5000 });
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoordinates({
        lat: e.latlng.lat.toFixed(4),
        lng: e.latlng.lng.toFixed(4)
      });
    };

    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom());
    };

    map.on("mousemove", handleMouseMove);
    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 right-4 z-[999] pointer-events-none hidden md:block">
      <div className="bg-slate-900/85 backdrop-blur-md text-white/90 px-3.5 py-2 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <Globe size={12} className="text-blue-400" />
          <span>EPSG:4326</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Layers size={12} className="text-amber-400" />
          <span className="capitalize">{layerType}</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Navigation size={12} className="text-emerald-400" />
          <span>Z: {zoomLevel}</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div>
          <span>{coordinates.lat}, {coordinates.lng}</span>
        </div>
      </div>
    </div>
  );
}
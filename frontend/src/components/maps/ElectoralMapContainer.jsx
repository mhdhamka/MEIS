import { useState, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Info } from "lucide-react";

import ConstituencyLayer from "./ConstituencyLayer";
import ConstituencyMarkerLayer from "./ConstituencyMarkerLayer";
import MapTooltipOverlay from "./MapTooltipOverlay";
import MapControlsOverlay from "./MapControlsOverlay";
import MapTelemetryBar from "./MapTelemetryBar";
import MapLegend from "./MapLegend";
import MapFocusController from "./MapFocusController";
import ConstituencyInspector from "./ConstituencyInspector";
import { normalizeSeatCode } from "../../utils/electoral";

const MALAYSIA_CENTER = [2.5, 112.5];

export default function ElectoralMapContainer({
  data,
  metric = "boundaries",
  seatType = "parliament",
  electionId,
  selectedConstituency,
  onSelectConstituency,
  onViewProfile,
}) {
  // Hover preview (MapTooltipOverlay) is intentionally separate from
  // "selected" (click -> ConstituencyInspector) per the responsibility
  // split: tooltip = quick hover glance, inspector = browsing detail.
  const [hoveredConstituency, setHoveredConstituency] = useState(null);

  // The feature the map should fly to (set when a search result or
  // marker is chosen). Kept separate from `selectedConstituency`
  // (which is just the plain properties object the inspector reads).
  const [focusFeature, setFocusFeature] = useState(null);

  // Normalized once here so ConstituencyLayer can do a cheap equality
  // check per feature instead of re-normalizing on every render.
  const selectedSeatCode = useMemo(
    () => normalizeSeatCode(selectedConstituency?.seat_code) || null,
    [selectedConstituency]
  );

  const handleSelect = (properties) => {
    onSelectConstituency?.(properties);

    const matchingFeature = data?.features?.find(
      (feature) => feature.properties?.seat_code === properties?.seat_code
    );
    if (matchingFeature) {
      setFocusFeature(matchingFeature);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-3">
      {/* MAP PANE */}
      <div className="relative min-h-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        {/* Top Center Floating Instruction Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex flex-col items-center gap-2">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700 pointer-events-auto">
            <Info size={15} className="text-[#134074]" />
            <span>Click any constituency boundary or marker to view regional metrics</span>
          </div>
        </div>

        <MapContainer
          center={MALAYSIA_CENTER}
          zoom={6}
          scrollWheelZoom
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ConstituencyLayer
            data={data}
            metric={metric}
            selectedSeatCode={selectedSeatCode}
            onSelectConstituency={handleSelect}
            onHoverConstituency={setHoveredConstituency}
          />

          <ConstituencyMarkerLayer data={data} onSelectConstituency={handleSelect} />

          <MapFocusController feature={focusFeature} />

          <MapControlsOverlay />

          {/* Needs to live inside MapContainer to access useMap() */}
          <MapTelemetryBar
            activeLayer={metric}
            layerType={seatType}
            visibleFeatures={data?.features?.length ?? 0}
            electionId={electionId}
          />
        </MapContainer>

        <MapLegend metric={metric} />

        <MapTooltipOverlay activeConstituency={hoveredConstituency} />
      </div>

      {/* INSPECTOR PANE */}
      <ConstituencyInspector constituency={selectedConstituency} onViewProfile={onViewProfile} />
    </div>
  );
}

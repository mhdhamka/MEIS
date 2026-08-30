import { useMap } from "react-leaflet";
import { Plus, Minus, Compass, Maximize } from "lucide-react";

export default function MapControlsOverlay() {
  const map = useMap();

  const handleResetView = () => {
    map.flyTo([2.5, 112.5], 6, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-1.5 flex flex-col gap-1">
        <button
          onClick={() => map.zoomIn()}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center justify-center"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center justify-center"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
        <div className="h-[1px] bg-slate-200 my-0.5 mx-1" />
        <button
          onClick={handleResetView}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center justify-center"
          title="Reset View to Malaysia Center"
        >
          <Compass size={18} />
        </button>
        <button
          onClick={handleToggleFullscreen}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center justify-center"
          title="Toggle Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
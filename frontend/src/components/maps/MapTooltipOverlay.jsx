export default function MapTooltipOverlay({ activeConstituency }) {
  if (!activeConstituency) return null;

  return (
    <div className="absolute bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl max-w-xs animate-in fade-in duration-150">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-blue-50 px-2 py-0.5 rounded">
        Live Inspector Feed
      </span>
      <h4 className="text-sm font-bold text-slate-900 mt-1">{activeConstituency.name}</h4>
      <div className="mt-2 space-y-1 text-xs text-slate-600">
        <p>State Region: <strong className="text-slate-900">{activeConstituency.state}</strong></p>
        <p>Dominant Alliance: <strong className="text-slate-900">{activeConstituency.dominantParty}</strong></p>
      </div>
    </div>
  );
}
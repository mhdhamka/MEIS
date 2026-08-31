import { MapPin } from "lucide-react";

export default function JurisdictionOverview({ stateSeats = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
          <MapPin size={16} className="text-[#134074]" />
          Jurisdiction Overview
        </h3>
        <p className="text-xs text-slate-500 mb-4">Regional state seat metrics count</p>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {stateSeats.map((state, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 text-xs">
              <span className="font-medium text-slate-700">{state.state_name}</span>
              <span className="font-bold text-[#134074]">{state.seats} seats</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">MEIS Command Center Core v1.0</span>
      </div>
    </div>
  );
}
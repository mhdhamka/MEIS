import { useState } from "react";
import { ChevronRight } from "lucide-react";
import EmptyState from "../states/EmptyState"; 
export default function JurisdictionOverview({ stateSeats = [] }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Calculate the total seats dynamically from all visible state rows
  const calculatedTotal = stateSeats.reduce((acc, curr) => acc + Number(curr.total_seats ?? curr.seats ?? 0), 0);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-[#134074] rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-blue-500/20 backdrop-blur-md mb-2 shadow-sm">
            Regional Scope
          </span>
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            Jurisdiction Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Regional state seat metrics count
          </p>
        </div>

        {/* Body Content - Replaced scroller with clean matching layout */}
        <div className="space-y-3.5">
          {stateSeats.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 text-center text-xs text-slate-400 font-medium">
              No regional data available
            </div>
          ) : (
            stateSeats.map((state, index) => {
              const seats = Number(state.total_seats ?? state.seats ?? 0);
              const percentage = calculatedTotal > 0 ? (seats / calculatedTotal) * 100 : 0;
              const stateName = state.state_name ?? "Unknown";
              const isSelected = selectedState === stateName;
              const isHovered = hoveredIndex === index;

              return (
                <div 
                  key={index}
                  onClick={() => setSelectedState(isSelected ? null : stateName)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border backdrop-blur-xl ${
                    isSelected 
                      ? "bg-white/80 border-[#134074] shadow-md ring-1 ring-[#134074]/20" 
                      : isHovered
                      ? "bg-white/70 border-white"
                      : "bg-white/40 border-white/60 hover:border-white"
                  }`}
                >
                  {/* Top row labels */}
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
                      <span className="text-slate-800 font-bold tracking-wide text-sm group-hover:text-[#134074] transition-colors">
                        {stateName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-slate-500 text-[11px]">{percentage.toFixed(1)}%</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 font-black text-[#134074]">
                        {seats} <span className="text-[10px] text-blue-600/70 font-normal">SEATS</span>
                      </span>
                      <ChevronRight size={14} className={`text-slate-400 transition-transform duration-200 ${isSelected ? "rotate-90 text-[#134074]" : ""}`} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner relative">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  {/* Expandable Diagnostic HUD */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs font-mono text-slate-600 flex justify-between items-center animate-fadeIn">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Regional Weight</span>
                      <span className="font-bold text-[#134074]">{seats} of {calculatedTotal} total regional seats</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/50 text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
          MEIS Command Center Core v1.0
        </span>
      </div>
    </div>
  );
}
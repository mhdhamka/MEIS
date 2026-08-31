import { useState } from "react";
import { TrendingUp, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react";
import EmptyState from "../states/EmptyState";

export default function PartyDistributionCard({ partySeats = [], totalSeats = 0, getPartyBarColor }) {
  const [selectedParty, setSelectedParty] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-slate-900">
      {/* Header Container */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#134074]/10 text-[#134074]">
              <TrendingUp size={16} />
            </span>
            Party Seat Distribution Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">LIVE_TELEMETRY // PARLIAMENTARY_SEAT_ALLOCATION</p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            LIVE FEED
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-3.5">
        {partySeats.length === 0 ? (
          <EmptyState title="No party data" message="No party seat distribution data available for this selection." />
        ) : (
          partySeats.map((party, index) => {
            const seats = Number(party.seats ?? party.seat_count ?? 0);
            const calculatedTotal = totalSeats > 0 ? totalSeats : partySeats.reduce((acc, curr) => acc + Number(curr.seats ?? curr.seat_count ?? 0), 0);
            const percentage = party.percentage ?? (calculatedTotal > 0 ? (seats / calculatedTotal) * 100 : 0);
            const barColor = getPartyBarColor ? getPartyBarColor(party.party_name) : "#134074";
            const isSelected = selectedParty?.party_name === party.party_name;
            const isHovered = hoveredIndex === index;

            return (
              <div 
                key={party.party_id ? `${party.party_id}-${index}` : index}
                onClick={() => setSelectedParty(isSelected ? null : party)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isSelected 
                    ? "bg-slate-50 border-[#134074] shadow-sm ring-1 ring-[#134074]/20" 
                    : isHovered
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Top row labels */}
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-md shadow-2xs" 
                      style={{ backgroundColor: barColor }} 
                    />
                    <span className="text-slate-800 font-bold tracking-wide text-sm">{party.party_name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500 text-[11px]">{isNaN(percentage) ? "0.0" : percentage.toFixed(1)}%</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {seats} <span className="text-[10px] text-slate-500 font-normal">SEATS</span>
                    </span>
                    <ChevronRight size={14} className={`text-slate-400 transition-transform duration-200 ${isSelected ? "rotate-90 text-[#134074]" : ""}`} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner relative">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(isNaN(percentage) ? 0 : percentage, 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                {/* Expandable Diagnostic HUD */}
                {isSelected && (
                  <div className="mt-4 pt-3.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono animate-fadeIn">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Majority Status</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Zap size={12} className="text-amber-500" />
                        {seats >= (calculatedTotal / 2) && calculatedTotal > 0 ? "Absolute Majority" : "Coalition Entity"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Seat Efficiency</span>
                      <span className="font-bold text-[#134074] flex items-center gap-1.5 mt-0.5">
                        <Activity size={12} />
                        {calculatedTotal > 0 ? ((seats / calculatedTotal) * 100).toFixed(2) : 0}% Yield
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Telemetry State</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck size={12} /> Verified Returns
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
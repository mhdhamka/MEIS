import { useState, useMemo } from "react";
import { ChevronRight, Search, ArrowUpDown } from "lucide-react";

export default function PartyDistributionCard({ partySeats = [], getPartyBarColor }) {
  const [selectedParty, setSelectedParty] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSegment, setActiveSegment] = useState(null); // For chart hover tooltips
  const [viewMode, setViewMode] = useState("list"); // "list" or "chart"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("seats-desc"); // "seats-desc", "seats-asc", "name"

  // Calculate total dynamically
  const calculatedTotal = partySeats.reduce((acc, curr) => acc + Number(curr.seats ?? curr.seat_count ?? 0), 0);

  // Filter and sort party seats
  const processedParties = useMemo(() => {
    let result = [...partySeats];

    if (searchQuery.trim() !== "") {
      result = result.filter(p => 
        (p.party_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aSeats = Number(a.seats ?? a.seat_count ?? 0);
      const bSeats = Number(b.seats ?? b.seat_count ?? 0);
      
      if (sortBy === "seats-desc") return bSeats - aSeats;
      if (sortBy === "seats-asc") return aSeats - bSeats;
      if (sortBy === "name") return (a.party_name ?? "").localeCompare(b.party_name ?? "");
      return 0;
    });

    return result;
  }, [partySeats, searchQuery, sortBy]);

  // Compute SVG Donut Chart Slices dynamically
  const chartSlices = useMemo(() => {
    let cumulativePercent = 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return processedParties.map((party) => {
      const seats = Number(party.seats ?? party.seat_count ?? 0);
      const percentage = calculatedTotal > 0 ? (seats / calculatedTotal) * 100 : 0;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulativePercent / 100) * circumference);
      cumulativePercent += percentage;

      return {
        ...party,
        seats,
        percentage,
        strokeDasharray,
        strokeDashoffset,
        color: getPartyBarColor ? getPartyBarColor(party.party_name) : "#134074",
      };
    });
  }, [processedParties, calculatedTotal, getPartyBarColor]);

  return (
    <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 transition-all duration-300">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/50">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-[#134074] rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-blue-500/20 backdrop-blur-md mb-2 shadow-sm">
            Parliamentary Allocation
          </span>
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            Party Seat Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Live telemetry for parliamentary seat allocation
          </p>
        </div>

        {/* View Mode & Toggle Controls */}
        {partySeats.length > 0 && (
          <div className="flex items-center p-1 rounded-xl bg-slate-200/50 border border-slate-200/85 backdrop-blur-md">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-[#134074] shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === "chart"
                  ? "bg-white text-[#134074] shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Chart
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar (Search & Sort) */}
      {partySeats.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/60 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134074]/30 focus:border-[#134074] transition-all backdrop-blur-md shadow-2xs"
            />
          </div>

          <div className="relative w-full sm:w-auto flex items-center gap-2 bg-white/60 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-600 backdrop-blur-md shadow-2xs">
            <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="seats-desc">Seats (High to Low)</option>
              <option value="seats-asc">Seats (Low to High)</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="space-y-3.5">
        {partySeats.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-white/40 rounded-2xl border border-white/60 backdrop-blur-md">
            No party seat distribution data available for this selection.
          </div>
        ) : processedParties.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-white/40 rounded-2xl border border-white/60 backdrop-blur-md">
            No matching parties found for &quot;<span className="font-bold text-slate-700">{searchQuery}</span>&quot;.
          </div>
        ) : viewMode === "chart" ? (
          /* Interactive SVG Donut Chart View */
          <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-inner flex flex-col md:flex-row items-center gap-8 animate-fadeIn">
            
            {/* Donut Graphic Container */}
            <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-md">
                {/* Background track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                />
                {/* Dynamic Party Slices */}
                {chartSlices.map((slice, index) => {
                  const isHighlighted = activeSegment?.party_name === slice.party_name;
                  return (
                    <circle
                      key={`donut-slice-${index}`}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHighlighted ? "18" : "14"}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      onMouseEnter={() => setActiveSegment(slice)}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() => setSelectedParty(selectedParty?.party_name === slice.party_name ? null : slice)}
                      className="transition-all duration-300 cursor-pointer origin-center hover:opacity-90"
                    />
                  );
                })}
              </svg>

              {/* Center Readout HUD inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {activeSegment ? activeSegment.party_name : "Total Seats"}
                </span>
                <span className="text-xl font-black text-slate-900 mt-0.5">
                  {activeSegment ? activeSegment.seats : calculatedTotal}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#134074]">
                  {activeSegment ? `${activeSegment.percentage.toFixed(1)}%` : "Allocation"}
                </span>
              </div>
            </div>

            {/* Interactive Legend and Breakdown Panel */}
            <div className="flex-1 w-full space-y-2 max-h-64 overflow-y-auto pr-1">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-2">
                Click or Hover Sectors for Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {chartSlices.map((party, index) => {
                  const isHighlighted = activeSegment?.party_name === party.party_name;
                  const isSelected = selectedParty?.party_name === party.party_name;

                  return (
                    <div
                      key={`chart-legend-${index}`}
                      onMouseEnter={() => setActiveSegment(party)}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() => setSelectedParty(isSelected ? null : party)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isHighlighted || isSelected
                          ? "bg-white/90 border-[#134074] shadow-md ring-1 ring-[#134074]/20 scale-[1.02]"
                          : "bg-white/70 border-white/80 hover:bg-white/90 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-3 h-3 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: party.color }} />
                        <span className="text-xs font-bold text-slate-800 truncate">{party.party_name}</span>
                      </div>
                      <div className="text-right font-mono shrink-0 ml-2">
                        <span className="text-xs font-extrabold text-[#134074]">{party.seats}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({party.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List View Option */
          processedParties.map((party, index) => {
            const seats = Number(party.seats ?? party.seat_count ?? 0);
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
                className={`group p-4 rounded-2xl transition-all duration-200 cursor-pointer border backdrop-blur-xl ${
                  isSelected 
                    ? "bg-white/85 border-[#134074] shadow-md ring-1 ring-[#134074]/20" 
                    : isHovered
                    ? "bg-white/75 border-white"
                    : "bg-white/40 border-white/60 hover:border-white"
                }`}
              >
                {/* Top row labels */}
                <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3 h-3 rounded-lg shadow-2xs shrink-0" 
                      style={{ backgroundColor: barColor }} 
                    />
                    <span className="text-slate-800 font-bold tracking-wide text-sm group-hover:text-[#134074] transition-colors">
                      {party.party_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500 text-[11px]">{isNaN(percentage) ? "0.0" : percentage.toFixed(1)}%</span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 font-black text-[#134074]">
                      {seats} <span className="text-[10px] text-blue-600/70 font-normal">SEATS</span>
                    </span>
                    <ChevronRight size={14} className={`text-slate-400 transition-transform duration-200 ${isSelected ? "rotate-90 text-[#134074]" : ""}`} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner relative">
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
                  <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono animate-fadeIn">
                    <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-2xs">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Majority Status</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1.5 mt-1">
                        {seats >= (calculatedTotal / 2) && calculatedTotal > 0 ? "Absolute Majority" : "Coalition Entity"}
                      </span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-2xs">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Seat Efficiency</span>
                      <span className="font-bold text-[#134074] flex items-center gap-1.5 mt-1">
                        {calculatedTotal > 0 ? ((seats / calculatedTotal) * 100).toFixed(2) : 0}% Yield
                      </span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-2xs">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Telemetry State</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                        Verified Returns
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
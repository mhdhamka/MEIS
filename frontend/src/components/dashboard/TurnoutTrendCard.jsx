import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

export default function TurnoutTrendCard({ summary }) {
  const [viewMode, setViewMode] = useState("card"); // "card" or "chart"
  const [activeSegment, setActiveSegment] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Extract specific telemetry details for the active election filter
  const turnoutRate = summary?.turnout ?? "0%";
  const totalVotes = summary?.total_votes ?? "0";
  const totalCandidates = summary?.total_candidates ?? 0;
  const numericTurnout = parseFloat(turnoutRate) || 0;

  // Mock breakdown or percentages for the chart view option
  const chartSlices = useMemo(() => {
    const turnoutNum = Math.min(Math.max(numericTurnout, 0), 100);
    const abstentionNum = Math.max(100 - turnoutNum, 0);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const data = [
      { label: "Voter Turnout", value: turnoutNum, color: "#059669", count: totalVotes },
      { label: "Abstention / Uncast", value: abstentionNum, color: "#94a3b8", count: "Estimated Balance" }
    ];

    let cumulativePercent = 0;
    return data.map((item) => {
      const percentage = item.value;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulativePercent / 100) * circumference);
      cumulativePercent += percentage;

      return {
        ...item,
        percentage,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [numericTurnout, totalVotes]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Header Container with View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/50">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-800 rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-emerald-500/20 backdrop-blur-md mb-2 shadow-sm">
              Historical Telemetry
            </span>
            <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              Voter Turnout Trend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Active election participation metrics and analytics
            </p>
          </div>

          {/* View Mode & Toggle Controls */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/50 border border-slate-200/85 backdrop-blur-md shrink-0">
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === "card"
                  ? "bg-white text-emerald-800 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === "chart"
                  ? "bg-white text-emerald-800 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Chart
            </button>
          </div>
        </div>

        {/* Dynamic View: Card View vs Chart View */}
        {viewMode === "chart" ? (
          /* Interactive SVG Donut Chart View */
          <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-inner flex flex-col md:flex-row items-center gap-8 animate-fadeIn">
            {/* Donut Graphic Container */}
            <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-md">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                />
                {chartSlices.map((slice, index) => {
                  const isHighlighted = activeSegment?.label === slice.label;
                  return (
                    <circle
                      key={`turnout-slice-${index}`}
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
                      onClick={() => setSelectedMetric(selectedMetric?.label === slice.label ? null : slice)}
                      className="transition-all duration-300 cursor-pointer origin-center hover:opacity-90"
                    />
                  );
                })}
              </svg>

              {/* Center Readout HUD */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {activeSegment ? activeSegment.label : "Turnout"}
                </span>
                <span className="text-xl font-black text-slate-900 mt-0.5 font-mono">
                  {activeSegment ? `${activeSegment.percentage.toFixed(1)}%` : turnoutRate}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  {activeSegment ? activeSegment.count : "Participation"}
                </span>
              </div>
            </div>

            {/* Interactive Legend and Breakdown Panel */}
            <div className="flex-1 w-full space-y-2.5">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-2">
                Click or Hover Sectors for Details
              </div>
              <div className="flex flex-col gap-2.5">
                {chartSlices.map((slice, index) => {
                  const isHighlighted = activeSegment?.label === slice.label;
                  const isSelected = selectedMetric?.label === slice.label;

                  return (
                    <div
                      key={`turnout-legend-${index}`}
                      onMouseEnter={() => setActiveSegment(slice)}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() => setSelectedMetric(isSelected ? null : slice)}
                      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isHighlighted || isSelected
                          ? "bg-white/90 border-emerald-600 shadow-md ring-1 ring-emerald-500/20 scale-[1.02]"
                          : "bg-white/70 border-white/80 hover:bg-white/90 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-3 h-3 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: slice.color }} />
                        <span className="text-xs font-bold text-slate-800 truncate">{slice.label}</span>
                      </div>
                      <div className="text-right font-mono shrink-0 ml-2">
                        <span className="text-xs font-extrabold text-emerald-700">{slice.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Main Turnout Display Card View */
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">
                  Recorded Turnout Rate
                </span>
                <div className="text-3xl font-black font-mono text-emerald-700 tracking-tight">
                  {turnoutRate}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-sm">
                <TrendingUp size={22} />
              </div>
            </div>

            {/* Progress Bar Representation */}
            <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Participation Density</span>
                <span className="font-mono text-emerald-700">{turnoutRate}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
                <div 
                  className="h-full rounded-full bg-emerald-600 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(numericTurnout, 100)}%` }}
                />
              </div>
            </div>

            {/* Sub Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                  Total Ballots / Votes
                </span>
                <span className="text-sm font-black font-mono text-slate-800">
                  {typeof totalVotes === 'number' ? totalVotes.toLocaleString() : totalVotes}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                  Total Candidates
                </span>
                <span className="text-sm font-black font-mono text-slate-800">
                  {totalCandidates.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/50 text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
          MEIS Command Center Core v1.0
        </span>
      </div>
    </div>
  );
}
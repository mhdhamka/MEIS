import { MapPinned, ArrowUpRight, Trophy, Users, BarChart3, PieChart, CheckCircle2 } from "lucide-react";

function MetricCard({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className={`p-3 rounded-xl border transition-all ${
      highlight 
        ? "bg-blue-500/10 border-blue-500/30 text-white" 
        : "bg-slate-800/40 border-slate-700/50 text-slate-200"
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && <Icon size={13} className={highlight ? "text-blue-400" : "text-slate-500"} />}
      </div>
      <div className="text-sm font-bold tracking-tight truncate">
        {value}
      </div>
    </div>
  );
}

export default function ConstituencyInspector({ constituency, onViewProfile, history = [] }) {
  // --------------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------------

  if (!constituency) {
    return (
      <aside className="hidden xl:flex flex-col items-center justify-center h-full bg-[#0b132b] rounded-2xl border border-slate-800 shadow-xl px-6 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 shadow-inner">
          <MapPinned size={22} className="text-blue-400" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
          No Constituency Selected
        </p>
        <p className="text-[11px] text-slate-500 mt-1.5 max-w-[210px] leading-relaxed">
          Click on any polygon or map marker to inspect granular electoral breakdowns and analytics.
        </p>
      </aside>
    );
  }

  // --------------------------------------------------------
  // SELECTED STATE
  // --------------------------------------------------------

  const {
    seat_code: seatCode,
    seat_name: seatName,
    state_name: stateName,
    dominant_party: party,
    winner_name: winnerName,
    winner_votes: winnerVotes,
    vote_share: voteShare,
    majority,
    turnout,
    candidate_count: candidateCount,
    total_votes: totalVotes,
  } = constituency;

  return (
    <aside className="hidden xl:flex flex-col h-full bg-[#0b132b] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
      
      {/* HEADER */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
            {seatCode ?? "N/A"}
          </span>
          <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {stateName ?? "Malaysia"}
          </span>
        </div>
        <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
          {seatName ?? "Unknown Constituency"}
        </h3>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
        
        {/* WINNER PROFILE CARD */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Trophy size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Leading Representative</span>
          </div>
          <div className="font-bold text-sm text-white tracking-tight">
            {winnerName ?? "N/A"}
          </div>
          <div className="text-xs font-semibold text-blue-300 mt-0.5">
            {party ?? "N/A"}
          </div>
        </div>

        {/* METRICS GRID */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Electoral Metrics
          </p>
          <div className="grid grid-cols-2 gap-2">
            <MetricCard 
              icon={BarChart3} 
              label="Votes" 
              value={winnerVotes != null ? Number(winnerVotes).toLocaleString() : "N/A"} 
            />
            <MetricCard 
              icon={PieChart} 
              label="Vote Share" 
              value={voteShare != null ? `${Number(voteShare).toFixed(1)}%` : "N/A"} 
            />
            <MetricCard 
              icon={CheckCircle2} 
              label="Majority" 
              value={majority != null ? Number(majority).toLocaleString() : "N/A"} 
              highlight={true}
            />
            <MetricCard 
              icon={ActivityIconFallback} 
              label="Turnout" 
              value={turnout != null ? `${Number(turnout).toFixed(1)}%` : "N/A"} 
            />
            <MetricCard 
              icon={Users} 
              label="Candidates" 
              value={candidateCount ?? "N/A"} 
            />
            <MetricCard 
              label="Total Cast" 
              value={totalVotes != null ? Number(totalVotes).toLocaleString() : "N/A"} 
            />
          </div>
        </div>

        {/* HISTORY SECTION */}
        {history.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Historical Performance
            </p>
            <ul className="space-y-2">
              {history.map((entry) => (
                <li
                  key={entry.election_name}
                  className="flex items-center justify-between text-xs bg-slate-900/50 border border-slate-800/60 rounded-xl px-3 py-2.5"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200">
                      {entry.election_name}
                    </span>
                    <span className="text-[10px] text-slate-400">{entry.party}</span>
                  </div>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    +{Number(entry.majority ?? 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <button
          type="button"
          onClick={() => onViewProfile?.(seatCode)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer active:scale-[0.98]"
        >
          View Full Profile
          <ArrowUpRight size={15} />
        </button>
      </div>
    </aside>
  );
}

// Fallback icon helper for turnout card
function ActivityIconFallback(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
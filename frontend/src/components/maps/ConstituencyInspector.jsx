import { useState } from "react";
import { MapPinned, ArrowUpRight, Copy, Check, TrendingUp, Award } from "lucide-react";

function StatRow({ label, value, icon: Icon = false, colorClass = "text-slate-100" }) {
  return (
    <div className="group flex items-center justify-between gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/10">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={13} className="text-slate-400 group-hover:text-blue-400 transition-colors" />}
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
          {label}
        </span>
      </div>
      <span className={`text-xs font-bold text-right transition-transform group-hover:scale-[1.02] ${colorClass}`}>
        {value}
      </span>
    </div>
  );
}

export default function ConstituencyInspector({ constituency, onViewProfile, history = [] }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history"

  // Quick-copy seat code interaction
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --------------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------------

  if (!constituency) {
    return (
      <aside className="hidden xl:flex flex-col items-center justify-center h-full bg-slate-950/60 backdrop-blur-2xl rounded-2xl border border-slate-700/40 shadow-2xl px-6 text-center relative overflow-hidden group">
        {/* Ambient background lighting effect */}
        <div className="absolute -inset-px bg-gradient-to-b from-blue-500/10 via-transparent to-indigo-500/10 rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10 animate-pulse">
          <MapPinned size={24} className="text-blue-400" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Select a constituency
        </p>
        <p className="text-[11px] text-slate-400 mt-1.5 max-w-[210px] leading-relaxed">
          Click any polygon or map marker to launch real-time intelligence analytics.
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
    <aside className="hidden xl:flex flex-col h-full bg-slate-950/80 backdrop-blur-3xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-blue-950/20 overflow-hidden text-slate-100 relative group">
      
      {/* Subtle ambient neon trace on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75" />

      {/* HEADER */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800/80 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleCopyCode(seatCode)}
            className="group/badge inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/30 px-3 py-1 rounded-full shadow-sm hover:bg-blue-500/25 transition-all cursor-pointer active:scale-95"
            title="Click to copy code"
          >
            <span>{seatCode ?? "N/A"}</span>
            {copied ? (
              <Check size={11} className="text-emerald-400 animate-bounce" />
            ) : (
              <Copy size={11} className="text-blue-400/70 group-hover/badge/text-blue-300" />
            )}
          </button>

          {/* Interactive Toggle Pill if history exists */}
          {history.length > 0 && (
            <div className="flex bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab("overview")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  activeTab === "overview" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  activeTab === "history" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                History ({history.length})
              </button>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-white mt-3 leading-snug tracking-tight group-hover:text-blue-200 transition-colors">
          {seatName ?? "Unknown Constituency"}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          {stateName ?? "N/A"}
        </p>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {activeTab === "overview" ? (
          <div className="space-y-3 animate-fadeIn">
            {/* WINNER & METRICS CARD */}
            <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-slate-800/80 shadow-inner backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1.5 flex items-center gap-1.5">
                <Award size={12} className="text-amber-400" />
                Winner & Core Analytics
              </p>
              <div className="divide-y divide-slate-800/50">
                <StatRow label="Candidate" value={winnerName ?? "N/A"} colorClass="text-white" />
                <StatRow label="Party" value={party ?? "N/A"} colorClass="text-blue-400 font-extrabold" />
                <StatRow
                  label="Votes"
                  value={winnerVotes != null ? Number(winnerVotes).toLocaleString() : "N/A"}
                />
                <StatRow
                  label="Vote Share"
                  value={voteShare != null ? `${Number(voteShare).toFixed(1)}%` : "N/A"}
                  colorClass="text-emerald-400 font-bold"
                />
                <StatRow
                  label="Majority"
                  value={majority != null ? `+${Number(majority).toLocaleString()}` : "N/A"}
                  colorClass="text-indigo-300"
                />
                <StatRow
                  label="Turnout"
                  value={turnout != null ? `${Number(turnout).toFixed(1)}%` : "N/A"}
                />
                <StatRow label="Candidates" value={candidateCount ?? "N/A"} />
                {totalVotes != null && (
                  <StatRow label="Total Votes" value={Number(totalVotes).toLocaleString()} icon={TrendingUp} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* HISTORY TAB CONTENT */
          <div className="space-y-2.5 animate-fadeIn">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
              Historical Performance Log
            </p>
            <ul className="space-y-2.5">
              {history.map((entry) => (
                <li
                  key={entry.election_name}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-slate-900 transition-all duration-200 cursor-pointer group/item"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-200 group-hover/item:text-blue-300 transition-colors">
                      {entry.election_name}
                    </span>
                    <span className="font-extrabold text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      +{Number(entry.majority ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Party: <strong className="text-slate-300">{entry.party}</strong></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-slate-800/80 bg-gradient-to-t from-slate-950/90 to-transparent">
        <button
          type="button"
          onClick={() => onViewProfile?.(seatCode)}
          className="w-full relative group/btn overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-out" />
          
          <span>View Comprehensive Profile</span>
          <ArrowUpRight size={15} className="stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>

    </aside>
  );
}
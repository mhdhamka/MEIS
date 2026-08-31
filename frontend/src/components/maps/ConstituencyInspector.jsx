import { MapPinned, ArrowUpRight } from "lucide-react";

function StatRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-bold text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function ConstituencyInspector({ constituency, onViewProfile, history = [] }) {
  // --------------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------------

  if (!constituency) {
    return (
      <aside className="hidden xl:flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-slate-200 shadow-sm px-6 text-center">
        <MapPinned size={28} className="text-slate-300 mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select a constituency
        </p>
        <p className="text-[11px] text-slate-400 mt-1.5 max-w-[200px]">
          Click a polygon or marker to inspect its electoral information.
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
    <aside className="hidden xl:flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-blue-50 px-2 py-0.5 rounded">
          {seatCode ?? "N/A"}
        </span>
        <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
          {seatName ?? "Unknown Constituency"}
        </h3>
        <p className="text-xs text-slate-500">{stateName ?? "N/A"}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* WINNER */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Winner
        </p>
        <div className="divide-y divide-slate-100 mb-4">
          <StatRow label="Candidate" value={winnerName ?? "N/A"} />
          <StatRow label="Party" value={party ?? "N/A"} />
          <StatRow
            label="Votes"
            value={
              winnerVotes != null ? Number(winnerVotes).toLocaleString() : "N/A"
            }
          />
          <StatRow
            label="Vote Share"
            value={voteShare != null ? `${Number(voteShare).toFixed(1)}%` : "N/A"}
          />
          <StatRow
            label="Majority"
            value={majority != null ? Number(majority).toLocaleString() : "N/A"}
          />
          <StatRow
            label="Turnout"
            value={turnout != null ? `${Number(turnout).toFixed(1)}%` : "N/A"}
          />
          <StatRow label="Candidates" value={candidateCount ?? "N/A"} />
          {totalVotes != null && (
            <StatRow label="Total Votes Cast" value={Number(totalVotes).toLocaleString()} />
          )}
        </div>

        {/* HISTORY (populated once /constituencies/{seat}/history exists) */}
        {history.length > 0 && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Electoral History
            </p>
            <ul className="space-y-2">
              {history.map((entry) => (
                <li
                  key={entry.election_name}
                  className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2"
                >
                  <span className="font-semibold text-slate-700">
                    {entry.election_name}
                  </span>
                  <span className="text-slate-500">{entry.party}</span>
                  <span className="font-bold text-emerald-600">
                    +{Number(entry.majority ?? 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewProfile?.(seatCode)}
          className="w-full flex items-center justify-center gap-1.5 bg-[#134074] hover:bg-[#0b2545] text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
        >
          View Full Profile
          <ArrowUpRight size={14} />
        </button>
      </div>
    </aside>
  );
}

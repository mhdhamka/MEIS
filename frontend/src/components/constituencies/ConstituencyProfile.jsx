import { Link } from "react-router-dom";
import { Map, ArrowRight } from "lucide-react";

export default function ConstituencyProfile({
    constituency,
    loading = false,
    onClose,
    onViewMap,
}) {
    if (!constituency) {
        return null;
    }

    // Rely on data passed cleanly down from the parent/hook state
    const data = constituency.data && typeof constituency.data === 'object' 
        ? constituency.data 
        : constituency;

    const seatId = data?.seat_id ?? data?.id;

    const code =
        data.seat_code ??
        data.code ??
        data.code_parlimen ??
        data.code_dun;

    const name =
        data.seat_name ??
        data.name ??
        data.constituency_name ??
        "Unknown Constituency";

    const state =
        data.state_name ??
        data.state ??
        "Unknown State";

    // Expanded fallbacks for winning details
    const winner =
        data.winner_party ??
        data.winning_party ??
        data.dominant_party ??
        data.party ??
        data.winner ??
        "N/A";

    const votes = Number(
        data.winner_votes ??
        data.votes ??
        data.total_votes ??
        data.winning_votes ??
        0
    );

    const voteShare = Number(
        data.vote_share ??
        data.winner_vote_share ??
        data.percentage ??
        0
    );

    const margin = Number(
        data.margin ??
        data.majority ??
        data.majority_margin ??
        data.majority_votes ??
        0
    );

    const turnout = Number(
        data.turnout ??
        data.turnout_percentage ??
        data.voter_turnout ??
        0
    );

    const candidates = Number(
        data.candidate_count ??
        data.candidates_count ??
        data.candidates ??
        data.total_candidates ??
        0
    );

    // Broadened fallback for history array to catch nested API payloads
    const history =
        data.history ??
        data.historical_results ??
        data.past_elections ??
        data.results ??
        data.data?.history ??
        data.data?.historical_results ??
        data.data?.results ??
        [];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm flex justify-end transition-all">
            <div className="w-full max-w-2xl h-full bg-white/75 backdrop-blur-2xl border-l border-white/60 shadow-2xl shadow-slate-500/10 overflow-y-auto flex flex-col">

                {/* HEADER */}
                <div className="sticky top-0 z-25 bg-white/80 backdrop-blur-xl border-b border-white/80 px-6 py-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#134074]/10 text-[#134074] border border-[#134074]/20">
                                    {code}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-white/60 text-[9px] uppercase font-bold text-slate-500 border border-slate-200/60">
                                    Constituency {seatId ? `• ID: ${seatId}` : ""}
                                </span>
                            </div>
                            <h2 className="mt-2 text-xl font-black text-slate-900 tracking-tight">
                                {name}
                            </h2>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">
                                {state}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white/80 border border-transparent hover:border-slate-200/60 transition text-xs font-bold shadow-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-5 flex-1">
                    {loading ? (
                        <div className="py-20 text-center text-xs font-bold text-slate-400 animate-pulse">
                            Loading profile details...
                        </div>
                    ) : (
                        <>
                            {/* CURRENT RESULT */}
                            <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100/80">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Current Result
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Metric
                                            label="Winner"
                                            value={winner}
                                        />
                                        <Metric
                                            label="Votes"
                                            value={votes ? votes.toLocaleString() : "—"}
                                        />
                                        <Metric
                                            label="Vote Share"
                                            value={
                                                voteShare
                                                    ? `${voteShare.toFixed(1)}%`
                                                    : "—"
                                            }
                                        />
                                        <Metric
                                            label="Majority"
                                            value={margin ? `+${margin.toLocaleString()}` : "—"}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ADDITIONAL METRICS */}
                            <div className="grid grid-cols-2 gap-4">
                                <MetricCard
                                    label="Turnout"
                                    value={
                                        turnout
                                            ? `${turnout.toFixed(1)}%`
                                            : "—"
                                    }
                                />
                                <MetricCard
                                    label="Candidates"
                                    value={
                                        candidates
                                            ? candidates.toLocaleString()
                                            : "—"
                                    }
                                />
                            </div>

                            {/* TABS & HISTORY */}
                            <section className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="flex border-b border-slate-100/80 overflow-x-auto scrollbar-none">
                                    {[
                                        "Overview",
                                        "Results",
                                        "Candidates",
                                        "History",
                                        "Analytics",
                                        "Map",
                                    ].map((label, index) => (
                                        <button
                                            key={label}
                                            className={`flex items-center gap-1.5 px-4 py-3 text-[10px] font-bold whitespace-nowrap transition ${
                                                index === 3 
                                                    ? "text-[#134074] border-b-2 border-[#134074] bg-white/90 shadow-sm" 
                                                    : "text-slate-500 hover:text-[#134074] hover:bg-white/50"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Electoral History
                                    </h3>

                                    {history.length > 0 ? (
                                        <div className="mt-4 space-y-2">
                                            {history.map((result, index) => (
                                                <HistoryRow
                                                    key={
                                                        result.election_id ??
                                                        result.id ??
                                                        result.year ??
                                                        index
                                                    }
                                                    result={result}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <p className="mt-2 text-xs text-slate-500">
                                                Historical results unavailable.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* MAP ACTION (BLUE BACKGROUND WITH YELLOW ACCENTS) */}
                            <Link
                                to={`/map?code=${code}`}
                                onClick={() => onViewMap?.(data)}
                                className="group relative block p-4 rounded-2xl border border-amber-400/40 bg-[#134074] shadow-xl shadow-blue-950/20 hover:bg-[#0f345f] hover:border-amber-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Top hover accent bar (Yellow) */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 transition-colors" />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-amber-400/20 backdrop-blur-md border border-amber-400/40 shadow-xs text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:scale-110 transition-all duration-300">
                                            <Map size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                                                View on Electoral Map
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                    Interactive
                                                </span>
                                            </h4>
                                            <p className="text-xs text-blue-200 mt-0.5 font-medium leading-relaxed">
                                                Explore {name} ({code}) geography
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-amber-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// METRIC
// ============================================================
function Metric({ label, value }) {
    return (
        <div>
            <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[9px] uppercase tracking-wider font-bold">
                    {label}
                </span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-900 truncate">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================
function MetricCard({ label, value }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[10px] uppercase tracking-wider font-bold">
                    {label}
                </span>
            </div>
            <p className="mt-2 text-lg font-black text-slate-900">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// HISTORY ROW
// ============================================================
function HistoryRow({ result }) {
    const year =
        result.year ??
        result.election_year ??
        result.election_name ??
        "—";

    const winner =
        result.winner_party ??
        result.winning_party ??
        result.party ??
        result.winner ??
        "—";

    const votes = Number(
        result.votes ??
        result.winner_votes ??
        result.total_votes ??
        0
    );

    const margin = Number(
        result.margin ??
        result.majority ??
        result.majority_margin ??
        0
    );

    return (
        <div className="grid grid-cols-4 items-center px-3 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700">
                {year}
            </span>
            <span className="text-xs font-semibold text-slate-600 truncate pr-2">
                {winner}
            </span>
            <span className="font-mono text-xs text-slate-600">
                {votes ? votes.toLocaleString() : "—"}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 text-right">
                {margin ? `+${margin.toLocaleString()}` : "—"}
            </span>
        </div>
    );
}
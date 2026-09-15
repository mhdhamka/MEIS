import {
    Trophy,
    Percent,
    Users,
    Target,
    MapPin,
    ArrowUpRight,
} from "lucide-react";

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

export default function PartyPerformance({ party = {} }) {
    const seats = Number(
        party.seats_won ??
        party.seats ??
        party.seat_count ??
        0
    );

    const candidates = Number(
        party.candidates ??
        party.candidate_count ??
        party.total_candidates ??
        0
    );

    const wins = Number(
        party.wins ??
        party.seats_won ??
        0
    );

    const winRate =
        party.win_rate !== undefined
            ? Number(party.win_rate)
            : candidates > 0
                ? (wins / candidates) * 100
                : 0;

    const voteShare =
        party.vote_share !== undefined && party.vote_share !== null
            ? Number(party.vote_share)
            : null;

    const geographicCount = Number(
        party.states_contested ??
        party.geographic_distribution ??
        party.state_count ??
        party.regionsCount ??
        0
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        Party Performance
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                        Historical electoral metrics and constituency footprint overview.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Seat History / Seats Won */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Seat History
                            </span>
                            <Trophy size={16} className="text-amber-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(seats)}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Total constituencies won
                    </p>
                </div>

                {/* 2. Vote Share */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Vote Share
                            </span>
                            <Percent size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {voteShare !== null ? `${voteShare.toFixed(1)}%` : "—"}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Aggregate popular vote percentage
                    </p>
                </div>

                {/* 3. Candidate Count */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Candidate Count
                            </span>
                            <Users size={16} className="text-indigo-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(candidates)}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Total nominated representatives
                    </p>
                </div>

                {/* 4. Win Rate */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Win Rate
                            </span>
                            <Target size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {winRate.toFixed(1)}%
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Success ratio per contest
                    </p>
                </div>

                {/* 5. Geographic Distribution */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Geographic Spread
                            </span>
                            <MapPin size={16} className="text-rose-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(geographicCount)} <span className="text-sm font-bold text-slate-400">States</span>
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Regional electoral footprint
                    </p>
                </div>
            </div>
        </div>
    );
}
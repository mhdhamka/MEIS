import { Link } from "react-router-dom";
import {
    ShieldCheck,
    Trophy,
    ArrowUpRight,
} from "lucide-react";

export default function PartyCard({ party }) {
    const partyId =
        party.party_id ??
        party.id ??
        party.party_code ??
        party.code;

    // Safely generate a short acronym or code if party_code is missing in database
    const rawPartyCode =
        party.party_code ??
        party.code ??
        party.abbreviation ??
        party.short_name;

    const partyName =
        party.party_name ??
        party.name ??
        party.full_name ??
        "Unknown Party";

    // Fallback logic: If no code exists, create a smart short badge from the party name
    const partyCode = rawPartyCode || (
        partyName.length <= 5 
            ? partyName 
            : partyName.split(" ").map(word => word[0]).join("").slice(0, 4).toUpperCase()
    );

    // Safely parse metrics with 0 defaults so UI doesn't crash or break layout
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

    return (
        <Link
            to={`/parties/${encodeURIComponent(partyId)}`}
            className="group block overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
        >
            {/* Party Header / Visual Avatar Area */}
            <div className="relative flex min-h-[180px] items-center justify-center bg-gradient-to-b from-slate-100/50 to-slate-50">
                <div 
                    className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/80 bg-white text-xl font-black text-slate-700 shadow-sm tracking-wider text-center px-2 overflow-hidden"
                    title={partyName}
                >
                    <span className="truncate">{partyCode}</span>
                </div>

                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200/60 backdrop-blur-sm">
                    <ShieldCheck size={12} className="text-slate-500" />
                    Political Party
                </div>
            </div>

            {/* Body Content */}
            <div className="p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-[#134074] transition" title={partyName}>
                        {partyName}
                    </h3>

                    <ArrowUpRight
                        size={16}
                        className="shrink-0 text-slate-400 transition group-hover:text-[#134074] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </div>

                <p className="text-sm font-extrabold text-[#134074]">
                    {rawPartyCode || partyCode}
                </p>

                {/* Metrics Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 bg-slate-50/50 -mx-5 -mb-5 p-5">
                    <Metric
                        label="Seats Won"
                        value={seats.toLocaleString()}
                    />

                    <Metric
                        label="Candidates"
                        value={candidates.toLocaleString()}
                    />

                    <Metric
                        label="Win Rate"
                        value={`${winRate.toFixed(1)}%`}
                    />

                    <Metric
                        label="Vote Share"
                        value={
                            voteShare !== null
                                ? `${voteShare.toFixed(1)}%`
                                : "—"
                        }
                    />
                </div>
            </div>
        </Link>
    );
}

function Metric({ label, value }) {
    return (
        <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-slate-900">
                {value}
            </p>
        </div>
    );
}
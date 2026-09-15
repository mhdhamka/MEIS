import { Link } from "react-router-dom";
import {
    MapPin,
    Trophy,
    ArrowUpRight,
} from "lucide-react";

function getInitials(name) {
    if (!name) {
        return "?";
    }

    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 1) {
        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

export default function CandidateCard({
    candidate,
}) {
    const latest = candidate.latestResult || {};

    const candidateId =
        candidate.candidate_id ||
        candidate.candidateId ||
        candidate.candidate_uid ||
        candidate.id ||
        candidate.name;

    return (
        <Link
            to={`/candidates/${encodeURIComponent(
                candidateId
            )}`}
            className="group block overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
        >
            {/* Candidate header */}
            <div className="relative flex min-h-[180px] items-center justify-center bg-gradient-to-b from-slate-100/50 to-slate-50">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/80 bg-white text-2xl font-black text-slate-700 shadow-sm">
                    {getInitials(candidate.name)}
                </div>

                {candidate.isWinner ||
                candidate.wins > 0 ? (
                    <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-500/20 backdrop-blur-sm">
                        <Trophy size={12} />
                        Winner
                    </div>
                ) : null}
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-[#134074] transition">
                        {candidate.name}
                    </h3>

                    <ArrowUpRight
                        size={16}
                        className="shrink-0 text-slate-400 transition group-hover:text-[#134074] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </div>

                <p className="text-sm font-extrabold text-[#134074]">
                    {candidate.party}
                </p>

                <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin
                            size={14}
                            className="text-blue-500 shrink-0"
                        />

                        <span className="truncate">
                            <strong className="text-slate-900">
                                {candidate.seatCode}
                            </strong>

                            {candidate.seatName &&
                            candidate.seatName !==
                                "Unknown Constituency"
                                ? ` ${candidate.seatName}`
                                : ""}
                        </span>
                    </div>

                    <div className="text-xs text-slate-400 font-semibold pl-5">
                        {candidate.state}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 bg-slate-50/50 -mx-5 -mb-5 p-5">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Latest Votes
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            {formatNumber(
                                latest.votes ??
                                candidate.votes
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Record
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            {candidate.wins ?? 0}W /{" "}
                            {candidate.losses ?? 0}L
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
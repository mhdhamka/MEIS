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
    const latest =
        candidate.latestResult || {};

    const candidateId =
        candidate.candidateId;

    return (
        <Link
            to={`/candidates/${encodeURIComponent(
                candidateId
            )}`}
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
        >
            {/* Candidate header */}
            <div className="relative flex min-h-[180px] items-center justify-center bg-slate-50">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-2xl font-black text-slate-600 shadow-sm">
                    {getInitials(
                        candidate.name
                    )}
                </div>

                {candidate.isWinner ||
                candidate.wins > 0 ? (
                    <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <Trophy size={12} />
                        Winner
                    </div>
                ) : null}
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                        {candidate.name}
                    </h3>

                    <ArrowUpRight
                        size={16}
                        className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
                    />
                </div>

                <p className="text-sm font-semibold text-blue-700">
                    {candidate.party}
                </p>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin
                            size={14}
                            className="text-slate-400"
                        />

                        <span>
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

                    <div className="text-xs text-slate-500">
                        {candidate.state}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Latest Votes
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                            {formatNumber(
                                latest.votes ??
                                candidate.votes
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Record
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                            {candidate.wins}W /{" "}
                            {candidate.losses}L
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
import { Link } from "react-router-dom";

export default function PartyCard({ party }) {
    const partyId =
        party.party_id ??
        party.id ??
        party.party_code ??
        party.code;

    const partyCode =
        party.party_code ??
        party.code ??
        party.abbreviation ??
        party.short_name ??
        "N/A";

    const partyName =
        party.party_name ??
        party.name ??
        party.full_name ??
        partyCode;

    const seats =
        Number(
            party.seats_won ??
            party.seats ??
            party.seat_count ??
            0
        );

    const candidates =
        Number(
            party.candidates ??
            party.candidate_count ??
            party.total_candidates ??
            0
        );

    const wins =
        Number(
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
        party.vote_share !== undefined
            ? Number(party.vote_share)
            : null;

    return (
        <Link
            to={`/parties/${encodeURIComponent(partyId)}`}
            className="
                group block
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-lg
                hover:border-slate-300
            "
        >
            <div className="flex items-start justify-between gap-4">

                <div
                    className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-xl
                        bg-slate-900
                        text-lg
                        font-bold
                        text-white
                    "
                >
                    {partyCode}
                </div>

                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-2.5 py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-600
                    "
                >
                    Political Party
                </span>

            </div>

            <div className="mt-5">

                <h3 className="text-lg font-bold text-slate-900">
                    {partyName}
                </h3>

                {partyCode !== partyName && (
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                        {partyCode}
                    </p>
                )}

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

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

            <div
                className="
                    mt-5
                    flex items-center justify-between
                    border-t border-slate-100
                    pt-4
                    text-xs font-bold
                    text-[#134074]
                "
            >
                <span>View Party Profile</span>

                <span
                    className="
                        transition-transform
                        group-hover:translate-x-1
                    "
                >
                    →
                </span>
            </div>

        </Link>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
                {value}
            </p>

        </div>
    );
}
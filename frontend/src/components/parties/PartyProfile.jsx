import { Link } from "react-router-dom";
import PartyPerformance from "./PartyPerformance";

export default function PartyProfile({ party }) {
    if (!party) {
        return null;
    }

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

    // Smart fallback: Generate a short code badge from the full name if code is missing
    const partyCode = rawPartyCode || (
        partyName.length <= 5 
            ? partyName 
            : partyName.split(" ").map(word => word[0]).join("").slice(0, 4).toUpperCase()
    );

    const seatsWon = Number(
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

    const seatsContested = Number(
        party.seats_contested ??
        party.contested_seats ??
        0
    );

    const wins = Number(
        party.wins ??
        party.seats_won ??
        0
    );

    const losses = Number(
        party.losses ??
        Math.max(candidates - wins, seatsContested - seatsWon, 0)
    );

    const winRate =
        party.win_rate !== undefined
            ? Number(party.win_rate)
            : candidates > 0
                ? (wins / candidates) * 100
                : seatsContested > 0
                    ? (seatsWon / seatsContested) * 100
                    : 0;

    const voteShare =
        party.vote_share !== undefined && party.vote_share !== null
            ? Number(party.vote_share)
            : null;

    const history =
        Array.isArray(party.history)
            ? party.history
            : [];

    return (
        <div className="space-y-6">

            {/* Party Identity */}
            <section className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
            ">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div 
                            className="
                                flex h-20 w-20
                                shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-slate-900
                                text-xl
                                font-black
                                text-white
                                tracking-wider
                                overflow-hidden
                                text-center
                                px-1
                            "
                            title={partyName}
                        >
                            <span className="truncate">{partyCode}</span>
                        </div>

                        <div>
                            <p className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-widest
                                text-slate-400
                            ">
                                Political Party
                            </p>

                            <h1 className="
                                mt-1
                                text-2xl
                                font-black
                                text-slate-900
                            ">
                                {partyName}
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                {rawPartyCode || partyCode}
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* KPIs via PartyPerformance component */}
            <PartyPerformance party={party} />


            {/* Party Performance Table */}
            <section className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
            ">
                <SectionHeader
                    title="Party Performance History"
                    description="Electoral performance across general elections."
                />

                {history.length > 0 ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Election
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Seats
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Vote Share
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => {
                                    const election =
                                        item.election ??
                                        item.election_name ??
                                        item.year ??
                                        "Unknown";

                                    const seats =
                                        Number(
                                            item.seats_won ??
                                            item.seats ??
                                            0
                                        );

                                    const share =
                                        item.vote_share !== undefined && item.vote_share !== null
                                            ? Number(item.vote_share)
                                            : null;

                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <td className="px-4 py-4 text-sm font-bold text-slate-900">
                                                {election}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-slate-700">
                                                {seats}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                                                {share !== null
                                                    ? `${share.toFixed(1)}%`
                                                    : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptySection
                        message="Historical party performance is not available from the current API."
                    />
                )}
            </section>


            {/* Candidate Breakdown & Extended Stats */}
            <section className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
            ">
                <SectionHeader
                    title="Candidate Performance & Metrics"
                    description="Candidate participation, outcome metrics, and vote proportions."
                />

                <div className="
                    mt-6
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                ">
                    <MiniStat
                        label="Candidates"
                        value={candidates > 0 ? candidates : seatsContested}
                    />

                    <MiniStat
                        label="Wins (Seats Won)"
                        value={wins}
                    />

                    <MiniStat
                        label="Losses"
                        value={losses}
                    />

                    <MiniStat
                        label="Win Rate"
                        value={`${winRate.toFixed(1)}%`}
                    />
                </div>
            </section>


            {/* Geography */}
            <section className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
            ">
                <SectionHeader
                    title="Party Geography"
                    description="Explore constituencies associated with this party."
                />

                <div className="
                    mt-5
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    p-5
                ">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                {partyCode} Electoral Footprint
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                View this party's constituencies and
                                electoral strength on the map.
                            </p>
                        </div>

                        <Link
                            to={`/map?party=${encodeURIComponent(rawPartyCode || partyCode)}`}
                            className="
                                rounded-xl
                                border border-slate-300
                                bg-white
                                px-4 py-2.5
                                text-xs
                                font-bold
                                text-slate-700
                                hover:bg-slate-50
                            "
                        >
                            Open Map
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="
            rounded-xl
            bg-slate-50
            p-4
        ">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-xl font-black text-slate-900">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>
        </div>
    );
}

function SectionHeader({ title, description }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-slate-900">
                {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
}

function EmptySection({ message }) {
    return (
        <div className="
            mt-5
            rounded-xl
            border border-dashed
            border-slate-200
            p-8
            text-center
        ">
            <p className="text-sm text-slate-500">
                {message}
            </p>
        </div>
    );
}
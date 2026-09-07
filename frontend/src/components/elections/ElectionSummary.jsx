import {
    Building2,
    Users,
    Vote,
    Percent,
    Trophy
} from "lucide-react";


function formatNumber(value) {
    return Number(
        value ?? 0
    ).toLocaleString();
}


function MetricCard({
    icon: Icon,
    label,
    value,
    subtitle
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {label}
                </span>

                <Icon
                    size={17}
                    className="text-[#134074]"
                />

            </div>


            <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {value}
            </p>


            {subtitle && (
                <p className="text-xs text-slate-400 mt-1">
                    {subtitle}
                </p>
            )}

        </div>
    );
}


export default function ElectionSummary({
    election,
    summary
}) {
    if (!election) {
        return null;
    }


    return (
        <section>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">

                <div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#134074]">
                        Selected Election
                    </span>

                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {
                            election.election_name
                        }
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {
                            election.election_type
                        }{" "}
                        ·{" "}
                        {
                            election.election_year
                        }
                    </p>

                </div>


                {summary.dominantParty && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">

                        <Trophy
                            size={16}
                            className="text-amber-600"
                        />

                        <div>

                            <p className="text-[10px] uppercase font-bold text-amber-700">
                                Most Seats
                            </p>

                            <p className="text-sm font-bold text-slate-900">
                                {
                                    summary.dominantParty
                                }{" "}
                                ·{" "}
                                {
                                    summary.dominantPartySeats
                                }
                            </p>

                        </div>

                    </div>
                )}

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <MetricCard
                    icon={Building2}
                    label="Seats Contested"
                    value={
                        formatNumber(
                            summary.seats
                        )
                    }
                    subtitle="Unique constituencies"
                />

                <MetricCard
                    icon={Users}
                    label="Candidates"
                    value={
                        formatNumber(
                            summary.candidates
                        )
                    }
                    subtitle="Recorded contestants"
                />

                <MetricCard
                    icon={Vote}
                    label="Total Votes"
                    value={
                        formatNumber(
                            summary.totalVotes
                        )
                    }
                    subtitle="Votes recorded"
                />

                <MetricCard
                    icon={Percent}
                    label="Turnout"
                    value={
                        summary.turnout !==
                        null
                            ? `${Number(
                                  summary.turnout
                              ).toFixed(
                                  2
                              )}%`
                            : "N/A"
                    }
                    subtitle="Dataset dependent"
                />

            </div>

        </section>
    );
}
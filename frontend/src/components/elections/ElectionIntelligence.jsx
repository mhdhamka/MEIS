import {
    TrendingUp,
    TrendingDown,
    MapPin,
    Vote
} from "lucide-react";


export default function ElectionIntelligence({
    seatCounts,
    statePerformance
}) {
    const topParty =
        seatCounts[0] ?? null;


    const topState =
        [...statePerformance]
            .sort(
                (a, b) =>
                    Number(
                        b.total_votes ??
                        0
                    ) -
                    Number(
                        a.total_votes ??
                        0
                    )
            )[0] ?? null;


    return (
        <section className="bg-[#0b2545] text-white rounded-xl p-6">

            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ffb703]">
                Election Intelligence
            </p>


            <h3 className="text-lg font-bold mt-1">
                Snapshot
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">

                    <TrendingUp
                        size={17}
                        className="text-[#ffb703]"
                    />

                    <p className="text-[10px] uppercase tracking-wider text-slate-300 mt-3">
                        Leading Party
                    </p>

                    <p className="text-lg font-bold mt-1">
                        {
                            topParty?.party_name ??
                            "N/A"
                        }
                    </p>

                    <p className="text-xs text-slate-300">
                        {
                            topParty?.seats_won ??
                            0
                        }{" "}
                        seats
                    </p>

                </div>


                <div className="bg-white/5 border border-white/10 rounded-lg p-4">

                    <MapPin
                        size={17}
                        className="text-[#ffb703]"
                    />

                    <p className="text-[10px] uppercase tracking-wider text-slate-300 mt-3">
                        Highest Vote State
                    </p>

                    <p className="text-lg font-bold mt-1">
                        {
                            topState?.state_name ??
                            "N/A"
                        }
                    </p>

                    <p className="text-xs text-slate-300">
                        {Number(
                            topState?.total_votes ??
                            0
                        ).toLocaleString()}{" "}
                        votes
                    </p>

                </div>

            </div>

        </section>
    );
}
export default function ElectionTimeline({
    elections,
    selectedElectionId,
    onSelect
}) {
    const sorted =
        [...elections].sort(
            (a, b) =>
                Number(
                    a.election_year
                ) -
                Number(
                    b.election_year
                )
        );


    if (!sorted.length) {
        return null;
    }


    return (
        <section className="bg-white/75 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-2xl p-6 transition-all duration-300">

            <div className="mb-6">

                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#134074]">
                    Historical Electoral Timeline
                </p>

                <h2 className="text-lg font-black text-slate-900 mt-0.5 tracking-tight">
                    Malaysian Elections
                </h2>

            </div>


            <div className="overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-200">

                <div className="flex items-center min-w-max px-3 py-2">

                    {sorted.map(
                        (
                            election,
                            index
                        ) => {

                            const active =
                                Number(
                                    selectedElectionId
                                ) ===
                                Number(
                                    election.election_id
                                );

                            return (
                                <div
                                    key={
                                        election.election_id
                                    }
                                    className="flex items-center"
                                >

                                    <button
                                        onClick={() =>
                                            onSelect(
                                                election.election_id
                                            )
                                        }
                                        className="group flex flex-col items-center focus:outline-none"
                                    >

                                        <span
                                            className={`
                                                text-xs font-black mb-3 transition-colors duration-200
                                                ${
                                                    active
                                                        ? "text-[#134074]"
                                                        : "text-slate-400 group-hover:text-slate-700"
                                                }
                                            `}
                                        >
                                            {
                                                election.election_year
                                            }
                                        </span>


                                        <div className="relative flex items-center justify-center">
                                            <span
                                                className={`
                                                    w-5 h-5 rounded-full border-2 transition-all duration-300 backdrop-blur-md flex items-center justify-center
                                                    ${
                                                        active
                                                            ? "bg-[#134074] border-[#134074] ring-4 ring-blue-500/20 shadow-md shadow-blue-900/20 scale-110"
                                                            : "bg-white/80 border-slate-300 group-hover:border-[#134074] group-hover:scale-110 group-hover:bg-blue-50"
                                                    }
                                                `}
                                            >
                                                {active && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                )}
                                            </span>
                                        </div>


                                        <span
                                            className={`
                                                mt-3 text-[10px] font-bold max-w-[100px] truncate px-2 py-1 rounded-lg backdrop-blur-sm transition-all duration-200
                                                ${
                                                    active
                                                        ? "text-slate-900 bg-white/90 shadow-sm border border-slate-200/60"
                                                        : "text-slate-400 group-hover:text-slate-600 bg-white/30"
                                                }
                                            `}
                                            title={election.election_name}
                                        >
                                            {
                                                election.election_name
                                            }
                                        </span>

                                    </button>


                                    {index !==
                                        sorted.length -
                                            1 && (
                                        <div className="w-12 h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mx-2 mb-6 rounded-full" />
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>

            </div>

        </section>
    );
}
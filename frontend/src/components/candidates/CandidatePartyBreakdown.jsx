export default function CandidatePartyBreakdown({
    data = [],
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Party Candidate Breakdown
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Candidate participation and
                        historical winning performance.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Party
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Candidates
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Wins
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Win Rate
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.party}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                            >
                                <td className="px-5 py-4">
                                    <span className="font-semibold text-slate-900">
                                        {item.party}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-right text-sm text-slate-700">
                                    {item.candidates.toLocaleString()}
                                </td>

                                <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                                    {item.wins.toLocaleString()}
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{
                                                    width: `${Math.min(
                                                        item.winRate,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <span className="w-14 text-right text-sm font-bold text-slate-900">
                                            {item.winRate.toFixed(
                                                1
                                            )}
                                            %
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-5 py-10 text-center text-sm text-slate-500"
                                >
                                    No party candidate data
                                    available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
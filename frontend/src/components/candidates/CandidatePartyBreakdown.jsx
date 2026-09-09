export default function CandidatePartyBreakdown({ data = [] }) {
    return (
        <section className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/40">
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        Party Candidate Breakdown
                    </h2>
                    <p className="text-xs text-slate-500">
                        Candidate participation and win performance.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#134074] border border-slate-200 text-xs font-bold shadow-sm">
                    Table
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase text-slate-400">
                            <th className="px-6 py-3 text-left">Party</th>
                            <th className="px-6 py-3 text-right">Candidates</th>
                            <th className="px-6 py-3 text-right">Wins</th>
                            <th className="px-6 py-3 text-right">Win Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item.party} className="hover:bg-white/50 transition">
                                <td className="px-6 py-4 font-bold text-slate-900">{item.party}</td>
                                <td className="px-6 py-4 text-right text-sm text-slate-700">{item.candidates.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">{item.wins.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-600 rounded-full" 
                                                style={{ width: `${Math.min(item.winRate, 100)}%` }} 
                                            />
                                        </div>
                                        <span className="w-12 text-right text-xs font-black text-slate-900">
                                            {item.winRate.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-xs text-slate-500">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
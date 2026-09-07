import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "../states/EmptyState";

export default function HistoricalTrendsTable({ trends = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevTrendsLength, setPrevTrendsLength] = useState(trends.length);
  const ITEMS_PER_PAGE = 10;

  // Safe alternative to resetting page in useEffect: adjust during render or state tracking
  if (trends.length !== prevTrendsLength) {
    setPrevTrendsLength(trends.length);
    setCurrentPage(1);
  }

  // Pagination calculation
  const totalPages = Math.ceil(trends.length / ITEMS_PER_PAGE);

  // Ensure current page doesn't exceed total pages if trends shrink
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedTrends = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return trends.slice(start, start + ITEMS_PER_PAGE);
  }, [trends, safeCurrentPage]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-[#134074] rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-blue-500/20 backdrop-blur-md mb-2 shadow-sm">
            Dataset Registry
          </span>
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            Historical Election Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Comprehensive election cycles available in the MEIS database
          </p>
        </div>

        <div className="self-start sm:self-auto text-left sm:text-right px-4 py-2.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
            Total Records
          </p>
          <p className="text-xl font-black text-[#134074]">{trends.length}</p>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm text-center">
          <EmptyState
            title="No historical records"
            message="No historical election records found in the database."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/30 backdrop-blur-xl shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 bg-white/40 backdrop-blur-md">
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    Election
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    Year
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    Seats
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-600 text-right">
                    Votes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {paginatedTrends.map((trend, index) => (
                  <tr
                    key={trend.election_id ?? index}
                    className="hover:bg-white/60 transition-all duration-200 group"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-slate-800 group-hover:text-[#134074] transition-colors">
                      {trend.election_name}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/50 text-xs font-bold text-slate-700">
                        {trend.election_year}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      {trend.seats}
                    </td>
                    <td className="px-5 py-4 text-sm font-black text-[#134074] text-right">
                      {Number(trend.votes ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1">
              <p className="text-xs font-semibold text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-800">
                  {Math.min(safeCurrentPage * ITEMS_PER_PAGE, trends.length)}
                </span>{" "}
                of <span className="font-bold text-slate-800">{trends.length}</span> entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/70 backdrop-blur-xl border border-white/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 text-xs font-black text-[#134074] shadow-sm">
                  {safeCurrentPage} / {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={safeCurrentPage === totalPages}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/70 backdrop-blur-xl border border-white/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
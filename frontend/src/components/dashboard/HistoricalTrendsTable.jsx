import { TrendingUp } from "lucide-react";
import EmptyState from "../states/EmptyState";

export default function HistoricalTrendsTable({ trends = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#134074]" />
            Historical Election Trends
          </h3>
          <p className="text-xs text-slate-500 mt-1">Election cycles available in the MEIS database</p>
        </div>
      </div>

      {trends.length === 0 ? (
        <EmptyState title="No historical records" message="No historical election records found in the database." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Election</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Year</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Seats</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Votes</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <tr key={trend.election_id ?? index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 text-sm font-semibold text-slate-800">{trend.election_name}</td>
                  <td className="px-3 py-3 text-sm text-slate-600">{trend.election_year}</td>
                  <td className="px-3 py-3 text-sm text-slate-600">{trend.seats}</td>
                  <td className="px-3 py-3 text-sm font-medium text-slate-700 text-right">
                    {Number(trend.votes ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Server, Database, ShieldCheck, RefreshCw, Calendar } from "lucide-react";

export default function TelemetryHeader({ electionsList = [], electionId, setElectionId, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latency, setLatency] = useState(42);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // If a real fetch function was passed from the parent, call it
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (error) {
        console.error("Failed to refresh telemetry:", error);
      }
    }

    // Simulate telemetry ping update & finish loading animation
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 20) + 30);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 relative overflow-hidden transition-all duration-300">
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Title Group */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link
                to="/"
                className="hover:text-[#134074]"
            >
                MEIS
            </Link>
            <span>/</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
            Dashboard
          </h1>
        </div>

        {/* Interactive Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Election Dropdown Selector */}
          <div className="flex items-center gap-2 bg-white/40 hover:bg-white/70 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-white/60 text-xs font-semibold transition-all duration-200 shadow-xs">
            <Calendar size={14} className="text-[#134074] shrink-0" />
            <select
              value={electionId}
              onChange={(e) => setElectionId(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {electionsList.length === 0 ? (
                <option value={1}>General Election (ID: 1)</option>
              ) : (
                electionsList.map((item) => (
                  <option key={item.election_id} value={item.election_id}>
                    {item.election_name} ({item.election_year})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* API Status Pill */}
          <div className="group flex items-center gap-2 bg-white/40 hover:bg-white/70 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-white/60 text-xs font-medium transition-all duration-200 shadow-xs cursor-default">
            <Server size={14} className="text-slate-400 group-hover:text-[#134074] transition-colors" />
            <span className="text-slate-600">API: <strong className="text-emerald-600 font-bold">ONLINE</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono text-[11px] font-semibold">{latency} ms</span>
          </div>

          {/* Database Status Pill */}
          <div className="group flex items-center gap-2 bg-white/40 hover:bg-white/70 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-white/60 text-xs font-medium transition-all duration-200 shadow-xs cursor-default">
            <Database size={14} className="text-slate-400 group-hover:text-[#134074] transition-colors" />
            <span className="text-slate-600">DB: <strong className="text-emerald-600 font-bold">CONNECTED</strong></span>
          </div>

          {/* Pipeline Status Pill */}
          <div className="group flex items-center gap-2 bg-white/40 hover:bg-white/70 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-white/60 text-xs font-medium transition-all duration-200 shadow-xs cursor-default">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-slate-600">Pipeline: <strong className="text-emerald-600 font-bold">READY</strong></span>
          </div>

          {/* Interactive Refresh Action Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Telemetry"
            className="flex items-center justify-center p-2.5 rounded-2xl bg-slate-900 text-white hover:bg-[#134074] transition-all duration-200 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin text-amber-400" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Server, Database, ShieldCheck, RefreshCw } from "lucide-react";

export default function TelemetryHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latency, setLatency] = useState(42);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate telemetry ping update
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 20) + 30);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-white text-slate-900 p-5 rounded-xl shadow-xs border border-slate-200/80 relative overflow-hidden">
      {/* Subtle top accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title Group */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-blue-600">
              Malaysia Electoral Intelligence System
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Dashboard
          </h1>
        </div>

        {/* Interactive Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* API Status Pill */}
          <div className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium transition-all duration-200 shadow-2xs cursor-default">
            
            <Server size={14} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-slate-600">API: <strong className="text-emerald-600 font-bold">ONLINE</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono text-[11px]">{latency} ms</span>
          </div>

          {/* Database Status Pill */}
          <div className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium transition-all duration-200 shadow-2xs cursor-default">
            <Database size={14} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-slate-600">DB: <strong className="text-emerald-600 font-bold">CONNECTED</strong></span>
          </div>

          {/* Pipeline Status Pill */}
          <div className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium transition-all duration-200 shadow-2xs cursor-default">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-slate-600">Pipeline: <strong className="text-emerald-600 font-bold">READY</strong></span>
          </div>

          {/* Interactive Refresh Action Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Telemetry"
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white hover:bg-[#134074] transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-amber-400" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
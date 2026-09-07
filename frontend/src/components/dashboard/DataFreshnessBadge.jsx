import { Clock } from "lucide-react";

export default function DataFreshnessBadge({ lastSync = "3m ago", status = "Operational", version = "GE-15 + State" }) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md text-xs font-medium text-slate-700">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">{status}</span>
      </div>

      <div className="h-3 w-px bg-slate-200" />

      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
        <Clock size={13} className="text-indigo-600" />
        <span>Sync: <strong className="text-slate-800">{lastSync}</strong></span>
      </div>

      <div className="h-3 w-px bg-slate-200" />

      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 font-bold text-[10px] border border-indigo-500/20">
        {version}
      </span>
    </div>
  );
}
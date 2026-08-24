import { Search, Bell, Activity } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur shadow-xs shrink-0">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#134074]">
          Malaysia
        </p>
        <h2 className="text-sm font-bold text-slate-800">
          Electoral Intelligence Workspace
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Search records" className="text-slate-500 transition hover:text-[#134074] p-1.5 rounded-md hover:bg-slate-100">
          <Search size={18} />
        </button>

        <button aria-label="View notifications" className="text-slate-500 transition hover:text-[#134074] p-1.5 rounded-md hover:bg-slate-100">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5">
          <Activity size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700">
            API Online
          </span>
        </div>
      </div>
    </header>
  );
}
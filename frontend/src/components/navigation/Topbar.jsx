import { Search, Bell, Activity } from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#080b10]/95 px-6 backdrop-blur">

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Malaysia
        </p>

        <h2 className="text-sm font-semibold text-white">
          Electoral Intelligence Workspace
        </h2>

      </div>

      <div className="flex items-center gap-4">

        <button className="text-gray-500 transition hover:text-white">
          <Search size={18} />
        </button>

        <button className="text-gray-500 transition hover:text-white">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5">

          <Activity size={14} className="text-green-400" />

          <span className="text-xs text-gray-400">
            API Online
          </span>

        </div>

      </div>

    </header>
  );
}
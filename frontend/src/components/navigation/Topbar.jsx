import { useEffect, useState } from "react";
import { Search, Bell, Sparkles } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

export default function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md shadow-xs shrink-0 text-slate-800">
        
        {/* Workspace Title & Context */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Sparkles size={16} className="text-[#134074]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#134074]">
                Malaysia
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                Live Feed
              </span>
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              MEIS Workspace
            </h2>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-3">
          
          {/* SEARCH TRIGGER */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search records"
            className="hidden md:flex items-center gap-3 w-72 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
          >
            <Search size={15} className="text-slate-400 group-hover:text-[#134074] transition-colors" />
            <span className="text-xs text-slate-500 group-hover:text-slate-700 flex-1 text-left font-medium">
              Search MEIS database...
            </span>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {/* MOBILE SEARCH ICON FALLBACK */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search records"
            className="md:hidden text-slate-500 transition hover:text-[#134074] p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            <Search size={18} />
          </button>

          {/* NOTIFICATION BUTTON */}
          <button
            aria-label="View notifications"
            className="relative text-slate-500 transition hover:text-[#134074] p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer group"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 shadow-xs shadow-blue-400" />
          </button>

          {/* SYSTEM API STATUS BADGE */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700 tracking-tight">
              API Online
            </span>
          </div>
          
        </div>
      </header>

      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
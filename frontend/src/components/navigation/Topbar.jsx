import { useEffect, useState } from "react";
import { Search, Bell, Activity } from "lucide-react";
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
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur shadow-xs shrink-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#134074]">
            Malaysia
          </p>
          <h2 className="text-sm font-bold text-slate-800">
            MEIS Workspace
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* SEARCH TRIGGER */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search records"
            className="hidden md:flex items-center gap-3 w-64 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-white transition cursor-pointer"
          >
            <Search size={15} className="text-slate-400" />
            <span className="text-xs text-slate-500 flex-1 text-left">
              Search MEIS
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* MOBILE SEARCH ICON FALLBACK */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search records"
            className="md:hidden text-slate-500 transition hover:text-[#134074] p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <Search size={18} />
          </button>

          <button
            aria-label="View notifications"
            className="text-slate-500 transition hover:text-[#134074] p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-2xs">
            <Activity size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">
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
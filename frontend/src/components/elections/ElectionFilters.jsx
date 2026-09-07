import {
    Search,
    RotateCcw,
} from "lucide-react";


export default function ElectionFilters({
    search,
    onSearchChange,

    type,
    onTypeChange,

    year,
    onYearChange,

    years,

    onReset
}) {
    // Check if any filter is currently active
    const hasActiveFilters = search.trim() !== "" || type !== "all" || year !== "all";

    return (
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-2xl p-4 transition-all duration-300">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_160px_auto] gap-3 items-center">

                {/* SEARCH */}

                <div className="relative group">

                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#134074] transition-colors"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search election name..."
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#134074] focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                    />

                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100/80 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                            ×
                        </button>
                    )}

                </div>


                {/* TYPE */}

                <div className="relative">
                    <select
                        value={type}
                        onChange={(event) =>
                            onTypeChange(
                                event.target.value
                            )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-sm font-medium text-slate-700 outline-none focus:border-[#134074] focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all cursor-pointer appearance-none"
                    >
                        <option value="all">
                            All Election Types
                        </option>

                        <option value="General Election">
                            General Election
                        </option>

                        <option value="State Election">
                            State Election
                        </option>

                        <option value="By-Election">
                            By-Election
                        </option>
                    </select>
                </div>


                {/* YEAR */}

                <div className="relative">
                    <select
                        value={year}
                        onChange={(event) =>
                            onYearChange(
                                event.target.value
                            )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-sm font-medium text-slate-700 outline-none focus:border-[#134074] focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all cursor-pointer appearance-none"
                    >
                        <option value="all">
                            All Years
                        </option>

                        {years.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>
                </div>


                {/* RESET */}

                <button
                    onClick={onReset}
                    disabled={!hasActiveFilters}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                        hasActiveFilters
                            ? "bg-white/90 backdrop-blur-md border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 active:scale-95"
                            : "bg-white/30 backdrop-blur-sm border-slate-200/50 text-slate-400 cursor-not-allowed opacity-60"
                    }`}
                >
                    <RotateCcw
                        size={14}
                        className={hasActiveFilters ? "text-[#134074]" : "text-slate-400"}
                    />

                    Reset Filters
                </button>

            </div>

        </div>
    );
}
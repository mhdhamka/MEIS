import {
    Layers,
    Search,
    SlidersHorizontal
} from "lucide-react";

export default function MapToolBar({
    onLayerChange,
    activeLayer,
    searchQuery,
    onSearchChange
}) {
    return (
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-3 w-80">

            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg">

                <div className="relative flex items-center">

                    <Search
                        size={16}
                        className="absolute left-3 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchQuery ?? ""}
                        onChange={(event) =>
                            onSearchChange?.(
                                event.target.value
                            )
                        }
                        placeholder="Search constituency or district..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#134074] transition"
                    />

                </div>

            </div>


            {/* =====================================================
                LAYERS
            ===================================================== */}

            <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg space-y-2">

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b2545] flex items-center gap-1.5">

                        <Layers
                            size={14}
                            className="text-[#134074]"
                        />

                        Map Intelligence Layers

                    </span>

                    <SlidersHorizontal
                        size={14}
                        className="text-slate-400"
                    />

                </div>


                <div className="space-y-1">

                    {/* BOUNDARIES */}

                    <button
                        onClick={() =>
                            onLayerChange("boundaries")
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                            activeLayer === "boundaries"
                                ? "bg-[#0b2545] text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Constituency Boundaries
                    </button>


                    {/* CHOROPLETH */}

                    <button
                        onClick={() =>
                            onLayerChange("choropleth")
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                            activeLayer === "choropleth"
                                ? "bg-[#0b2545] text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Party Dominance Choropleth
                    </button>


                    {/* TURNOUT */}

                    <button
                        onClick={() =>
                            onLayerChange("turnout")
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                            activeLayer === "turnout"
                                ? "bg-[#0b2545] text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Voter Density Heatmap
                    </button>

                </div>

            </div>

        </div>
    );
}
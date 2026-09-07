import {
    TrendingUp,
    Award
} from "lucide-react";
import { useState } from "react";

export default function ElectionResults({
    seatCounts,
    partyPerformance
}) {
    const [hoveredParty, setHoveredParty] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);

    const performanceLookup = new Map();

    partyPerformance.forEach(
        (party) => {
            performanceLookup.set(
                party.party_name,
                party
            );
        }
    );

    if (!seatCounts.length) {
        return (
            <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-2xl p-6">
                <p className="text-sm text-slate-500 font-medium">
                    No party result data available.
                </p>
            </section>
        );
    }

    const maxSeats =
        Math.max(
            ...seatCounts.map(
                (party) =>
                    Number(
                        party.seats_won ?? 0
                    )
            ),
            1
        );

    return (
        <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-2xl p-6 transition-all duration-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100/80">
                <div>
                    <p className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-[#134074]">
                        Result Breakdown
                    </p>
                    <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                        Party Performance
                    </h3>
                </div>

                <div className="text-right hidden sm:block">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200/60 shadow-sm">
                        {seatCounts.length} Parties Contested
                    </span>
                </div>
            </div>

            {/* Interactive Party List */}
            <div className="space-y-3.5">
                {seatCounts.map(
                    (party, index) => {
                        const seats =
                            Number(
                                party.seats_won ?? 0
                            );

                        const performance =
                            performanceLookup.get(
                                party.party_name
                            );

                        const voteShare =
                            Number(
                                performance?.vote_share ?? 0
                            );

                        const width =
                            (
                                seats /
                                maxSeats
                            ) *
                            100;

                        const isSelected = selectedParty === party.party_name;
                        const isHovered = hoveredParty === party.party_name;

                        return (
                            <div
                                key={
                                    party.party_id ??
                                    party.party_name ??
                                    index
                                }
                                onMouseEnter={() => setHoveredParty(party.party_name)}
                                onMouseLeave={() => setHoveredParty(null)}
                                onClick={() => setSelectedParty(isSelected ? null : party.party_name)}
                                className={`p-4 rounded-xl transition-all duration-300 cursor-pointer border backdrop-blur-md ${
                                    isSelected
                                        ? "bg-blue-50/80 border-blue-300 shadow-md shadow-blue-900/5 ring-2 ring-blue-500/20"
                                        : isHovered
                                        ? "bg-white/90 border-slate-300 shadow-md shadow-slate-200/50 -translate-y-0.5"
                                        : "bg-white/50 border-white/80 shadow-sm hover:bg-white/70"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                                            isSelected || isHovered
                                                ? "bg-[#134074] text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700"
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                {party.party_name}
                                                {index === 0 && (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-700 rounded text-[9px] font-extrabold uppercase tracking-wider border border-amber-500/20">
                                                        <Award size={10} />
                                                        Leader
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                                <TrendingUp size={11} className="text-blue-600" />
                                                {voteShare.toFixed(2)}% vote share
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-base font-black text-[#134074]">
                                            {seats}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 ml-1">
                                            seats
                                        </span>
                                    </div>
                                </div>

                                {/* Animated Progress Bar with Glass Highlight */}
                                <div className="w-full h-2.5 bg-slate-100/80 backdrop-blur-sm rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-700 via-[#134074] to-blue-500 ${
                                            isHovered || isSelected ? "shadow-sm shadow-blue-500/50" : ""
                                        }`}
                                        style={{
                                            width: `${width}%`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            {/* Interactive Footer Helper text */}
            <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                <span>Tip: Click or hover cards to inspect party data.</span>
                {selectedParty && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedParty(null); }}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Clear selection
                    </button>
                )}
            </div>

        </section>
    );
}
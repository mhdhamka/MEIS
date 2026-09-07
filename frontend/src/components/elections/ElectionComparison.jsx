import {
    useMemo,
    useState
} from "react";

import {
    TrendingUp,
    TrendingDown,
    Minus,
    Loader2,
    Search
} from "lucide-react";

import {
    getElectionSeatCounts
} from "../../services/api";


export default function ElectionComparison({
    elections,
    selectedElectionId
}) {
    const [
        electionA,
        setElectionA
    ] = useState("");

    const [
        electionB,
        setElectionB
    ] = useState(() => (
        selectedElectionId
            ? String(selectedElectionId)
            : ""
    ));

    const [
        comparisonData,
        setComparisonData
    ] = useState([]);

    const [loading, setLoading] =
        useState(false);

    // New interactive states
    const [filterQuery, setFilterQuery] = useState("");
    const [sortMode, setSortMode] = useState("absolute"); // 'absolute' | 'gain' | 'loss' | 'name'
    const [hoveredRow, setHoveredRow] = useState(null);


    async function compare() {
        if (
            !electionA ||
            !electionB
        ) {
            return;
        }

        try {
            setLoading(true);

            const [
                responseA,
                responseB
            ] =
                await Promise.all([
                    getElectionSeatCounts(
                        electionA
                    ),

                    getElectionSeatCounts(
                        electionB
                    )
                ]);


            const mapA =
                new Map();

            const mapB =
                new Map();


            responseA.forEach(
                (party) => {
                    mapA.set(
                        party.party_name,
                        Number(
                            party.seats_won ??
                            0
                        )
                    );
                }
            );


            responseB.forEach(
                (party) => {
                    mapB.set(
                        party.party_name,
                        Number(
                            party.seats_won ??
                            0
                        )
                    );
                }
            );


            const parties =
                new Set([
                    ...mapA.keys(),
                    ...mapB.keys()
                ]);


            const rows =
                [...parties]
                    .map(
                        (
                            party
                        ) => {

                            const a =
                                mapA.get(
                                    party
                                ) ?? 0;

                            const b =
                                mapB.get(
                                    party
                                ) ?? 0;

                            return {
                                party,
                                electionA:
                                    a,
                                electionB:
                                    b,
                                change:
                                    b - a
                            };
                        }
                    );


            setComparisonData(
                rows
            );

        } catch (error) {

            console.error(
                "Comparison error:",
                error
            );

        } finally {
            setLoading(false);
        }
    }


    // Filtered & Sorted comparison list
    const processedComparisonData = useMemo(() => {
        let list = [...comparisonData];

        if (filterQuery.trim()) {
            const q = filterQuery.toLowerCase();
            list = list.filter(item => item.party.toLowerCase().includes(q));
        }

        return list.sort((a, b) => {
            if (sortMode === "absolute") {
                return Math.abs(b.change) - Math.abs(a.change);
            }
            if (sortMode === "gain") {
                return b.change - a.change;
            }
            if (sortMode === "loss") {
                return a.change - b.change;
            }
            if (sortMode === "name") {
                return a.party.localeCompare(b.party);
            }
            return 0;
        });
    }, [comparisonData, filterQuery, sortMode]);


    const electionAName =
        useMemo(
            () =>
                elections.find(
                    (item) =>
                        String(
                            item.election_id
                        ) ===
                        String(
                            electionA
                        )
                )
                    ?.election_name ??
                "Election A",
            [
                elections,
                electionA
            ]
        );


    const electionBName =
        useMemo(
            () =>
                elections.find(
                    (item) =>
                        String(
                            item.election_id
                        ) ===
                        String(
                            electionB
                        )
                )
                    ?.election_name ??
                "Election B",
            [
                elections,
                electionB
            ]
        );


    return (
        <section className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 rounded-2xl p-6 transition-all duration-300">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100/80">

                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                            Comparative Intelligence
                        </p>

                        <h3 className="text-lg font-black text-slate-900 mt-0.5">
                            Election Comparison
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/60 shadow-sm flex items-center gap-1">
                        Head-to-Head Analytics
                    </span>
                </div>

            </div>


            {/* Controls Bar (Glassmorphic Selectors & Trigger) */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm">

                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 ml-1">Baseline Election</label>
                    <select
                        value={electionA}
                        onChange={(event) =>
                            setElectionA(
                                event.target.value
                            )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    >
                        <option value="">
                            Select baseline election...
                        </option>

                        {elections.map(
                            (election) => (
                                <option
                                    key={
                                        election.election_id
                                    }
                                    value={
                                        election.election_id
                                    }
                                >
                                    {
                                        election.election_name
                                    }{" "}
                                    (
                                    {
                                        election.election_year
                                    }
                                    )
                                </option>
                            )
                        )}
                    </select>
                </div>


                <div className="flex items-center justify-center pt-5">
                    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-xs font-black text-[#134074]">
                        VS
                    </div>
                </div>


                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 ml-1">Target Election</label>
                    <select
                        value={electionB}
                        onChange={(event) =>
                            setElectionB(
                                event.target.value
                            )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    >
                        <option value="">
                            Select target election...
                        </option>

                        {elections.map(
                            (election) => (
                                <option
                                    key={
                                        election.election_id
                                    }
                                    value={
                                        election.election_id
                                    }
                                >
                                    {
                                        election.election_name
                                    }{" "}
                                    (
                                    {
                                        election.election_year
                                    }
                                    )
                                </option>
                            )
                        )}
                    </select>
                </div>


                <div className="pt-5">
                    <button
                        onClick={compare}
                        disabled={
                            !electionA ||
                            !electionB ||
                            loading
                        }
                        className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#134074] hover:bg-blue-900 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {loading
                            ? "Analyzing..."
                            : "Compare Cycles"}
                    </button>
                </div>

            </div>


            {/* Results Section */}
            {comparisonData.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in duration-500">

                    {/* Secondary interactive toolbar (Filter & Sorting Pills) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60">
                        
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter party name..."
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200/70 bg-white/70 backdrop-blur-sm text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Sort:</span>
                            {[
                                { id: "absolute", label: "Volatility" },
                                { id: "gain", label: "Top Gains" },
                                { id: "loss", label: "Top Losses" },
                                { id: "name", label: "Name" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSortMode(tab.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                                        sortMode === tab.id
                                            ? "bg-[#134074] text-white shadow-blue-900/10"
                                            : "bg-white/70 hover:bg-white border border-slate-200/60 text-slate-600"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                    </div>


                    {/* Table View with Glass Styling */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-md shadow-sm">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b border-slate-200/80 bg-white/40 text-left">

                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                                        Party
                                    </th>

                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 text-center">
                                        {
                                            electionAName
                                        }
                                    </th>

                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 text-center">
                                        {
                                            electionBName
                                        }
                                    </th>

                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 text-right">
                                        Net Change
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100/80">

                                {processedComparisonData.map(
                                    (
                                        row,
                                        index
                                    ) => {

                                        const positive =
                                            row.change >
                                            0;

                                        const negative =
                                            row.change <
                                            0;

                                        const isHovered = hoveredRow === index;


                                        return (
                                            <tr
                                                key={
                                                    row.party
                                                }
                                                onMouseEnter={() => setHoveredRow(index)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                className={`transition-colors duration-200 ${
                                                    isHovered ? "bg-blue-50/50 backdrop-blur-sm" : "hover:bg-white/30"
                                                }`}
                                            >

                                                <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${positive ? "bg-emerald-500" : negative ? "bg-red-500" : "bg-slate-300"}`} />
                                                    {
                                                        row.party
                                                    }
                                                </td>

                                                <td className="py-3.5 px-4 text-center font-semibold text-slate-600">
                                                    {
                                                        row.electionA
                                                    }
                                                </td>

                                                <td className="py-3.5 px-4 text-center font-semibold text-slate-900">
                                                    {
                                                        row.electionB
                                                    }
                                                </td>

                                                <td
                                                    className={`
                                                        py-3.5 px-4 text-right font-black
                                                        ${
                                                            positive
                                                                ? "text-emerald-600"
                                                                : negative
                                                                ? "text-red-600"
                                                                : "text-slate-500"
                                                        }
                                                    `}
                                                >

                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm">

                                                        {positive && (
                                                            <TrendingUp
                                                                size={13}
                                                            />
                                                        )}

                                                        {negative && (
                                                            <TrendingDown
                                                                size={13}
                                                            />
                                                        )}

                                                        {!positive &&
                                                            !negative && (
                                                                <Minus
                                                                    size={13}
                                                                />
                                                            )}


                                                        {row.change >
                                                        0
                                                            ? "+"
                                                            : ""}

                                                        {
                                                            row.change
                                                        }

                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                        <span>Showing {processedComparisonData.length} parties compared</span>
                        <span>Tip: Sort by volatility to see highest shifting parties first.</span>
                    </div>

                </div>
            )}

        </section>
    );
}
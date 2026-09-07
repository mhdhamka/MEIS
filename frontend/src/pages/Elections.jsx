import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    ChevronDown,
} from "lucide-react";

import {
    useElectionData
} from "../hooks/useElectionData";

import ElectionTimeline
    from "../components/elections/ElectionTimeline";

import ElectionFilters
    from "../components/elections/ElectionFilters";

import ElectionCard
    from "../components/elections/ElectionCard";

import ElectionSummary
    from "../components/elections/ElectionSummary";

import ElectionResults
    from "../components/elections/ElectionResults";

import ElectionIntelligence
    from "../components/elections/ElectionIntelligence";

import ElectionComparison
    from "../components/elections/ElectionComparison";

import ElectionMapAction
    from "../components/elections/ElectionMapAction";

import LoadingState
    from "../components/states/LoadingState";

import ErrorState
    from "../components/states/ErrorState";

import EmptyState
    from "../components/states/EmptyState";


export default function ElectionsPage() {
    const [
        selectedElectionId,
        setSelectedElectionId
    ] = useState(null);


    const [search, setSearch] =
        useState("");

    const [type, setType] =
        useState("all");

    const [year, setYear] =
        useState("all");

    // Guide Collapse State
    const [showGuide, setShowGuide] =
        useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] =
        useState(1);
    const ITEMS_PER_PAGE = 9;


    const {
        elections,
        selectedElection,

        partyPerformance,
        seatCounts,
        statePerformance,

        summary,

        loading,
        error,

        reload
    } = useElectionData(
        selectedElectionId
    );


    // ============================================================
    // DEFAULT SELECT LATEST ELECTION
    // ============================================================

    useEffect(() => {

        if (
            !selectedElectionId &&
            elections.length
        ) {
            const latest =
                [...elections]
                    .sort(
                        (a, b) =>
                            Number(
                                b.election_year
                            ) -
                            Number(
                                a.election_year
                            )
                    )[0];


            if (latest) {
                setSelectedElectionId(
                    latest.election_id
                );
            }
        }

    }, [
        elections,
        selectedElectionId
    ]);


    // ============================================================
    // YEARS
    // ============================================================

    const years =
        useMemo(() => {

            return [
                ...new Set(
                    elections
                        .map(
                            (item) =>
                                item.election_year
                        )
                        .filter(Boolean)
                )
            ].sort(
                (a, b) =>
                    Number(b) -
                    Number(a)
            );

        }, [elections]);


    // ============================================================
    // FILTERED ELECTIONS
    // ============================================================

    const filteredElections =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return elections.filter(
                (election) => {

                    if (
                        type !== "all" &&
                        election.election_type !==
                            type
                    ) {
                        return false;
                    }


                    if (
                        year !== "all" &&
                        String(
                            election.election_year
                        ) !==
                            String(
                                year
                            )
                    ) {
                        return false;
                    }


                    if (query) {
                        const searchable =
                            [
                                election.election_name,
                                election.election_type,
                                election.election_year
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                        if (
                            !searchable.includes(
                                query
                            )
                        ) {
                            return false;
                        }
                    }


                    return true;
                }
            );

        }, [
            elections,
            search,
            type,
            year
        ]);


    // Reset pagination on filter or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, type, year]);


    // ============================================================
    // PAGINATED SLICE
    // ============================================================

    const totalPages = Math.ceil(
        filteredElections.length / ITEMS_PER_PAGE
    );

    const paginatedElections =
        useMemo(() => {
            const start =
                (currentPage - 1) *
                ITEMS_PER_PAGE;
            return filteredElections.slice(
                start,
                start + ITEMS_PER_PAGE
            );
        }, [
            filteredElections,
            currentPage
        ]);


    // ============================================================
    // STATES
    // ============================================================

    if (loading && !elections.length) {
        return (
            <LoadingState
                title="Loading election intelligence"
                message="Retrieving Malaysia's electoral history and analytical datasets."
            />
        );
    }


    if (error) {
        return (
            <ErrorState
                title="Unable to load elections"
                message={error}
                onRetry={reload}
            />
        );
    }


    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="p-6 space-y-6 min-h-screen bg-slate-950/5 text-slate-900 selection:bg-blue-500/20">


            {/* ====================================================
                HEADER (Glassmorphism Card)
            ==================================================== */}

            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-[#134074] rounded-full text-[10px] uppercase tracking-[0.18em] font-extrabold border border-blue-500/20 backdrop-blur-sm">
                        Electoral History
                    </span>

                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-3 bg-gradient-to-r from-slate-900 via-[#134074] to-blue-800 bg-clip-text text-transparent">
                        Election Intelligence
                    </h1>

                    <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
                        Explore Malaysian federal and state
                        election cycles, party results,
                        historical changes and comparative
                        electoral intelligence.
                    </p>

                </div>


                <div className="text-right px-5 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm">

                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Available Elections
                    </p>

                    <p className="text-2xl font-black text-[#134074]">
                        {
                            elections.length
                        }
                    </p>
                </div>
            </header>


            {/* ====================================================
                HOW TO USE THIS PAGE FEATURE (White Glassmorphism)
            ==================================================== */}

            <section className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 border border-white/40 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowGuide(!showGuide)}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#134074] shadow-sm">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                                Interactive Guide
                            </p>
                            <h2 className="text-sm font-black tracking-tight text-slate-900">
                                How to use the Election Intelligence feature
                            </h2>
                        </div>
                    </div>

                    <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-transform duration-200 shadow-sm">
                        <ChevronDown size={16} className={`transition-transform duration-300 ${showGuide ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {showGuide && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200/60 text-xs">
                        <div className="p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-[#134074] mb-1">
                                <span>1. Select & Navigate Timeline</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Use the horizontal electoral timeline or filter catalog cards below to choose any election year/cycle. Your selection dynamically loads full statistics below.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-[#134074] mb-1">
                                <span>2. Filter & Search Records</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Narrow down specific election types (General, State, By-Election) or specific years using the filter panel to quickly locate specific historical cycles.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-[#134074] mb-1">
                                <span>3. Analyze Deep Insights</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Once an election is picked, review summaries, party seats breakdown, regional/state performance metrics, historical comparisons, and interactive maps.
                            </p>
                        </div>
                    </div>
                )}
            </section>


            {/* ====================================================
                TIMELINE
            ==================================================== */}

            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/40">
                <ElectionTimeline
                    elections={elections}
                    selectedElectionId={
                        selectedElectionId
                    }
                    onSelect={
                        setSelectedElectionId
                    }
                />
            </div>


            {/* ====================================================
                FILTERS
            ==================================================== */}

            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/40">
                <ElectionFilters
                    search={search}
                    onSearchChange={
                        setSearch
                    }

                    type={type}
                    onTypeChange={
                        setType
                    }

                    year={year}
                    onYearChange={
                        setYear
                    }

                    years={years}

                    onReset={() => {
                        setSearch("");
                        setType("all");
                        setYear("all");
                    }}
                />
            </div>


            {/* ====================================================
                CATALOGUE
            ==================================================== */}

            <section className="space-y-4">

                <div className="flex items-center justify-between px-1">

                    <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                            Election Catalogue
                        </p>

                        <h2 className="text-lg font-black text-slate-900 mt-0.5">
                            Available Election Cycles
                        </h2>

                    </div>


                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 shadow-sm">
                        Showing{" "}
                        {paginatedElections.length > 0
                            ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                            : 0}
                        -
                        {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredElections.length
                        )}{" "}
                        of {filteredElections.length} results
                    </span>

                </div>


                {filteredElections.length ===
                0 ? (

                    <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                        <EmptyState
                            title="No elections found"
                            message="Try adjusting the election type, year or search query."
                            actionLabel="Clear filters"
                            onAction={() => {
                                setSearch("");
                                setType("all");
                                setYear("all");
                            }}
                        />
                    </div>

                ) : (

                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {paginatedElections.map(
                                (
                                    election
                                ) => (
                                    <div
                                        key={
                                            election.election_id
                                        }
                                        className="transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <ElectionCard
                                            election={
                                                election
                                            }
                                            selected={
                                                Number(
                                                    selectedElectionId
                                                ) ===
                                                Number(
                                                    election.election_id
                                                )
                                            }
                                            onSelect={
                                                setSelectedElectionId
                                            }
                                        />
                                    </div>
                                )
                            )}

                        </div>


                        {/* ================================================
                            PAGINATION CONTROLS (Glassmorphic)
                        ================================================ */}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/40 mt-6">

                                <p className="text-xs font-medium text-slate-500">
                                    Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                                </p>


                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(p - 1, 1)
                                            )
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft
                                            size={14}
                                        />
                                        Previous
                                    </button>


                                    <div className="hidden sm:flex items-center gap-1">
                                        {Array.from(
                                            {
                                                length: totalPages
                                            },
                                            (_, i) => i + 1
                                        ).map((page) => {
                                            // Optional: display pages near current or all if small count
                                            const isNearCurrent =
                                                Math.abs(page - currentPage) <= 1 ||
                                                page === 1 ||
                                                page === totalPages;

                                            if (!isNearCurrent) {
                                                if (
                                                    page === 2 ||
                                                    page ===
                                                        totalPages - 1
                                                ) {
                                                    return (
                                                        <span
                                                            key={page}
                                                            className="px-1 text-xs text-slate-400 font-bold"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all shadow-sm ${
                                                        currentPage ===
                                                        page
                                                            ? "bg-[#134074] text-white shadow-blue-900/20 shadow-md"
                                                            : "bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-600 hover:bg-white hover:border-slate-300"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>


                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(
                                                    p + 1,
                                                    totalPages
                                                )
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight
                                            size={14}
                                        />
                                    </button>

                                </div>

                            </div>
                        )}
                    </>

                )}

            </section>


            {/* ====================================================
                SELECTED ELECTION SECTIONS
            ==================================================== */}

            {selectedElection && (
                <div className="space-y-6 pt-4">

                    <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                        <ElectionSummary
                            election={
                                selectedElection
                            }
                            summary={
                                summary
                            }
                        />
                    </div>


                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

                        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                            <ElectionResults
                                seatCounts={
                                    seatCounts
                                }
                                partyPerformance={
                                    partyPerformance
                                }
                            />
                        </div>


                        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                            <ElectionIntelligence
                                seatCounts={
                                    seatCounts
                                }
                                statePerformance={
                                    statePerformance
                                }
                            />
                        </div>

                    </div>


                    {/* STATE PERFORMANCE */}

                    <section className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">

                        <div className="mb-5">

                            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                                Geographic Breakdown
                            </p>

                            <h3 className="text-lg font-black text-slate-900 mt-1">
                                State Performance
                            </h3>

                        </div>


                        {statePerformance.length ===
                        0 ? (

                            <p className="text-sm text-slate-500 font-medium">
                                No state-level data available.
                            </p>

                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                {statePerformance.map(
                                    (
                                        state,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                state.state_id ??
                                                state.state_name ??
                                                index
                                            }
                                            className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm transition-all hover:shadow-md"
                                        >

                                            <p className="text-sm font-bold text-slate-800">
                                                {
                                                    state.state_name
                                                }
                                            </p>

                                            <p className="text-xl font-black text-[#134074] mt-2">
                                                {Number(
                                                    state.total_votes ??
                                                    0
                                                ).toLocaleString()}
                                            </p>

                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
                                                total votes
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* COMPARISON */}

                    <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                        <ElectionComparison
                            elections={
                                elections
                            }
                            selectedElectionId={
                                selectedElectionId
                            }
                        />
                    </div>


                    {/* MAP */}

                    <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                        <ElectionMapAction
                            election={
                                selectedElection
                            }
                        />
                    </div>

                </div>
            )}

        </div>
    );
}
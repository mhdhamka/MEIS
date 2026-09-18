import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PartyCard from "../components/parties/PartyCard";
import { api } from "../services/api";
import { HelpCircle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function Parties() {
    const [parties, setParties] = useState([]);
    const [search, setSearch] = useState("");
    const [electionFilter, setElectionFilter] = useState("all");
    const [elections, setElections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Guide Collapse State
    const [showGuide, setShowGuide] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const [partyResponse, electionResponse] =
                    await Promise.all([
                        api.getParties(electionFilter !== "all" ? electionFilter : null),
                        api.getElections(),
                    ]);

                if (!mounted) {
                    return;
                }

                const partyData =
                    partyResponse?.data ??
                    partyResponse ??
                    [];

                const electionData =
                    electionResponse?.data ??
                    electionResponse ??
                    [];

                setParties(
                    Array.isArray(partyData)
                        ? partyData
                        : []
                );

                setElections(
                    Array.isArray(electionData)
                        ? electionData
                        : []
                );

            } catch (err) {
                console.error("Failed to load parties:", err);

                if (mounted) {
                    setError(
                        err.message ||
                        "Failed to load political parties."
                    );
                }

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };

    }, [electionFilter]);

    const filteredParties = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        return parties.filter((party) => {
            const name =
                party.party_name ??
                party.name ??
                party.full_name ??
                "";

            const code =
                party.party_code ??
                party.code ??
                party.abbreviation ??
                "";

            const matchesSearch =
                !query ||
                String(name).toLowerCase().includes(query) ||
                String(code).toLowerCase().includes(query);

            const partyElectionId =
                party.election_id ??
                party.electionId ??
                null;

            const matchesElection =
                electionFilter === "all" ||
                String(partyElectionId) ===
                    String(electionFilter);

            return (
                matchesSearch &&
                matchesElection
            );
        });
    }, [parties, search, electionFilter]);

    // Paginated Slice
    const totalPages = Math.ceil(
        filteredParties.length / ITEMS_PER_PAGE
    );

    const paginatedParties = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredParties.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredParties, currentPage]);

    if (loading && !parties.length) {
        return (
            <LoadingState
                title="Loading political parties"
                message="Retrieving party listings and electoral mapping datasets."
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                title="Unable to load parties"
                message={error}
            />
        );
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-white text-slate-900 selection:bg-blue-500/25 pb-12">

            {/* ====================================================
                HEADER (Glassmorphism Card)
            ==================================================== */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link
                            to="/"
                            className="hover:text-[#134074]"
                        >
                            MEIS
                        </Link>
                        <span>/</span>
                        <span className="text-slate-600">
                            Parties
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-3 bg-gradient-to-r from-slate-900 via-[#134074] to-blue-800 bg-clip-text text-transparent">
                        Political Parties
                    </h1>

                    <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
                        Explore party performance, electoral history,
                        candidates and geographic strength.
                    </p>
                </div>

                <div className="text-right px-5 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Parties
                    </p>
                    <p className="text-2xl font-black text-[#134074]">
                        {parties.length}
                    </p>
                </div>
            </header>

            {/* ====================================================
                HOW TO USE THIS PAGE FEATURE (White Glassmorphism)
            ==================================================== */}
            <section className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 border border-white/40 shadow-xl shadow-slate-200/50">
                <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => setShowGuide(!showGuide)}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#134074] shadow-sm">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                                Guide
                            </p>
                            <h2 className="text-sm font-black tracking-tight text-slate-900">
                                How to use the Political Parties directory
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
                                <span>1. Search by Name or Code</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Type any party name, full description, or abbreviation into the live search input to instantly locate matching entities.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-[#134074] mb-1">
                                <span>2. Filter by Election Cycle</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Use the election filter dropdown to examine parties tied specifically to individual historical election cycles or view all.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-[#134074] mb-1">
                                <span>3. Review Performance</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Click on individual party cards to delve deeper into historical seat counts, electoral metrics, and trends over time.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* ====================================================
                FILTERS
            ==================================================== */}
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/40">
                <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search party or abbreviation..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none transition focus:border-[#134074] focus:bg-white shadow-sm"
                        />
                    </div>

                    <select
                        value={electionFilter}
                        onChange={(event) => {
                            setElectionFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#134074] focus:bg-white shadow-sm"
                    >
                        <option value="all">
                            All Elections
                        </option>
                        {elections.map((election) => {
                            const id =
                                election.id ??
                                election.election_id;

                            const name =
                                election.name ??
                                election.election ??
                                election.title ??
                                id;

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                </option>
                            );
                        })}
                    </select>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setElectionFilter("all");
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition bg-white/80 hover:bg-white hover:border-slate-300 shadow-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* ====================================================
                CONTENT CATALOGUE
            ==================================================== */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                            Parties Directory
                        </p>
                        <h2 className="text-lg font-black text-slate-900 mt-0.5">
                            Registered Political Parties
                        </h2>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 shadow-sm">
                        Showing{" "}
                        {paginatedParties.length > 0
                            ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                            : 0}
                        -
                        {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredParties.length
                        )}{" "}
                        of {filteredParties.length} results
                    </span>
                </div>

                {filteredParties.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {paginatedParties.map((party, index) => (
                                <div
                                    key={
                                        party.party_id ??
                                        party.id ??
                                        party.party_code ??
                                        party.code ??
                                        index
                                    }
                                    className="transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* 
                                      Ensure PartyCard receives standard fields expected from analytics.py 
                                      such as seats_won, seats_contested, candidates, and vote_share.
                                    */}
                                    <PartyCard party={party} />
                                </div>
                            ))}
                        </div>

                        {/* ================================================
                            PAGINATION CONTROLS
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
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={14} />
                                        Previous
                                    </button>

                                    <div className="hidden sm:flex items-center gap-1">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map((page) => {
                                            const isNearCurrent =
                                                Math.abs(page - currentPage) <= 1 ||
                                                page === 1 ||
                                                page === totalPages;

                                            if (!isNearCurrent) {
                                                if (
                                                    page === 2 ||
                                                    page === totalPages - 1
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
                                                        setCurrentPage(page)
                                                    }
                                                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all shadow-sm ${
                                                        currentPage === page
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
                                                Math.min(p + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm transition-all hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="p-6 space-y-6 min-h-screen bg-white">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60 shadow-sm" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-64 animate-pulse rounded-2xl border border-slate-200/60 bg-white shadow-sm"
                    />
                ))}
            </div>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="p-6 min-h-screen flex items-center justify-center">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-md w-full shadow-lg">
                <h3 className="font-bold text-red-800 text-lg">
                    Unable to load parties
                </h3>
                <p className="mt-2 text-sm text-red-600 font-medium">
                    {message}
                </p>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md p-12 text-center shadow-sm">
            <h3 className="font-bold text-slate-900 text-base">
                No parties found
            </h3>
            <p className="mt-2 text-sm text-slate-500 font-medium">
                Try changing your search or filters.
            </p>
        </div>
    );
}
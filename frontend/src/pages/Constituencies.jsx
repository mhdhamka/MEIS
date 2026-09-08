import { useEffect, useRef, useState } from "react";
import {
    Table2,
    LayoutGrid,
    HelpCircle,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

import ConstituencyFilters
    from "../components/constituencies/ConstituencyFilters";

import ConstituencyTable
    from "../components/constituencies/ConstituencyTable";

import ConstituencyCard
    from "../components/constituencies/ConstituencyCard";

import ConstituencyProfile
    from "../components/constituencies/ConstituencyProfile";

import ErrorState
    from "../components/states/ErrorState";

import EmptyState
    from "../components/states/EmptyState";

import SkeletonCard
    from "../components/states/SkeletonCard";

import SkeletonTable
    from "../components/states/SkeletonTable";

import { useConstituencyData }
    from "../hooks/useConstituencyData";

import { api } from "../services/api";

export default function ConstituenciesPage() {

    const [filters, setFilters] = useState({
        search: "",
        seat_type: "",
        state: "",
        party: "",
        election_id: "",
        margin: "",
        sort: "code",
        page: 1,
        limit: 20,
    });

    const [viewMode, setViewMode] =
        useState("table");

    const [states, setStates] =
        useState([]);

    const [parties, setParties] =
        useState([]);

    const [elections, setElections] =
        useState([]);

    const [guideOpen, setGuideOpen] =
        useState(true);

    const {
        data,
        pagination,
        loading,
        error,
        selectedConstituency,
        profileLoading,
        loadProfile,
        closeProfile,
        fetchConstituencies,
    } = useConstituencyData(filters);


    // ============================================================
    // LOAD FILTER DATA
    // ============================================================

    const isActiveRef = useRef(true);

    useEffect(() => {
        isActiveRef.current = true;

        async function loadFilters() {

            try {

                const [
                    statesResponse,
                    partiesResponse,
                    electionsResponse,
                ] = await Promise.all([
                    api.getStates(),
                    api.getParties(),
                    api.getElections(),
                ]);

                if (!isActiveRef.current) {
                    return;
                }

                setStates(
                    statesResponse?.data ??
                    statesResponse ??
                    []
                );

                setParties(
                    partiesResponse?.data ??
                    partiesResponse ??
                    []
                );

                setElections(
                    electionsResponse?.data ??
                    electionsResponse ??
                    []
                );

            } catch (err) {

                console.error(
                    "Failed to load constituency filters:",
                    err
                );

            }

        }

        loadFilters();

        return () => {
            isActiveRef.current = false;
        };

    }, []);


    // ============================================================
    // SELECT CONSTITUENCY
    // ============================================================

    const handleSelect = async (constituency) => {

        const seatId = constituency.seat_id ?? constituency.id;

        if (!seatId) {
            return;
        }

        await loadProfile(seatId);

    };


    // ============================================================
    // RESET
    // ============================================================

    const resetFilters = () => {

        setFilters({
            search: "",
            seat_type: "",
            state: "",
            party: "",
            election_id: "",
            margin: "",
            sort: "code",
            page: 1,
            limit: 20,
        });

    };


    // ============================================================
    // PAGE CHANGE
    // ============================================================

    const handlePageChange = (page) => {

        setFilters((current) => ({
            ...current,
            page,
        }));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    return (
        <div className="min-h-full bg-slate-50/50 p-4 md:p-6 lg:p-8 space-y-6">

            {/* ================================================== */}
            {/* HERO BANNER CARD */}
            {/* ================================================== */}

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] uppercase tracking-[0.18em] font-extrabold text-[#134074]">
                        Electoral Intelligence
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                        Constituencies
                    </h1>
                    <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Master directory of Malaysian parliamentary and state legislative constituencies, electoral results and historical performance.
                    </p>
                </div>

                {/* STAT BADGE & VIEW TOGGLE */}
                <div className="flex items-center gap-4">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-5 py-3 text-right">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Seats</span>
                        <span className="text-2xl font-black text-[#0b2545]">{pagination.total || 0}</span>
                    </div>

                    <div className="flex bg-slate-100/80 border border-slate-200/80 rounded-xl p-1 shadow-inner">
                        <button
                            onClick={() => setViewMode("table")}
                            title="Table View"
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                                viewMode === "table"
                                    ? "bg-[#0b2545] text-white shadow-md"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-white/50"
                            }`}
                        >
                            <Table2 size={16} />
                        </button>

                        <button
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                                viewMode === "grid"
                                    ? "bg-[#0b2545] text-white shadow-md"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-white/50"
                            }`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>


            {/* ================================================== */}
            {/* INTERACTIVE GUIDE CARD */}
            {/* ================================================== */}

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
                <div 
                    onClick={() => setGuideOpen(!guideOpen)}
                    className="p-5 px-6 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-[#134074]">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                                Guide
                            </p>
                            <h3 className="text-sm font-bold text-slate-900">How to use the Constituency Directory</h3>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                        {guideOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>

                {guideOpen && (
                    <div className="p-6 pt-2 border-t border-slate-100 grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                            <span className="text-xs font-bold text-[#134074]">1. Search & Filter</span>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Use the search box or filter selections below to narrow records down by state, seat type, political party, or margin.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                            <span className="text-xs font-bold text-[#134074]">2. Switch Layouts</span>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Toggle seamlessly between the structured data table view or the visual cards grid layout using the controls in the header.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                            <span className="text-xs font-bold text-[#134074]">3. Inspect Profiles</span>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Click on any constituency record or card to pop open its deep profile drawer for historical performance metrics and map data.
                            </p>
                        </div>
                    </div>
                )}
            </div>


            {/* ================================================== */}
            {/* FILTERS PANEL */}
            {/* ================================================== */}

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <ConstituencyFilters
                    filters={filters}
                    states={states}
                    parties={parties}
                    elections={elections}
                    onChange={setFilters}
                    onReset={resetFilters}
                />
            </div>


            {/* ================================================== */}
            {/* DIRECTORY VIEW (TABLE / GRID) */}
            {/* ================================================== */}

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                {error ? (
                    <ErrorState
                        title="Failed to load constituencies"
                        message={error}
                        onRetry={fetchConstituencies}
                    />
                ) : viewMode === "table" ? (
                    <div>
                        {loading ? (
                            <SkeletonTable rows={8} columns={5} />
                        ) : data.length > 0 ? (
                            <ConstituencyTable
                                data={data}
                                loading={loading}
                                pagination={pagination}
                                onSelect={handleSelect}
                                onPageChange={handlePageChange}
                            />
                        ) : (
                            <EmptyState
                                title="No constituencies found"
                                message="Adjust your filters or search query to find matching constituencies."
                                actionLabel="Reset Filters"
                                onAction={resetFilters}
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        ) : data.length > 0 ? (
                            <div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {data.map((constituency, index) => {
                                        const uniqueKey = [
                                            constituency.seat_id,
                                            constituency.id,
                                            constituency.seat_code,
                                            constituency.code,
                                            constituency.code_parlimen,
                                            constituency.code_dun,
                                            index
                                        ].filter(Boolean).join("-");

                                        return (
                                            <ConstituencyCard
                                                key={uniqueKey}
                                                constituency={constituency}
                                                onSelect={handleSelect}
                                            />
                                        );
                                    })}
                                </div>

                                {/* GRID PAGINATION */}
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center items-center gap-2">
                                    <button
                                        disabled={pagination.page <= 1}
                                        onClick={() =>
                                            handlePageChange(pagination.page - 1)
                                        }
                                        className="px-4 py-2 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="px-4 py-2 text-xs font-bold bg-[#0b2545] text-white rounded-lg shadow-sm">
                                        {pagination.page} / {pagination.totalPages || 1}
                                    </div>

                                    <button
                                        disabled={
                                            pagination.page >= pagination.totalPages
                                        }
                                        onClick={() =>
                                            handlePageChange(pagination.page + 1)
                                        }
                                        className="px-4 py-2 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                title="No constituencies found"
                                message="Adjust your filters or search query to find matching constituencies."
                                actionLabel="Reset Filters"
                                onAction={resetFilters}
                            />
                        )}
                    </div>
                )}
            </div>


            {/* ================================================== */}
            {/* PROFILE DRAWER/MODAL */}
            {/* ================================================== */}

            {selectedConstituency && (

                <ConstituencyProfile
                    constituency={
                        selectedConstituency
                    }
                    loading={profileLoading}
                    onClose={closeProfile}
                    onViewMap={(constituency) => {

                        console.log(
                            "Navigate to map:",
                            constituency
                        );

                    }}
                />

            )}

        </div>
    );
}
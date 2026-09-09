import { useMemo, useState } from "react";
import {
    Users,
    Trophy,
    Percent,
    BarChart3,
    HelpCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import CandidateCard from "../components/candidates/CandidateCard";
import CandidateFilters from "../components/candidates/CandidateFilters";
import CandidatePartyBreakdown from "../components/candidates/CandidatePartyBreakdown";

import { useCandidateData } from "../hooks/useCandidateData";

const PAGE_SIZE = 12;
const PARTY_PAGE_SIZE = 10; // Limits party breakdown to 10 items per page

export default function CandidatesPage() {
    const [filters, setFilters] = useState({
        search: "",
        party_id: "all",
        election_id: "all",
        state: "all",
        seat_id: "all",
        result: "all",
    });

    const queryFilters = useMemo(() => {
        const params = {};
        if (filters.election_id && filters.election_id !== "all") {
            params.election_id = filters.election_id;
        }
        if (filters.party_id && filters.party_id !== "all") {
            params.party_id = filters.party_id;
        }
        if (filters.state && filters.state !== "all") {
            params.state = filters.state;
        }
        if (filters.seat_id && filters.seat_id !== "all") {
            params.seat_id = filters.seat_id;
        }
        return params;
    }, [filters.election_id, filters.party_id, filters.state, filters.seat_id]);

    const {
        candidates,
        elections,
        parties,
        seats,
        states,
        partyBreakdown,
        loading,
        error,
    } = useCandidateData(null, queryFilters);

    const [page, setPage] = useState(1);
    const [partyPage, setPartyPage] = useState(1); // Pagination state for party breakdown

    const filteredCandidates =
        useMemo(() => {
            const search =
                filters.search
                    .trim()
                    .toLowerCase();

            return candidates.filter(
                (candidate) => {
                    if (search) {
                        const searchable = [
                            candidate.name,
                            candidate.party,
                            candidate.seatCode,
                            candidate.seatName,
                            candidate.state,
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                        if (!searchable.includes(search)) {
                            return false;
                        }
                    }

                    if (filters.party_id !== "all") {
                        if (
                            !String(candidate.party)
                                .toLowerCase()
                                .includes(String(filters.party_id).toLowerCase())
                        ) {
                            return false;
                        }
                    }

                    if (filters.state !== "all") {
                        if (
                            !String(candidate.state)
                                .toLowerCase()
                                .includes(String(filters.state).toLowerCase())
                        ) {
                            return false;
                        }
                    }

                    if (filters.seat_id !== "all") {
                        const selectedSeat = String(filters.seat_id).toLowerCase();
                        const seatId = String(candidate.seatId ?? "").toLowerCase();
                        const seatCode = String(candidate.seatCode ?? "").toLowerCase();
                        const seatName = String(candidate.seatName ?? "").toLowerCase();

                        if (
                            selectedSeat !== seatId &&
                            selectedSeat !== seatCode &&
                            selectedSeat !== seatName
                        ) {
                            return false;
                        }
                    }

                    if (filters.election_id !== "all") {
                        const matches =
                            candidate.history?.some(
                                (item) =>
                                    String(item.electionId) ===
                                    String(filters.election_id)
                            ) || String(candidate.electionId) === String(filters.election_id);

                        if (!matches) {
                            return false;
                        }
                    }

                    if (filters.result !== "all") {
                        const matches =
                            candidate.history?.some(
                                (item) =>
                                    filters.result === "WIN"
                                        ? item.isWinner
                                        : !item.isWinner
                            ) || (filters.result === "WIN" ? candidate.isWinner : !candidate.isWinner);

                        if (!matches) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }, [candidates, filters]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCandidates.length /
                PAGE_SIZE
        )
    );

    const currentPage = Math.min(
        page,
        totalPages
    );

    const paginatedCandidates =
        useMemo(() => {
            const start =
                (currentPage - 1) *
                PAGE_SIZE;

            return filteredCandidates.slice(
                start,
                start + PAGE_SIZE
            );
        }, [
            filteredCandidates,
            currentPage,
        ]);

    // Paginated logic for Party Breakdown
    const totalPartyPages = Math.max(
        1,
        Math.ceil((partyBreakdown?.length || 0) / PARTY_PAGE_SIZE)
    );

    const currentPartyPage = Math.min(partyPage, totalPartyPages);

    const paginatedPartyBreakdown = useMemo(() => {
        if (!partyBreakdown) return [];
        const start = (currentPartyPage - 1) * PARTY_PAGE_SIZE;
        return partyBreakdown.slice(start, start + PARTY_PAGE_SIZE);
    }, [partyBreakdown, currentPartyPage]);

    const stats = useMemo(() => {
        const total = filteredCandidates.length;

        const wins = filteredCandidates.reduce(
            (sum, candidate) => 
                sum + Number(candidate.wins ?? (candidate.isWinner ? 1 : 0)),
            0
        );

        const losses = filteredCandidates.reduce(
            (sum, candidate) => 
                sum + Number(candidate.losses ?? (!candidate.isWinner ? 1 : 0)),
            0
        );

        const contested = filteredCandidates.reduce(
            (sum, candidate) => 
                sum + Number(candidate.contested ?? (candidate.history?.length || 1)),
            0
        );

        return {
            total,
            wins,
            losses,
            contested,
        };
    }, [filteredCandidates]);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <PageSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                    <h2 className="font-bold text-red-800">
                        Candidate Data Unavailable
                    </h2>
                    <p className="mt-1 text-sm text-red-700">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-white text-slate-900 selection:bg-blue-500/20 pb-12">

            {/* HEADER */}
            <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 p-6 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-[#134074] rounded-full text-[10px] uppercase tracking-[0.18em] font-extrabold border border-blue-500/20 backdrop-blur-sm">
                        Candidate Intelligence
                    </span>

                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-3 bg-gradient-to-r from-slate-900 via-[#134074] to-blue-800 bg-clip-text text-transparent">
                        Candidates Directory
                    </h1>

                    <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
                        Explore candidate participation, election performance, 
                        party affiliation and historical electoral outcomes.
                    </p>
                </div>

                <div className="text-right px-5 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm self-start lg:self-center">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Available Candidates
                    </p>
                    <p className="text-2xl font-black text-[#134074]">
                        {filteredCandidates.length.toLocaleString()}
                    </p>
                </div>
            </header>

            <GuideSection />

            {/* KPIs */}
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Candidates"
                    value={stats.total}
                    description="Filtered candidates"
                    iconBg="bg-blue-50 text-blue-600 border border-blue-100"
                />

                <StatCard
                    icon={Trophy}
                    label="Wins"
                    value={stats.wins}
                    description="Recorded victories"
                    iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
                />

                <StatCard
                    icon={Percent}
                    label="Losses"
                    value={stats.losses}
                    description="Recorded losses"
                    iconBg="bg-rose-50 text-rose-600 border border-rose-100"
                />

                <StatCard
                    icon={BarChart3}
                    label="Elections Contested"
                    value={stats.contested}
                    description="Across candidate history"
                    iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
                />
            </section>

            {/* Filters Container */}
            <section className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/40">
                <CandidateFilters
                    filters={filters}
                    setFilters={(value) => {
                        setFilters(value);
                        setPage(1);
                    }}
                    parties={parties}
                    elections={elections}
                    states={states}
                    seats={seats}
                />
            </section>

            {/* Directory Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                            Candidate Catalogue
                        </p>
                        <h2 className="text-lg font-black text-slate-900 mt-0.5">
                            Candidate Directory
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Select a candidate to inspect their complete electoral history.
                        </p>
                    </div>

                    <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 shadow-sm">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>

                {paginatedCandidates.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {paginatedCandidates.map((candidate) => (
                            <CandidateCard
                                key={candidate.candidateId}
                                candidate={candidate}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </section>

            {/* Pagination */}
            {filteredCandidates.length > PAGE_SIZE && (
                <div className="flex justify-center pt-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Party Breakdown Container */}
            <section className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Party Breakdown</h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 shadow-sm">
                        Page {currentPartyPage} of {totalPartyPages}
                    </span>
                </div>

                <CandidatePartyBreakdown data={paginatedPartyBreakdown} />

                {/* Party Breakdown Pagination */}
                {partyBreakdown && partyBreakdown.length > PARTY_PAGE_SIZE && (
                    <div className="flex justify-center pt-2">
                        <Pagination
                            currentPage={currentPartyPage}
                            totalPages={totalPartyPages}
                            onPageChange={setPartyPage}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}

function GuideSection() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-200/40 p-6 transition-all">
            <div 
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                        <HelpCircle size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                            Guide
                        </p>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                            How to use the Candidates Directory
                        </h2>
                    </div>
                </div>

                <button 
                    type="button"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
                    aria-label="Toggle Guide"
                >
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm space-y-1">
                        <h3 className="text-xs font-bold text-slate-900">
                            1. Search & Filter
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                            Use the search box or filter options below to quickly narrow down records by name, political party, state, seat, or electoral result.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm space-y-1">
                        <h3 className="text-xs font-bold text-slate-900">
                            2. Track Performance Metrics
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                            Monitor aggregate wins, losses, and contested races dynamically update in the KPI summary cards based on your applied filters.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm space-y-1">
                        <h3 className="text-xs font-bold text-slate-900">
                            3. Inspect Profiles
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                            Click on any candidate card to open their detailed profile view, examining their complete electoral trajectory over time.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

function StatCard({ icon: Icon, label, value, description, iconBg }) {
    return (
        <div className="p-6 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 relative flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
                        {Number(value || 0).toLocaleString()}
                    </p>
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${iconBg}`}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100/80">
                <p className="text-xs text-slate-500 font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            pages.push(i);
        }
    }

    const uniquePages = [...new Set(pages)];

    return (
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 p-2 shadow-lg shadow-slate-200/40">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
                Previous
            </button>

            {uniquePages.map((pageNumber, index) => {
                const previous = uniquePages[index - 1];
                const showGap = previous && pageNumber - previous > 1;

                return (
                    <span key={pageNumber} className="flex items-center gap-1.5">
                        {showGap && <span className="px-1 text-slate-400 font-bold">...</span>}
                        <button
                            type="button"
                            onClick={() => onPageChange(pageNumber)}
                            className={`h-9 min-w-9 rounded-xl px-3 text-xs font-black transition ${
                                currentPage === pageNumber
                                    ? "bg-[#134074] text-white shadow-md shadow-blue-900/20"
                                    : "border border-slate-200/80 bg-white/80 text-slate-700 hover:bg-white"
                            }`}
                        >
                            {pageNumber}
                        </button>
                    </span>
                );
            })}

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
                Next
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                <Users size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No candidates found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Try changing your search keywords or narrowing your filter criteria.
            </p>
        </div>
    );
}

function PageSkeleton() {
    return (
        <>
            <div className="h-28 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-28 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm" />
                ))}
            </div>
            <div className="h-32 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-80 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm" />
                ))}
            </div>
        </>
    );
}
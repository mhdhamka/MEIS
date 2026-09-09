import { Search, RotateCcw } from "lucide-react";

export default function CandidateFilters({
    filters,
    setFilters,
    parties = [],
    elections = [],
    states = [],
    seats = [],
}) {
    const updateFilter = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            party_id: "all",
            election_id: "all",
            state: "all",
            seat_id: "all",
            result: "all",
        });
    };

    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all">
            {/* Subtle decorative background gradient blob */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-5">
                {/* Search Bar */}
                <div className="relative group">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                    />
                    <input
                        type="text"
                        value={filters.search || ""}
                        onChange={(event) =>
                            updateFilter("search", event.target.value)
                        }
                        placeholder="Search candidate, party, constituency..."
                        className="w-full rounded-2xl border border-slate-200/80 bg-white/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:border-blue-500/80 focus:bg-white/80 focus:ring-4 focus:ring-blue-500/10 shadow-inner"
                    />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-5">
                    <FilterSelect
                        label="Party"
                        value={filters.party_id ?? "all"}
                        onChange={(value) => updateFilter("party_id", value)}
                        options={parties.map((party) => ({
                            value: party.party_id ?? party.partyId ?? party.id,
                            label: party.party_name ?? party.partyName ?? party.name,
                        }))}
                    />

                    <FilterSelect
                        label="Election"
                        value={filters.election_id ?? "all"}
                        onChange={(value) => updateFilter("election_id", value)}
                        options={elections.map((election) => ({
                            value:
                                election.election_id ??
                                election.electionId ??
                                election.id ??
                                election.code,
                            label:
                                election.election_name ??
                                election.electionName ??
                                election.name ??
                                election.code,
                        }))}
                    />

                    <FilterSelect
                        label="State"
                        value={filters.state ?? "all"}
                        onChange={(value) => updateFilter("state", value)}
                        options={states.map((state) => ({
                            value:
                                typeof state === "string"
                                    ? state
                                    : state.state_name ??
                                      state.state ??
                                      state.name ??
                                      state.code,
                            label:
                                typeof state === "string"
                                    ? state
                                    : state.state_name ??
                                      state.state ??
                                      state.name ??
                                      state.code,
                        }))}
                    />

                    <FilterSelect
                        label="Seat"
                        value={filters.seat_id ?? "all"}
                        onChange={(value) => updateFilter("seat_id", value)}
                        options={seats.map((seat) => ({
                            value: seat.seat_id ?? seat.id,
                            label: `${seat.seat_code ?? seat.code} - ${seat.seat_name ?? seat.name}`,
                        }))}
                    />

                    <FilterSelect
                        label="Result"
                        value={filters.result ?? "all"}
                        onChange={(value) => updateFilter("result", value)}
                        options={[
                            { value: "WIN", label: "Won" },
                            { value: "LOSS", label: "Lost" },
                        ]}
                    />
                </div>

                {/* Reset Action */}
                <div className="flex justify-end pt-1">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/40 px-3.5 py-2 text-xs font-semibold text-slate-600 backdrop-blur-md transition-all duration-200 hover:border-slate-300 hover:bg-white/80 hover:text-slate-900 active:scale-95 shadow-sm"
                    >
                        <RotateCcw
                            size={14}
                            className="transition-transform duration-300 group-hover:-rotate-90"
                        />
                        Reset Filters
                    </button>
                </div>
            </div>
        </section>
    );
}

function FilterSelect({ label, value, onChange, options = [] }) {
    return (
        <label className="block group">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-blue-600">
                {label}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white/50 px-3.5 py-2.5 pr-9 text-sm text-slate-700 outline-none backdrop-blur-sm transition-all duration-200 focus:border-blue-500/80 focus:bg-white/90 focus:ring-4 focus:ring-blue-500/10 shadow-sm cursor-pointer"
                >
                    <option value="all" className="bg-white text-slate-700">
                        All
                    </option>

                    {options
                        .filter(
                            (option) =>
                                option.value !== undefined &&
                                option.value !== null &&
                                option.value !== ""
                        )
                        .map((option, index) => (
                            <option
                                key={`${String(option.value)}-${index}`}
                                value={String(option.value)}
                                className="bg-white text-slate-700"
                            >
                                {option.label}
                            </option>
                        ))}
                </select>

                {/* Custom chevron dropdown icon */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </label>
    );
}
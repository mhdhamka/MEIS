import {
    Search,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";

export default function ConstituencyFilters({
    filters,
    states = [],
    parties = [],
    elections = [],
    onChange,
    onReset,
}) {

    const updateFilter = (key, value) => {
        onChange({
            ...filters,
            [key]: value,
            page: 1,
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

                <div className="flex items-center gap-2">

                    <div className="w-8 h-8 rounded-lg bg-[#0b2545] flex items-center justify-center">

                        <SlidersHorizontal
                            size={15}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h3 className="text-sm font-bold text-slate-900">
                            Constituency Directory
                        </h3>

                        <p className="text-[11px] text-slate-500">
                            Search and filter electoral constituencies
                        </p>

                    </div>

                </div>

                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0b2545] hover:bg-slate-50 rounded-lg transition"
                >

                    <RotateCcw size={13} />

                    Reset

                </button>

            </div>

            {/* FILTER BODY */}

            <div className="p-5">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">

                    {/* SEARCH */}

                    <div className="lg:col-span-2">

                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Search
                        </label>

                        <div className="relative">

                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={filters.search || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "search",
                                        e.target.value
                                    )
                                }
                                placeholder="Search by constituency name or code..."
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-[#134074] focus:ring-1 focus:ring-[#134074]/10"
                            />

                        </div>

                    </div>

                    {/* SEAT TYPE */}

                    <FilterSelect
                        label="Seat Type"
                        value={filters.seat_type || ""}
                        onChange={(value) =>
                            updateFilter(
                                "seat_type",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label: "All Types",
                            },
                            {
                                value: "parliament",
                                label: "Parliament",
                            },
                            {
                                value: "dun",
                                label: "DUN",
                            },
                        ]}
                    />

                    {/* STATE */}

                    <FilterSelect
                        label="State"
                        value={filters.state || ""}
                        onChange={(value) =>
                            updateFilter(
                                "state",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label: "All States",
                            },
                            ...states.map((state) => ({
                                value:
                                    state.state_name ??
                                    state.name,
                                label:
                                    state.state_name ??
                                    state.name,
                            })),
                        ]}
                    />

                    {/* ELECTION */}

                    <FilterSelect
                        label="Election"
                        value={filters.election_id || ""}
                        onChange={(value) =>
                            updateFilter(
                                "election_id",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label: "All Elections",
                            },
                            ...elections.map((election) => ({
                                value:
                                    election.election_id ??
                                    election.id,
                                label:
                                    election.name ??
                                    election.election_name ??
                                    election.code,
                            })),
                        ]}
                    />

                </div>

                {/* SECONDARY FILTER ROW */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

                    {/* PARTY */}

                    <FilterSelect
                        label="Winning Party"
                        value={filters.party || ""}
                        onChange={(value) =>
                            updateFilter(
                                "party",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label: "All Parties",
                            },
                            ...parties.map((party) => ({
                                value:
                                    party.party_code ??
                                    party.code ??
                                    party.party_name,
                                label:
                                    party.party_name ??
                                    party.name ??
                                    party.party_code,
                            })),
                        ]}
                    />

                    {/* MARGIN */}

                    <FilterSelect
                        label="Margin"
                        value={filters.margin || ""}
                        onChange={(value) =>
                            updateFilter(
                                "margin",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label: "All Margins",
                            },
                            {
                                value: "extremely_marginal",
                                label: "< 500 — Extremely Marginal",
                            },
                            {
                                value: "marginal",
                                label: "500–2,000 — Marginal",
                            },
                            {
                                value: "competitive",
                                label: "2,000–10,000 — Competitive",
                            },
                            {
                                value: "safe",
                                label: "10,000+ — Safe",
                            },
                        ]}
                    />

                    {/* SORT */}

                    <FilterSelect
                        label="Sort By"
                        value={filters.sort || "code"}
                        onChange={(value) =>
                            updateFilter(
                                "sort",
                                value
                            )
                        }
                        options={[
                            {
                                value: "code",
                                label: "Seat Code",
                            },
                            {
                                value: "name",
                                label: "Constituency Name",
                            },
                            {
                                value: "margin",
                                label: "Majority Margin",
                            },
                            {
                                value: "votes",
                                label: "Votes",
                            },
                        ]}
                    />

                </div>

            </div>

        </div>
    );
}


// ============================================================
// SELECT COMPONENT
// ============================================================

function FilterSelect({
    label,
    value,
    onChange,
    options,
}) {

    return (
        <div>

            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#134074]"
            >

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}

            </select>

        </div>
    );
}
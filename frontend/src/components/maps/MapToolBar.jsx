import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { getStates, getElections } from "../../services/api";
import { useMapSearch } from "../../hooks/useMapSearch";
import MapSearchResults from "./MapSearchResults";

const METRICS = [
  { value: "boundaries", label: "Constituency Boundaries" },
  { value: "party", label: "Winning Party" },
  { value: "vote-share", label: "Winner Vote Share" },
  { value: "margin", label: "Majority Margin" },
  { value: "turnout", label: "Voter Turnout" },
  { value: "candidate-density", label: "Candidate Density" },
  { value: "competitiveness", label: "Competitive Seats" },
];

// Used only if GET /api/v1/states or /api/v1/elections fail/aren't ready yet.
const FALLBACK_STATES = [
  { id: "Johor", name: "Johor" },
  { id: "Kedah", name: "Kedah" },
  { id: "Kuala Lumpur", name: "Kuala Lumpur" },
  { id: "Sarawak", name: "Sarawak" },
  { id: "Sabah", name: "Sabah" },
];

const FALLBACK_ELECTIONS = [
  { id: 125, name: "GE-15 (2022)" },
  { id: 124, name: "GE-14 (2018)" },
];

export default function MapToolBar({
  seatType,
  onSeatTypeChange,
  stateFilter,
  onStateChange,
  electionId,
  onElectionChange,
  metric,
  onMetricChange,
  searchQuery,
  onSearchChange,
  // Data used purely for the local search dropdown — the map's own
  // filtered FeatureCollection, not a fresh API request per keystroke.
  searchData,
  onSelectSearchResult,
}) {
  const [states, setStates] = useState(FALLBACK_STATES);
  const [elections, setElections] = useState(FALLBACK_ELECTIONS);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchResults = useMapSearch(searchData, searchQuery);

  useEffect(() => {
    let isMounted = true;

    getStates()
      .then((response) => {
        const list = response?.data ?? response;
        if (isMounted && Array.isArray(list) && list.length) {
          setStates(
            list.map((s) => ({
              id: s.state_name ?? s.name ?? s.id,
              name: s.state_name ?? s.name ?? String(s.id),
            }))
          );
        }
      })
      .catch(() => {
        // Keep fallback list — backend endpoint may not exist yet.
      });

    getElections()
      .then((response) => {
        const list = response?.data ?? response;
        if (isMounted && Array.isArray(list) && list.length) {
          const normalized = list.map((e) => ({
            id: e.election_id ?? e.id,
            name: e.election_name ?? e.name ?? `Election ${e.election_id ?? e.id}`,
          }));
          setElections(normalized);
        }
      })
      .catch(() => {
        // Keep fallback list — backend endpoint may not exist yet.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Default to the most recent election once the real list loads, if the
  // parent hasn't already picked one.
  useEffect(() => {
    if (electionId == null && elections.length) {
      onElectionChange?.(elections[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elections]);

  const handleReset = () => {
    onSeatTypeChange?.("parliament");
    onStateChange?.("all");
    onElectionChange?.(elections[0]?.id ?? null);
    onMetricChange?.("boundaries");
    onSearchChange?.("");
  };

  const handleSelectResult = (feature) => {
    onSelectSearchResult?.(feature);
    onSearchChange?.(feature.properties?.seat_name ?? "");
    setSearchOpen(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xl flex flex-wrap items-center justify-between gap-3 w-full z-40">
      {/* SEARCH BAR */}
      <div className="relative flex-1 min-w-[220px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery ?? ""}
          onChange={(event) => {
            onSearchChange?.(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
          placeholder="Search constituency or district..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#134074] transition shadow-2xs"
        />

        {searchOpen && (
          <MapSearchResults
            results={searchResults}
            query={searchQuery ?? ""}
            onSelect={handleSelectResult}
          />
        )}
      </div>

      {/* FILTER CONTROLS GROUP */}
      <div className="flex flex-wrap items-center gap-2">
        {/* CONSTITUENCY TYPE (Parliament / DUN) */}
        <select
          value={seatType ?? "parliament"}
          onChange={(e) => onSeatTypeChange?.(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#134074] transition cursor-pointer"
        >
          <option value="parliament">Parliament</option>
          <option value="dun">DUN (State)</option>
        </select>

        {/* STATE FILTER */}
        <select
          value={stateFilter ?? "all"}
          onChange={(e) => onStateChange?.(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#134074] transition cursor-pointer"
        >
          <option value="all">All States</option>
          {states.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>

        {/* ELECTION CYCLE */}
        <select
          value={electionId ?? ""}
          onChange={(e) =>
            onElectionChange?.(e.target.value ? Number(e.target.value) : null)
          }
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#134074] transition cursor-pointer"
        >
          {elections.map((el) => (
            <option key={el.id} value={el.id}>
              {el.name}
            </option>
          ))}
        </select>

        {/* INTELLIGENCE METRIC */}
        <div className="relative flex items-center">
          <SlidersHorizontal size={13} className="absolute left-3 text-slate-400 pointer-events-none" />
          <select
            value={metric ?? "boundaries"}
            onChange={(e) => onMetricChange?.(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-[#0b2545] focus:outline-none focus:border-[#134074] transition cursor-pointer"
          >
            {METRICS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* RESET FILTERS BUTTON */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100 cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

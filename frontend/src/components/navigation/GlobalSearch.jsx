import {
  Search,
  MapPin,
  User,
  Vote,
  CalendarDays,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useGlobalSearch,
} from "../../hooks/useGlobalSearch";

export default function GlobalSearch({
  open,
  onClose,
}) {
  const navigate =
    useNavigate();

  const {
    query,
    setQuery,
    results,
    loading,
  } = useGlobalSearch();

  if (!open) {
    return null;
  }

  function getIcon(type) {
    switch (type) {
      case "constituency":
        return MapPin;

      case "candidate":
        return User;

      case "party":
        return Vote;

      case "election":
        return CalendarDays;

      default:
        return Search;
    }
  }

  function handleSelect(result) {
    navigate(
      result.path
    );

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex justify-center pt-[10vh]">

      <div className="w-full max-w-2xl mx-4">

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">

          {/* SEARCH INPUT */}

          <div className="flex items-center gap-3 px-4 border-b border-slate-200">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              autoFocus
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search constituencies, candidates, parties, elections..."
              className="flex-1 py-4 text-sm text-slate-800 outline-none"
            />

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={18} />
            </button>

          </div>


          {/* RESULTS */}

          <div className="max-h-[420px] overflow-y-auto">

            {!query && (
              <div className="p-6 text-sm text-slate-500">
                Search across MEIS electoral intelligence.
              </div>
            )}


            {loading && (
              <div className="p-6 text-sm text-slate-500">
                Searching...
              </div>
            )}


            {!loading &&
              query &&
              results.length === 0 && (
                <div className="p-6 text-sm text-slate-500">
                  No matching results found.
                </div>
              )}


            {!loading &&
              results.map(
                (
                  result,
                  index
                ) => {
                  const Icon =
                    getIcon(
                      result.type
                    );

                  return (
                    <button
                      key={`${result.type}-${index}`}
                      onClick={() =>
                        handleSelect(
                          result
                        )
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0"
                    >

                      <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center">

                        <Icon
                          size={16}
                          className="text-[#134074]"
                        />

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {result.title}
                        </p>

                        <p className="text-xs text-slate-500">
                          {result.subtitle}
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

          </div>

        </div>

      </div>

    </div>
  );
}
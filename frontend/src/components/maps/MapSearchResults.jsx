import { MapPin } from "lucide-react";

export default function MapSearchResults({ results = [], onSelect, query = "" }) {
  if (!query.trim()) {
    return null;
  }

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto"
      // Prevent the input's onBlur from closing the dropdown before the
      // click on a result has a chance to register.
      onMouseDown={(event) => event.preventDefault()}
    >
      {results.length === 0 ? (
        <div className="px-4 py-3 text-xs text-slate-500">
          No constituencies match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {results.map((feature) => {
            const p = feature.properties ?? {};
            const key = p.seat_code ?? feature.id;

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect?.(feature)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition cursor-pointer"
                >
                  <MapPin size={14} className="text-[#134074] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {p.seat_code ? `${p.seat_code} — ` : ""}
                      {p.seat_name ?? "Unknown Constituency"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {p.state_name ?? "N/A"}
                      {p.dominant_party && p.dominant_party !== "N/A"
                        ? ` · ${p.dominant_party}`
                        : ""}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

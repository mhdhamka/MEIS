import {
  PARTY_LEGEND_ENTRIES,
  MARGIN_BANDS,
  VOTE_SHARE_BANDS,
  TURNOUT_BANDS,
  CANDIDATE_DENSITY_BANDS,
  COMPETITIVENESS_COLORS,
} from "../../utils/electoral";

const LEGEND_CONFIG = {
  boundaries: {
    title: "Constituency Boundaries",
    entries: [{ label: "Boundary", color: "#134074" }],
  },
  party: {
    title: "Winning Party",
    entries: PARTY_LEGEND_ENTRIES,
  },
  "vote-share": {
    title: "Winner Vote Share",
    entries: VOTE_SHARE_BANDS.map((b) => ({ label: b.label, color: b.color })),
  },
  margin: {
    title: "Majority Margin",
    entries: MARGIN_BANDS.map((b) => ({ label: b.label, color: b.color })),
  },
  turnout: {
    title: "Voter Turnout",
    entries: TURNOUT_BANDS.map((b) => ({ label: b.label, color: b.color })),
  },
  "candidate-density": {
    title: "Candidate Density",
    entries: CANDIDATE_DENSITY_BANDS.map((b) => ({ label: b.label, color: b.color })),
  },
  competitiveness: {
    title: "Competitive Seats",
    entries: Object.entries(COMPETITIVENESS_COLORS).map(([label, color]) => ({
      label: label.replace("-", " "),
      color,
    })),
  },
};

export default function MapLegend({ metric = "boundaries" }) {
  const config = LEGEND_CONFIG[metric] ?? LEGEND_CONFIG.boundaries;

  return (
    <div className="absolute bottom-4 left-4 z-[999] bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-xl px-3.5 py-3 max-w-[210px]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
        {config.title}
      </p>
      <ul className="space-y-1.5">
        {config.entries.map((entry) => (
          <li key={entry.label} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm shrink-0 border border-black/10"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[11px] font-medium text-slate-700 capitalize leading-tight">
              {entry.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

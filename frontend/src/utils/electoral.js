// ============================================================
// ELECTORAL UTILITIES
//
// Single source of truth for:
//   - seat code / state name normalization
//   - choropleth color scales
//   - feature style resolution (metric -> Leaflet style)
//
// ConstituencyLayer.jsx and MapLegend.jsx both import from here
// so the map and the legend can NEVER drift out of sync.
// ============================================================

// ------------------------------------------------------------
// NORMALIZATION
// ------------------------------------------------------------

// IMPORTANT: never strip the "P" / "N" prefix LETTER.
// P001 (Parliament) and N001 (DUN) are different entities.
//
// Strips every non-alphanumeric character (dots, dashes, underscores,
// spaces) rather than just some of them. GeoJSON boundary files and
// hand-maintained MySQL seed data frequently disagree on punctuation
// for the exact same seat ("P.194" vs "P194" vs "P-194"), and any gap
// here silently breaks every join between geometry and analytics.
export function normalizeSeatCode(code) {
  if (code === undefined || code === null) return "";
  return String(code)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .trim();
}

export function normalizeStateName(name) {
  if (!name) return "";
  return String(name).toLowerCase().replace(/\s+/g, " ").trim();
}

// ------------------------------------------------------------
// PARTY / COALITION COLORS
// ------------------------------------------------------------

const PARTY_COLOR_RULES = [
  { test: (p) => /GPS|PBB|SUPP|PRS|PDP/.test(p), color: "#ffb703", label: "GPS" },
  { test: (p) => /\bPH\b|PKR|DAP|AMANAH/.test(p), color: "#1d4ed8", label: "PH" },
  { test: (p) => /\bPN\b|PAS|BERSATU|GERAKAN/.test(p), color: "#0ea5e9", label: "PN" },
  { test: (p) => /\bBN\b|UMNO|MCA|MIC/.test(p), color: "#dc2626", label: "BN" },
  { test: (p) => /GRS/.test(p), color: "#059669", label: "GRS" },
  { test: (p) => /WARISAN/.test(p), color: "#7c3aed", label: "Warisan" },
  { test: (p) => /\bIND\b|BEBAS/.test(p), color: "#475569", label: "Independent" },
];

export const PARTY_LEGEND_ENTRIES = [
  ...PARTY_COLOR_RULES.map((r) => ({ label: r.label, color: r.color })),
  { label: "Other / Unmapped", color: "#64748b" },
];

export function getPartyColor(rawParty) {
  const party = String(rawParty ?? "").trim().toUpperCase();
  const match = PARTY_COLOR_RULES.find((rule) => rule.test(party));
  return match ? match.color : "#64748b";
}

export function getPartyStyle(party) {
  return {
    fillColor: getPartyColor(party),
    color: "#ffffff",
    weight: 1.5,
    dashArray: "3",
    fillOpacity: 0.75,
  };
}

// ------------------------------------------------------------
// MAJORITY MARGIN
// ------------------------------------------------------------

export const MARGIN_BANDS = [
  { max: 500, color: "#dc2626", label: "< 500 (ultra-marginal)" },
  { max: 2000, color: "#f97316", label: "500 – 2,000 (marginal)" },
  { max: 10000, color: "#eab308", label: "2,000 – 10,000 (competitive)" },
  { max: Infinity, color: "#16a34a", label: "10,000+ (safe)" },
];

export function getMarginColor(margin) {
  const value = Number(margin ?? 0);
  return MARGIN_BANDS.find((band) => value < band.max)?.color ?? "#16a34a";
}

export function classifyCompetitiveness(margin) {
  const value = Number(margin ?? 0);
  if (value < 500) return "ultra-marginal";
  if (value < 2000) return "marginal";
  if (value < 10000) return "competitive";
  return "safe";
}

export const COMPETITIVENESS_COLORS = {
  "ultra-marginal": "#dc2626",
  marginal: "#f97316",
  competitive: "#eab308",
  safe: "#16a34a",
};

export function getCompetitivenessColor(margin) {
  return COMPETITIVENESS_COLORS[classifyCompetitiveness(margin)];
}

// ------------------------------------------------------------
// VOTE SHARE
// ------------------------------------------------------------

export const VOTE_SHARE_BANDS = [
  { min: 70, color: "#082f49", label: "70%+" },
  { min: 60, color: "#075985", label: "60 – 70%" },
  { min: 50, color: "#0284c7", label: "50 – 60%" },
  { min: 40, color: "#38bdf8", label: "40 – 50%" },
  { min: 0, color: "#bae6fd", label: "< 40%" },
];

export function getVoteShareColor(percentage) {
  const value = Number(percentage ?? 0);
  return VOTE_SHARE_BANDS.find((band) => value >= band.min)?.color ?? "#bae6fd";
}

// ------------------------------------------------------------
// TURNOUT
// ------------------------------------------------------------

export const TURNOUT_BANDS = [
  { min: 80, color: "#14532d", label: "80%+" },
  { min: 70, color: "#16a34a", label: "70 – 80%" },
  { min: 60, color: "#84cc16", label: "60 – 70%" },
  { min: 50, color: "#eab308", label: "50 – 60%" },
  { min: 0, color: "#f97316", label: "< 50%" },
];

export function getTurnoutColor(turnout) {
  const value = Number(turnout ?? 0);
  return TURNOUT_BANDS.find((band) => value >= band.min)?.color ?? "#f97316";
}

// ------------------------------------------------------------
// CANDIDATE DENSITY
// ------------------------------------------------------------

export const CANDIDATE_DENSITY_BANDS = [
  { min: 6, color: "#4c1d95", label: "6+ candidates" },
  { min: 4, color: "#7c3aed", label: "4 – 5 candidates" },
  { min: 2, color: "#a78bfa", label: "2 – 3 candidates" },
  { min: 0, color: "#ddd6fe", label: "1 candidate" },
];

export function getCandidateDensityColor(count) {
  const value = Number(count ?? 0);
  return (
    CANDIDATE_DENSITY_BANDS.find((band) => value >= band.min)?.color ??
    "#ddd6fe"
  );
}

// ------------------------------------------------------------
// BOUNDARY (DEFAULT)
// ------------------------------------------------------------

export function getBoundaryStyle() {
  return {
    fillColor: "#134074",
    color: "#ffffff",
    weight: 1.5,
    dashArray: "3",
    fillOpacity: 0.65,
  };
}

// ------------------------------------------------------------
// METRIC -> STYLE RESOLUTION
//
// This is the ONLY place that should decide how a metric maps
// to a Leaflet style object. ConstituencyLayer just calls this.
// ------------------------------------------------------------

export function getFeatureStyle(feature, metric) {
  const p = feature?.properties ?? {};
  const base = { color: "#ffffff", weight: 1.5, dashArray: "3" };

  switch (metric) {
    case "party":
      return {
        ...base,
        fillColor: getPartyColor(
          p.dominant_party ?? p.party ?? p.coalition
        ),
        fillOpacity: 0.75,
      };

    case "vote-share":
      return {
        ...base,
        fillColor: getVoteShareColor(p.vote_share),
        fillOpacity: 0.78,
      };

    case "margin":
      return {
        ...base,
        fillColor: getMarginColor(p.majority ?? p.margin),
        fillOpacity: 0.78,
      };

    case "turnout":
      return {
        ...base,
        fillColor: getTurnoutColor(p.turnout),
        fillOpacity: 0.78,
      };

    case "candidate-density":
      return {
        ...base,
        fillColor: getCandidateDensityColor(p.candidate_count),
        fillOpacity: 0.78,
      };

    case "competitiveness":
      return {
        ...base,
        fillColor: getCompetitivenessColor(p.majority ?? p.margin),
        fillOpacity: 0.78,
      };

    case "boundaries":
    default:
      return getBoundaryStyle();
  }
}

export function getHoverStyle() {
  return { weight: 3, color: "#ffb703", fillOpacity: 0.85 };
}

// Deliberately a different color from the hover style (amber) so a
// user can tell "this is what I'm pointing at" apart from "this is
// what I clicked" even when they're the same polygon.
export function getSelectedStyle() {
  return { weight: 4, color: "#22d3ee", dashArray: null, fillOpacity: 0.9 };
}

// ------------------------------------------------------------
// ELECTION RESULTS MERGE
//
// Merges the small, geometry-free payload from
// GET /api/v1/map/results into a FeatureCollection that is
// already cached (by useGeoSpatialData). This is what lets the
// map update its analytics when `electionId` changes WITHOUT
// ever refetching or reprocessing the GeoJSON itself.
// ------------------------------------------------------------

export function mergeElectionResults(data, resultsBySeat) {
  if (!data?.features?.length || !resultsBySeat || resultsBySeat.size === 0) {
    return data;
  }

  let matchedCount = 0;

  const features = data.features.map((feature) => {
    const key = normalizeSeatCode(feature.properties?.seat_code);
    const result = resultsBySeat.get(key);

    if (!result) {
      return feature;
    }

    matchedCount += 1;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        winner_name: result.winner_name ?? feature.properties.winner_name,
        dominant_party: result.party_name ?? feature.properties.dominant_party,
        winner_votes: result.votes ?? feature.properties.winner_votes,
        vote_share: result.vote_share ?? feature.properties.vote_share,
        majority: result.margin ?? feature.properties.majority,
        turnout: result.turnout ?? feature.properties.turnout,
        candidate_count:
          result.candidate_count ?? feature.properties.candidate_count,
        // Real per-seat votes cast, from the election_results merge —
        // NOT the state-wide aggregate useGeoSpatialData used to stamp
        // onto every seat (see git history: that was the bug where
        // every seat in a state showed the identical vote total).
        total_votes: result.total_votes ?? feature.properties.total_votes,
      },
    };
  });

  // If the API returned results but literally none of them matched any
  // feature, that's almost always a seat_code convention mismatch
  // between the GeoJSON source and the database (e.g. one side using
  // "P.194", the other "P194"). Surface it loudly instead of leaving
  // every field silently stuck on "N/A".
  if (matchedCount === 0) {
    console.warn(
      "[mergeElectionResults] 0 matches between",
      data.features.length,
      "GeoJSON features and",
      resultsBySeat.size,
      "API result rows. Sample GeoJSON seat_code:",
      data.features[0]?.properties?.seat_code,
      "-> normalized:",
      normalizeSeatCode(data.features[0]?.properties?.seat_code),
      "| Sample API seat_code (normalized):",
      [...resultsBySeat.keys()][0]
    );
  }

  return {
    ...data,
    features,
  };
}

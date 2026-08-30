import { useState, useEffect } from "react";
import { getMapResults } from "../services/api";
import { normalizeSeatCode } from "../utils/electoral";

// ============================================================
// useMapResults
//
// Fetches the lightweight, geometry-free per-seat analytics for
// a given election (winner, party, votes, vote_share, margin,
// candidate_count) and returns them as a Map keyed by normalized
// seat_code, ready to hand to mergeElectionResults().
//
// Cached per (election, seatType, state) combination for the
// session — flipping back to a previously-viewed election is
// instant and makes zero network requests.
// ============================================================

const resultsCache = new Map();

function cacheKeyFor(electionId, seatType, state) {
  return `${electionId ?? "latest"}::${seatType ?? "all"}::${state ?? "all"}`;
}

export function useMapResults(electionId, seatType = "parliament", state = null) {
  const cacheKey = cacheKeyFor(electionId, seatType, state);

  const [resultsBySeat, setResultsBySeat] = useState(
    () => resultsCache.get(cacheKey) ?? new Map()
  );
  const [loading, setLoading] = useState(!resultsCache.has(cacheKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (resultsCache.has(cacheKey)) {
      setResultsBySeat(resultsCache.get(cacheKey));
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    getMapResults({ electionId, seatType, state })
      .then((response) => {
        const rows = response?.results ?? [];
        const bySeat = new Map();

        rows.forEach((row) => {
          const key = normalizeSeatCode(row.seat_code);
          if (key) bySeat.set(key, row);
        });

        resultsCache.set(cacheKey, bySeat);

        if (isMounted) {
          setResultsBySeat(bySeat);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Map results error:", err);
        if (isMounted) {
          setError(err.message ?? "Failed to load election results");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, electionId, seatType, state]);

  return { resultsBySeat, loading, error };
}

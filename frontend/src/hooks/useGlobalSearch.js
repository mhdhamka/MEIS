/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  getSeats,
  getCandidates,
  getParties,
  getElections,
} from "../services/api";

export function useGlobalSearch() {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout =
      setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);

          const [
            seatsResponse,
            candidatesResponse,
            partiesResponse,
            electionsResponse,
          ] = await Promise.all([
            getSeats(),
            getCandidates(),
            getParties(),
            getElections(),
          ]);

          const seats =
            seatsResponse.data ??
            seatsResponse ??
            [];

          const candidates =
            candidatesResponse.data ??
            candidatesResponse ??
            [];

          const parties =
            partiesResponse.data ??
            partiesResponse ??
            [];

          const elections =
            electionsResponse.data ??
            electionsResponse ??
            [];

          const normalizedQuery =
            query
              .toLowerCase()
              .trim();

          const seatResults =
            seats
              .filter((seat) => {
                return (
                  seat.seat_name
                    ?.toLowerCase()
                    .includes(
                      normalizedQuery
                    ) ||
                  seat.seat_code
                    ?.toLowerCase()
                    .includes(
                      normalizedQuery
                    )
                );
              })
              .slice(0, 5)
              .map((seat) => ({
                type: "constituency",
                title:
                  `${seat.seat_code} ${seat.seat_name}`,
                subtitle:
                  seat.state_name,
                path:
                  `/constituencies/${seat.seat_code}`,
              }));

          const candidateResults =
            candidates
              .filter((candidate) =>
                candidate.candidate_name
                  ?.toLowerCase()
                  .includes(
                    normalizedQuery
                  )
              )
              .slice(0, 5)
              .map((candidate) => ({
                type: "candidate",
                title:
                  candidate.candidate_name,
                subtitle:
                  candidate.party_name,
                path:
                  `/candidates/${candidate.candidate_id}`,
              }));

          const partyResults =
            parties
              .filter((party) =>
                party.party_name
                  ?.toLowerCase()
                  .includes(
                    normalizedQuery
                  )
              )
              .slice(0, 5)
              .map((party) => ({
                type: "party",
                title:
                  party.party_name,
                subtitle:
                  "Political Party",
                path:
                  `/parties/${party.party_id}`,
              }));

          const electionResults =
            elections
              .filter((election) =>
                election.election_name
                  ?.toLowerCase()
                  .includes(
                    normalizedQuery
                  )
              )
              .slice(0, 5)
              .map((election) => ({
                type: "election",
                title:
                  election.election_name,
                subtitle:
                  `${election.election_year}`,
                path:
                  `/elections/${election.election_id}`,
              }));

          setResults([
            ...seatResults,
            ...candidateResults,
            ...partyResults,
            ...electionResults,
          ]);

        } catch (err) {
          setError(
            err.message
          );
        } finally {
          setLoading(false);
        }
      }, 300);

    return () => {
      clearTimeout(timeout);
    };

  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}
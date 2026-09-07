import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getElections,
    getElectionResults,
    getElectionPartyPerformance,
    getElectionSeatCounts,
    getElectionStatePerformance
} from "../services/api";


function extractArray(response) {
    if (Array.isArray(response)) {
        return response;
    }

    return response?.data ?? [];
}


export function useElectionData(
    selectedElectionId
) {
    const [elections, setElections] =
        useState([]);

    const [results, setResults] =
        useState([]);

    const [partyPerformance, setPartyPerformance] =
        useState([]);

    const [seatCounts, setSeatCounts] =
        useState([]);

    const [statePerformance, setStatePerformance] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // ============================================================
    // LOAD ELECTION CATALOGUE
    // ============================================================

    const loadElections =
        useCallback(async () => {
            const response =
                await getElections();

            const data =
                extractArray(response);

            setElections(data);

            return data;
        }, []);


    // ============================================================
    // LOAD SELECTED ELECTION
    // ============================================================

    const loadElectionData =
        useCallback(
            async (electionId) => {

                if (!electionId) {
                    return;
                }

                const [
                    resultsResponse,
                    partyResponse,
                    seatCountResponse,
                    stateResponse
                ] = await Promise.all([
                    getElectionResults(
                        electionId
                    ),

                    getElectionPartyPerformance(
                        electionId
                    ),

                    getElectionSeatCounts(
                        electionId
                    ),

                    getElectionStatePerformance(
                        electionId
                    )
                ]);


                setResults(
                    extractArray(
                        resultsResponse
                    )
                );

                setPartyPerformance(
                    extractArray(
                        partyResponse
                    )
                );

                setSeatCounts(
                    extractArray(
                        seatCountResponse
                    )
                );

                setStatePerformance(
                    extractArray(
                        stateResponse
                    )
                );
            },
            []
        );


    // ============================================================
    // INITIAL / REFRESH
    // ============================================================

    const reload =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                await loadElections();

                if (selectedElectionId) {
                    await loadElectionData(
                        selectedElectionId
                    );
                }

            } catch (err) {
                console.error(
                    "Election data error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load election data."
                );

            } finally {
                setLoading(false);
            }
        }, [
            loadElections,
            loadElectionData,
            selectedElectionId
        ]);


    useEffect(() => {
        let isMounted = true;

        async function initData() {
            try {
                setLoading(true);
                setError(null);

                const electionsData = await loadElections();
                
                // Determine active election to fetch if not passed down cleanly yet
                const activeId = selectedElectionId || electionsData?.[0]?.election_id;

                if (activeId) {
                    await loadElectionData(activeId);
                }
            } catch (err) {
                console.error("Election initialization error:", err);
                if (isMounted) {
                    setError(err.message || "Failed to load election data.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        initData();

        return () => {
            isMounted = false;
        };
    }, [selectedElectionId, loadElections, loadElectionData]);


    // ============================================================
    // SELECTED ELECTION
    // ============================================================

    const selectedElection =
        useMemo(() => {

            return elections.find(
                (election) =>
                    Number(
                        election.election_id
                    ) ===
                    Number(
                        selectedElectionId
                    )
            ) ?? null;

        }, [
            elections,
            selectedElectionId
        ]);


    // ============================================================
    // SUMMARY
    // ============================================================

    const summary =
        useMemo(() => {

            const seatIds =
                new Set();

            const candidateIds =
                new Set();

            let totalVotes = 0;


            results.forEach(
                (result) => {

                    if (
                        result.seat_id !==
                        undefined
                    ) {
                        seatIds.add(
                            result.seat_id
                        );
                    }

                    if (
                        result.candidate_id !==
                        undefined
                    ) {
                        candidateIds.add(
                            result.candidate_id
                        );
                    }

                    totalVotes +=
                        Number(
                            result.total_votes ??
                            0
                        );
                }
            );


            const dominantParty =
                seatCounts.length > 0
                    ? seatCounts[0]
                    : null;


            return {
                seats:
                    seatIds.size,

                candidates:
                    candidateIds.size,

                totalVotes,

                turnout:
                    selectedElection?.turnout ??
                    selectedElection?.turnout_rate ??
                    null,

                registeredVoters:
                    selectedElection?.registered_voters ??
                    null,

                dominantParty:
                    dominantParty?.party_name ??
                    null,

                dominantPartySeats:
                    Number(
                        dominantParty?.seats_won ??
                        0
                    )
            };

        }, [
            results,
            seatCounts,
            selectedElection
        ]);


    return {
        elections,
        selectedElection,
        results,
        partyPerformance,
        seatCounts,
        statePerformance,
        summary,
        loading,
        error,

        reload
    };
}
import { useEffect, useMemo, useState, useRef } from "react";
import { api } from "../services/api";

function unwrap(payload) {
    if (payload?.data !== undefined) {
        return payload.data;
    }
    return payload;
}

function asArray(payload) {
    const value = unwrap(payload);
    return Array.isArray(value) ? value : [];
}

function firstDefined(...values) {
    return values.find(
        (value) =>
            value !== undefined &&
            value !== null &&
            value !== ""
    );
}

function normalizeText(value) {
    if (value === undefined || value === null) {
        return "";
    }
    return String(value).trim().toLowerCase();
}

function normalizeSeatCode(value) {
    if (!value) {
        return "";
    }
    return String(value)
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/_/g, "-");
}

function isResultWinner(item) {
    const resText = normalizeText(
        item.result || item.status || item.outcome || item.result_status
    );
    return (
        item.is_winner === true ||
        item.isWinner === true ||
        item.winner === true ||
        item.is_winner === 1 ||
        item.winner === 1 ||
        resText === "win" ||
        resText === "winner" ||
        resText === "won" ||
        resText === "w" ||
        resText === "1"
    );
}

function normalizeCandidate(candidate, index) {
    const candidateId = firstDefined(
        candidate.candidate_id,
        candidate.candidateId,
        candidate.id,
        candidate.CandidateID,
        candidate.CANDIDATE_ID
    );

    const name = firstDefined(
        candidate.candidate_name,
        candidate.candidateName,
        candidate.name,
        candidate.full_name,
        candidate.fullName,
        candidate.CandidateName,
        candidate.CANDIDATE_NAME,
        "Unknown Candidate"
    );

    const party = firstDefined(
        candidate.party_name,
        candidate.partyName,
        candidate.party,
        candidate.party_code,
        candidate.partyCode,
        candidate.PartyName,
        candidate.PARTY,
        "Independent / Unknown"
    );

    const seatCode = firstDefined(
        candidate.seat_code,
        candidate.seatCode,
        candidate.code_parlimen,
        candidate.code_dun,
        candidate.seat,
        candidate.constituency_code
    );

    const seatName = firstDefined(
        candidate.seat_name,
        candidate.seatName,
        candidate.constituency_name,
        candidate.constituencyName,
        candidate.seat_label,
        candidate.parlimen,
        candidate.dun,
        "Unknown Constituency"
    );

    const state = firstDefined(
        candidate.state_name,
        candidate.stateName,
        candidate.state,
        candidate.STATE,
        "Unknown State"
    );

    const votes = Number(
        firstDefined(
            candidate.votes,
            candidate.vote_count,
            candidate.voteCount,
            candidate.votes_received,
            candidate.valid_votes,
            0
        )
    );

    const voteShare = Number(
        firstDefined(
            candidate.vote_share,
            candidate.voteShare,
            candidate.vote_percentage,
            candidate.votePercentage,
            0
        )
    );

    const margin = Number(
        firstDefined(
            candidate.margin,
            candidate.majority,
            candidate.winning_margin,
            0
        )
    );

    const electionId = firstDefined(
        candidate.election_id,
        candidate.electionId,
        candidate.election,
        candidate.election_code
    );

    const electionName = firstDefined(
        candidate.election_name,
        candidate.electionName,
        candidate.election_label,
        candidate.election,
        electionId,
        "Unknown Election"
    );

    const result = firstDefined(
        candidate.result,
        candidate.status,
        candidate.outcome,
        candidate.result_status
    );

    const isWinner = isResultWinner(candidate);

    return {
        ...candidate,
        _index: index,
        candidateId: candidateId !== undefined ? String(candidateId) : `candidate-${index}`,
        name: String(name),
        party: String(party),
        seatCode: seatCode !== undefined ? String(seatCode) : "",
        normalizedSeatCode: normalizeSeatCode(seatCode),
        seatName: String(seatName),
        state: String(state),
        votes: Number.isFinite(votes) ? votes : 0,
        voteShare: Number.isFinite(voteShare) ? voteShare : 0,
        margin: Number.isFinite(margin) ? margin : 0,
        electionId: electionId !== undefined ? String(electionId) : "",
        electionName: String(electionName),
        result: isWinner ? "WIN" : result ? String(result).toUpperCase() : "LOSS",
        isWinner,
    };
}

function normalizeResult(result, index) {
    const candidateId = firstDefined(
        result.candidate_id,
        result.candidateId,
        result.CandidateID,
        result.candidate
    );

    const candidateName = firstDefined(
        result.candidate_name,
        result.candidateName,
        result.CandidateName,
        result.name
    );

    const electionId = firstDefined(
        result.election_id,
        result.electionId,
        result.election,
        result.election_code
    );

    const seatCode = firstDefined(
        result.seat_code,
        result.seatCode,
        result.code_parlimen,
        result.code_dun,
        result.seat
    );

    const votes = Number(
        firstDefined(
            result.votes,
            result.vote_count,
            result.votes_received,
            0
        )
    );

    const voteShare = Number(
        firstDefined(
            result.vote_share,
            result.voteShare,
            result.vote_percentage,
            0
        )
    );

    const margin = Number(
        firstDefined(
            result.margin,
            result.majority,
            result.winning_margin,
            0
        )
    );

    const isWinner = isResultWinner(result);

    return {
        ...result,
        _index: index,
        candidateId: candidateId !== undefined ? String(candidateId) : "",
        candidateName: candidateName !== undefined ? String(candidateName) : "",
        electionId: electionId !== undefined ? String(electionId) : "",
        seatCode: seatCode !== undefined ? String(seatCode) : "",
        normalizedSeatCode: normalizeSeatCode(seatCode),
        votes: Number.isFinite(votes) ? votes : 0,
        voteShare: Number.isFinite(voteShare) ? voteShare : 0,
        margin: Number.isFinite(margin) ? margin : 0,
        isWinner,
    };
}

function getCandidateKey(candidate) {
    if (candidate.candidateId) {
        return candidate.candidateId;
    }
    return [normalizeText(candidate.name), normalizeText(candidate.party)].join("|");
}

function calculateCandidateStatistics(history, candidateFallback = {}) {
    const items = history && history.length > 0 ? history : [candidateFallback];
    const contested = items.length;

    const wins = items.filter((item) => isResultWinner(item)).length;
    const losses = Math.max(0, contested - wins);
    const winRate = contested > 0 ? (wins / contested) * 100 : 0;
    const totalVotes = items.reduce((sum, item) => sum + Number(item.votes || 0), 0);
    const averageVoteShare = contested > 0 ? items.reduce((sum, item) => sum + Number(item.voteShare || 0), 0) / contested : 0;
    const averageMargin = contested > 0 ? items.reduce((sum, item) => sum + Number(item.margin || 0), 0) / contested : 0;

    return {
        contested,
        wins,
        losses,
        winRate,
        totalVotes,
        averageVoteShare,
        averageMargin,
    };
}

export function useCandidateData(candidateId = null, initialFilters = {}) {
    const [candidatesRaw, setCandidatesRaw] = useState([]);
    const [resultsRaw, setResultsRaw] = useState([]);
    const [elections, setElections] = useState([]);
    const [parties, setParties] = useState([]);
    const [seats, setSeats] = useState([]);
    const [states, setStates] = useState([]);
    
    const [filters, setFilters] = useState(initialFilters);
    const filterKey = JSON.stringify(initialFilters || {});
    
    const prevFilterKeyRef = useRef(filterKey);

    useEffect(() => {
        if (prevFilterKeyRef.current !== filterKey) {
            prevFilterKeyRef.current = filterKey;
            setFilters(initialFilters);
        }
    }, [filterKey, initialFilters]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const cleanFilters = {};
                if (filters) {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== "" && value !== "all") {
                            cleanFilters[key] = value;
                        }
                    });
                }

                if (!cleanFilters.limit) {
                    cleanFilters.limit = 1000;
                }

                const [
                    candidatesResponse,
                    resultsResponse,
                    electionsResponse,
                    partiesResponse,
                    seatsResponse,
                    statesResponse,
                ] = await Promise.all([
                    api.getCandidates(cleanFilters),
                    api.getResults(),
                    api.getElections(),
                    api.getParties(),
                    api.getSeats(),
                    api.getStates().catch(() => []),
                ]);

                if (!mounted) return;

                let candidatesList = asArray(candidatesResponse);

                if (candidateId) {
                    const targetId = String(candidateId);
                    const alreadyIncluded = candidatesList.some((item) => {
                        const normalizedItem = normalizeCandidate(item, 0);
                        return String(normalizedItem.candidateId) === targetId;
                    });

                    if (!alreadyIncluded) {
                        try {
                            const singleResponse = await api.getCandidate(candidateId);
                            const singleCandidate = unwrap(singleResponse);
                            if (singleCandidate && mounted) {
                                candidatesList = [...candidatesList, singleCandidate];
                            }
                        } catch (singleErr) {
                            console.warn(`Candidate ID ${candidateId} could not be fetched directly.`);
                        }
                    }
                }

                if (!mounted) return;

                setCandidatesRaw(candidatesList);
                setResultsRaw(asArray(resultsResponse));
                setElections(asArray(electionsResponse));
                setParties(asArray(partiesResponse));
                setSeats(asArray(seatsResponse));
                setStates(asArray(statesResponse));
            } catch (err) {
                if (!mounted) return;
                console.error("Candidate data error:", err);
                setError(err.message || "Failed to load candidate data.");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, [filterKey, filters, candidateId]);

    const candidates = useMemo(() => {
        return candidatesRaw.map(normalizeCandidate);
    }, [candidatesRaw]);

    const results = useMemo(() => {
        return resultsRaw.map(normalizeResult);
    }, [resultsRaw]);

    const directory = useMemo(() => {
        const map = new Map();

        for (const candidate of candidates) {
            const key = getCandidateKey(candidate);
            if (!map.has(key)) {
                map.set(key, { ...candidate, history: [] });
            }
            if (candidate.electionId || candidate.result_status) {
                map.get(key).history.push(candidate);
            }
        }

        for (const result of results) {
            let key = result.candidateId;

            if (!key && result.candidateName) {
                const matchingCandidate = candidates.find(
                    (candidate) => normalizeText(candidate.name) === normalizeText(result.candidateName)
                );
                if (matchingCandidate) {
                    key = getCandidateKey(matchingCandidate);
                }
            }

            if (!key) continue;

            if (!map.has(key)) {
                map.set(key, {
                    candidateId: key,
                    name: result.candidateName || "Unknown Candidate",
                    party: result.party || "Unknown Party",
                    seatCode: result.seatCode || "",
                    seatName: result.seatName || "Unknown Constituency",
                    state: result.state || "Unknown State",
                    history: [],
                });
            }

            const existingHistory = map.get(key).history;
            const alreadyExists = existingHistory.some(h => String(h.electionId) === String(result.electionId) && String(h.seatCode) === String(result.seatCode));
            if (!alreadyExists) {
                existingHistory.push(result);
            }
        }

        let finalArray = Array.from(map.values()).map((candidate) => {
            const history = candidate.history || [];
            const latest = history.length > 0 ? history[history.length - 1] : candidate;
            const statistics = calculateCandidateStatistics(history, candidate);

            return {
                ...candidate,
                party: candidate.party || latest.party || "Unknown Party",
                seatCode: candidate.seatCode || latest.seatCode || "",
                seatName: candidate.seatName || latest.seatName || "Unknown Constituency",
                state: candidate.state || latest.state || "Unknown State",
                latestResult: latest,
                history,
                ...statistics,
            };
        });

        if (filters.result && filters.result !== "all") {
            finalArray = finalArray.filter((c) => c.result === filters.result);
        }

        return finalArray;
    }, [candidates, results, filters.result]);

    const selectedCandidate = useMemo(() => {
        if (!candidateId) return null;
        const id = String(candidateId);
        return directory.find((candidate) => String(candidate.candidateId) === id) || null;
    }, [candidateId, directory]);

    const partyBreakdown = useMemo(() => {
        const map = new Map();

        for (const candidate of directory) {
            const party = candidate.party || "Unknown";
            if (!map.has(party)) {
                map.set(party, { party, candidates: 0, wins: 0 });
            }
            const item = map.get(party);
            item.candidates += 1;
            item.wins += candidate.wins;
        }

        return Array.from(map.values())
            .map((item) => ({
                ...item,
                winRate: item.candidates > 0 ? (item.wins / item.candidates) * 100 : 0,
            }))
            .sort((a, b) => b.candidates - a.candidates);
    }, [directory]);

    return {
        candidates: directory,
        selectedCandidate,
        results,
        elections,
        parties,
        seats,
        states,
        partyBreakdown,
        loading,
        error,
        filters,
        setFilters,
    };
}
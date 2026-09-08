const API_BASE_URL = "http://localhost:8000/api/v1";

async function request(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error(`[MEIS API] ${endpoint}`, error);
        throw error;
    }
}

function normalizeData(response) {
    if (Array.isArray(response)) {
        return response;
    }

    return response?.data ?? [];
}

// ============================================================
// SYSTEM
// ============================================================

export function getHealth() {
    return fetch("http://localhost:8000/health").then((response) =>
        response.json()
    );
}

// ============================================================
// STATES, ELECTIONS, SEATS, CANDIDATES, PARTIES, RESULTS
// ============================================================

export function getStates() {
    return request("/states/");
}

export async function getElections() {
    const response = await request("/elections/");
    return normalizeData(response);
}

export async function getElection(electionId) {
    const response = await request(`/elections/${electionId}`);
    return response?.data ?? response;
}

export function getSeats() {
    return request("/seats/");
}

export function getCandidates() {
    return request("/candidates/");
}

export function getParties() {
    return request("/parties/");
}

export function getResults() {
    return request("/results/");
}

// ============================================================
// RESULTS & MAPS
// ============================================================

export async function getElectionResults(
    electionId,
    limit = 1000,
    offset = 0
) {
    return request(
        `/results/?election_id=${electionId}&limit=${limit}&offset=${offset}`
    );
}

export function getMapResults({ electionId, seatType, state } = {}) {
    const params = new URLSearchParams();
    if (electionId != null) params.append("election_id", electionId);
    if (seatType) params.append("seat_type", seatType);
    if (state) params.append("state", state);

    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/map/results${query}`);
}

// ============================================================
// ANALYTICS & ADVANCED QUERIES
// ============================================================

export function getOverviewAnalytics() {
    return request("/analytics/overview");
}

export async function getHistoricalTrends() {
    const response = await request("/analytics/historical-trends");
    return normalizeData(response);
}

export async function getElectionSummary(electionId = null) {
    const query = electionId ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/election-summary${query}`);
    return response?.data ?? response;
}

export async function getStatePerformance(electionId = null) {
    const query = electionId ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/state-performance${query}`);
    return normalizeData(response);
}

export async function getPartyPerformance(electionId = null, seatType = null) {
    const params = new URLSearchParams();
    if (electionId) params.append("election_id", electionId);
    if (seatType) params.append("seat_type", seatType);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await request(`/analytics/party-performance${query}`);
    return normalizeData(response);
}

export function getWinningMargins() {
    return request("/analytics/winning-margins");
}

export async function getPartySeatDistribution(electionId = null, seatType = null) {
    const params = new URLSearchParams();
    if (electionId) params.append("election_id", electionId);
    if (seatType) params.append("seat_type", seatType);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await request(`/analytics/seat-counts${query}`);
    return normalizeData(response);
}

export async function getStateSeatDistribution(electionId = null) {
    const query = electionId ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/state-performance${query}`);
    return normalizeData(response);
}

export function getElectionTrends(seatId = null) {
    const query = seatId ? `?seat_id=${seatId}` : "";
    return request(`/analytics/election-comparison${query}`);
}

// ============================================================
// INTELLIGENCE ALERTS & PIPELINE LOGS (SYSTEM TELEMETRY)
// ============================================================

export async function getIntelligenceAlerts(electionId = null) {
    const query = electionId != null ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/intelligence-alerts${query}`);
    return normalizeData(response);
}

export async function getPipelineLogs(limit = 5) {
    const response = await request(`/analytics/pipeline-logs?limit=${limit}`);
    return normalizeData(response);
}

// ============================================================
// COMPATIBILITY ALIASES (Requested by hooks/components)
// ============================================================

export async function getElectionPartyPerformance(electionId = null, seatType = null) {
    return getPartyPerformance(electionId, seatType);
}

export async function getElectionSeatCounts(electionId = null, seatType = null) {
    return getPartySeatDistribution(electionId, seatType);
}

export async function getElectionStatePerformance(electionId = null) {
    return getStatePerformance(electionId);
}

// ============================================================
// API BUNDLE OBJECT
// ============================================================

export const api = {
    getDashboardAnalytics() {
        return request("/analytics/overview");
    },
    getElections,
    getElection,
    getElectionResults,
    getElectionSummary,
    getPartySeatDistribution,
    getElectionSeatCounts,
    getStateSeatDistribution,
    getElectionStatePerformance,
    getElectionTrends,
    getHistoricalTrends,
    getOverviewAnalytics,
    getStatePerformance,
    getPartyPerformance,
    getElectionPartyPerformance,
    getWinningMargins,
    getStates,
    getSeats,
    getResults,
    getMapResults,
    getCandidates,
    getParties,
    getIntelligenceAlerts,
    getPipelineLogs,
};
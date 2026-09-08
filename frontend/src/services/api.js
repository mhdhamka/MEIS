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
    const response = await request(`/elections/${encodeURIComponent(electionId)}`);
    return response?.data ?? response;
}

export function getSeats() {
    return request("/seats/");
}

export async function getCandidates(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "all"
        ) {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    const response = await request(
        `/candidates/${queryString ? `?${queryString}` : ""}`
    );
    
    return response;
}

export async function getCandidate(id) {
    const response = await request(`/candidates/${encodeURIComponent(id)}`);
    return response?.data ?? response;
}

export function getParties() {
    return request("/parties/");
}

export async function getParty(id) {
    const response = await request(`/parties/${encodeURIComponent(id)}`);
    return response?.data ?? response;
}

export function getResults() {
    return request("/results/");
}

// ============================================================
// CONSTITUENCIES
// ============================================================

export async function getConstituencies(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "all"
        ) {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    const response = await request(
        `/analytics/constituencies${queryString ? `?${queryString}` : ""}`
    );
    
    return response; 
}

export async function getConstituency(seatId) {
    const response = await request(
        `/analytics/constituencies/${encodeURIComponent(seatId)}`
    );
    return response?.data ?? response;
}

export async function getConstituencyHistory(seatId) {
    const response = await request(
        `/analytics/constituencies/${encodeURIComponent(seatId)}`
    );
    const profile = response?.data ?? response;
    return profile?.history ?? [];
}

// ============================================================
// RESULTS & MAPS (Updated to include /analytics prefix)
// ============================================================

export async function getElectionResults(
    electionId,
    limit = 1000,
    offset = 0
) {
    if (electionId) {
        return request(
            `/analytics/results/${encodeURIComponent(electionId)}?limit=${limit}&offset=${offset}`
        );
    }
    return request(`/analytics/results/?limit=${limit}&offset=${offset}`);
}

export async function getElectionResult(id) {
    const response = await request(`/analytics/results/${encodeURIComponent(id)}`);
    return response?.data ?? response;
}

export function getMapResults({ electionId, seatType, state } = {}) {
    const params = new URLSearchParams();
    if (electionId != null && electionId !== "all") params.append("election_id", electionId);
    if (seatType && seatType !== "all") params.append("seat_type", seatType);
    if (state && state !== "all") params.append("state", state);

    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/map/results${query}`);
}

// ============================================================
// ANALYTICS & ADVANCED QUERIES
// ============================================================

export function getDashboardAnalytics() {
    return request("/analytics/dashboard");
}

export function getOverviewAnalytics() {
    return request("/analytics/overview");
}

export async function getHistoricalTrends() {
    const response = await request("/analytics/historical-trends");
    return normalizeData(response);
}

export async function getElectionSummary(electionId = null) {
    const query = electionId && electionId !== "all" ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/election-summary${query}`);
    return response?.data ?? response;
}

export async function getStatePerformance(electionId = null) {
    const query = electionId && electionId !== "all" ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/state-performance${query}`);
    return normalizeData(response);
}

export async function getPartyPerformance(electionId = null, seatType = null) {
    const params = new URLSearchParams();
    if (electionId && electionId !== "all") params.append("election_id", electionId);
    if (seatType && seatType !== "all") params.append("seat_type", seatType);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await request(`/analytics/party-performance${query}`);
    return normalizeData(response);
}

export function getWinningMargins() {
    return request("/analytics/winning-margins");
}

export async function getPartySeatDistribution(electionId = null, seatType = null) {
    const params = new URLSearchParams();
    if (electionId && electionId !== "all") params.append("election_id", electionId);
    if (seatType && seatType !== "all") params.append("seat_type", seatType);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await request(`/analytics/seat-counts${query}`);
    return normalizeData(response);
}

export async function getStateSeatDistribution(electionId = null) {
    const query = electionId && electionId !== "all" ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/state-performance${query}`);
    return normalizeData(response);
}

export function getElectionComparison() {
    return request("/analytics/election-comparison");
}

export function getElectionTrends(seatId = null) {
    const query = seatId && seatId !== "all" ? `?seat_id=${seatId}` : "";
    return request(`/analytics/election-comparison${query}`);
}

export function getMarginDistribution() {
    return request("/analytics/margin-distribution");
}

export function getTurnout() {
    return request("/analytics/turnout");
}

export function getSwing() {
    return request("/analytics/swing");
}

// ============================================================
// INTELLIGENCE ALERTS & PIPELINE LOGS (SYSTEM TELEMETRY)
// ============================================================

export async function getIntelligenceAlerts(electionId = null) {
    const query = electionId != null && electionId !== "all" ? `?election_id=${electionId}` : "";
    const response = await request(`/analytics/intelligence-alerts${query}`);
    return normalizeData(response);
}

export async function getPipelineLogs(limit = 5) {
    const response = await request(`/analytics/pipeline-logs?limit=${limit}`);
    return normalizeData(response);
}

// ============================================================
// COMPATIBILITY ALIASES
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
    getDashboardAnalytics,
    getElections,
    getElection,
    getElectionResults,
    getElectionResult,
    getElectionSummary,
    getPartySeatDistribution,
    getElectionSeatCounts,
    getStateSeatDistribution,
    getElectionStatePerformance,
    getElectionComparison,
    getElectionTrends,
    getHistoricalTrends,
    getOverviewAnalytics,
    getStatePerformance,
    getPartyPerformance,
    getElectionPartyPerformance,
    getWinningMargins,
    getMarginDistribution,
    getTurnout,
    getSwing,
    getStates,
    getSeats,
    getResults,
    getMapResults,
    getCandidates,
    getCandidate,
    getParties,
    getParty,
    getIntelligenceAlerts,
    getPipelineLogs,
    getConstituencies,
    getConstituency,
    getConstituencyHistory,
};